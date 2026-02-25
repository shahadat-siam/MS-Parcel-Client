import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,} from "recharts";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";

const RiderEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [showCashoutModal, setShowCashoutModal] = useState(false);
  const [cashoutAmount, setCashoutAmount] = useState("");

  // 🔹 1. Earnings Summary (FROM YOUR API)
  const { data: summary = {}, isLoading: summaryLoading } = useQuery({
    queryKey: ["earnings-summary", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rider/earnings-summary?rider_email=${user.email}`
      );
      return res.data;
    },
  });

  // 🔹 2. Completed Parcels (History + Chart)
  const { data: parcels = [], isLoading: parcelLoading } = useQuery({
    queryKey: ["completed-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/allparcel/completed?rider_email=${user.email}`
      );
      return res.data;
    },
  });

  // 🔹 3. Cashout History (IMPORTANT for pending check)
  const { data: cashouts = [] } = useQuery({
    queryKey: ["rider-cashouts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rider/cashouts?rider_email=${user.email}`
      );
      return res.data || [];
    },
  });

  // 🔴 Check Pending Cashout (MAIN LOGIC FIX)
  const hasPendingCashout = cashouts.some(
    (cashout) => cashout.status === "pending"
  );

  // 📊 Chart Data (Daily Earnings)
  const chartData = useMemo(() => {
    const map = {};

    parcels.forEach((parcel) => {
      if (!parcel.delivered_at) return;

      const date = new Date(parcel.delivered_at).toLocaleDateString();

      const sameRegion =
        parcel.sender_region === parcel.receiver_region;

      const earning = sameRegion
        ? parcel.delivery_cost * 0.8
        : parcel.delivery_cost * 0.3;

      map[date] = (map[date] || 0) + earning;
    });

    return Object.keys(map).map((date) => ({
      date,
      earning: map[date],
    }));
  }, [parcels]);

  // 💸 Cashout Mutation (USING YOUR API)
  const cashoutMutation = useMutation({
    mutationFn: async (amount) => {
      const res = await axiosSecure.post("/rider/cashout", {
        rider_email: user.email,
        amount: Number(amount),
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Cashout request submitted!");
      setShowCashoutModal(false);
      setCashoutAmount("");
      queryClient.invalidateQueries(["rider-cashouts"]);
      queryClient.invalidateQueries(["earnings-summary"]);
    },
    onError: () => {
      toast.error("Failed to request cashout");
    },
  });

  // 🧠 Handle Cashout Request
  const handleCashoutSubmit = () => {
    const amount = Number(cashoutAmount);

    if (!amount || amount <= 0) {
      return toast.error("Enter a valid amount");
    }

    if (amount < 500) {
      return toast.error("Minimum withdraw is 500 TK");
    }

    if (amount > (summary.availableBalance || 0)) {
      return toast.error("Insufficient balance");
    }

    if (hasPendingCashout) {
      return toast.error("You already have a pending cashout request!");
    }

    cashoutMutation.mutate(amount);
  };

  if (summaryLoading || parcelLoading) {
    return <p className="p-6">Loading Earnings Dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* 🧾 Header */}
      <div>
        <h1 className="text-2xl font-bold">💰 Rider Earnings Dashboard</h1>
        <p className="text-gray-500">
          Track your earnings, history & cashout requests
        </p>
      </div>


      {/* 💳 Summary Cards */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow p-5 border">
          <h3 className="text-gray-500 text-sm">Total Earnings</h3>
          <p className="text-3xl font-bold text-green-600">
            ৳ {summary.totalEarning?.toFixed(2) || 0}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 border">
          <h3 className="text-gray-500 text-sm">Total Cashed Out</h3>
          <p className="text-3xl font-bold text-blue-600">
            ৳ {summary.totalCashedOut?.toFixed(2) || 0}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 border">
          <h3 className="text-gray-500 text-sm">Available Balance</h3>
          <p className="text-3xl font-bold text-purple-600">
            ৳ {summary.availableBalance?.toFixed(2) || 0}
          </p>
        </div>
      </div>

      {/* ⚠️ Pending Alert */}
      {hasPendingCashout && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-xl">
          ⏳ You already have a pending cashout request. Please wait for admin approval.
        </div>
      )}

      {/* 💸 Cashout Section */}
      <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Cashout Earnings</h2>
          <p className="text-gray-500 text-sm">
            Minimum withdraw: 500 TK
          </p>
        </div>

        <button
          disabled={
            hasPendingCashout ||
            (summary.availableBalance || 0) < 500
          }
          onClick={() => setShowCashoutModal(true)}
          className={`px-6 py-2 rounded-xl text-slate-800 ${hasPendingCashout ||
              (summary.availableBalance || 0) < 500
              ? "bg-primary cursor-not-allowed"
              : "bg-primary cursor-pointer"
            }`}
        >
          Request Cashout
        </button>
      </div>

      {/* 📊 Earnings Chart */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          📊 Daily Earnings Chart
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="earning" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📜 Cashout History Table */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          💳 Cashout History
        </h2>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-100">
              <tr>
                <th>Amount</th>
                <th>Status</th>
                <th>Requested Date</th>
              </tr>
            </thead>
            <tbody>
              {cashouts.map((c) => (
                <tr key={c._id}>
                  <td className="font-semibold">৳ {c.amount}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${c.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>
                    {new Date(c.requested_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 💰 Cashout Modal */}
      {showCashoutModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 space-y-4">
            <h2 className="text-xl font-bold">
              💸 Request Cashout
            </h2>

            <input
              type="number"
              placeholder="Enter amount (Min 500 TK)"
              className="w-full border p-3 rounded-lg"
              value={cashoutAmount}
              onChange={(e) => setCashoutAmount(e.target.value)}
            />

            <p className="text-sm text-gray-500">
              Available Balance: ৳ {summary.availableBalance || 0}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCashoutModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleCashoutSubmit}
                disabled={cashoutMutation.isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderEarnings;