import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"; 
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const RiderEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🔹 Get completed parcels
  const { data: parcels = [] } = useQuery({
    queryKey: ["rider-completed", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/allparcel/completed?rider_email=${user.email}`
      );
      return res.data;
    },
  });

  // 🔹 Add earning calculation
  const parcelsWithEarning = useMemo(() => {
    return parcels.map((parcel) => {
      const sameRegion =
        parcel.sender_region === parcel.receiver_region;

      const earning = sameRegion
        ? parcel.delivery_cost * 0.8
        : parcel.delivery_cost * 0.3;

      return {
        ...parcel,
        earning,
      };
    });
  }, [parcels]);

  // 🔎 Filter by date
  const filteredParcels = useMemo(() => {
    return parcelsWithEarning.filter((parcel) => {
      if (!startDate || !endDate) return true;

      const deliveredDate = new Date(parcel.delivered_at);
      return (
        deliveredDate >= new Date(startDate) &&
        deliveredDate <= new Date(endDate)
      );
    });
  }, [parcelsWithEarning, startDate, endDate]);

  // 📅 Weekly & Monthly
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);

  const monthAgo = new Date();
  monthAgo.setMonth(now.getMonth() - 1);

  const weeklyEarning = parcelsWithEarning
    .filter(p => new Date(p.delivered_at) >= weekAgo)
    .reduce((sum, p) => sum + p.earning, 0);

  const monthlyEarning = parcelsWithEarning
    .filter(p => new Date(p.delivered_at) >= monthAgo)
    .reduce((sum, p) => sum + p.earning, 0);

  const totalEarning = parcelsWithEarning.reduce(
    (sum, p) => sum + p.earning,
    0
  );

  // 📊 Chart Data (Daily)
  const chartData = filteredParcels.map(p => ({
    date: new Date(p.delivered_at).toLocaleDateString(),
    earning: p.earning
  }));

  return (
    <div className="p-6 space-y-6">

      {/* 🔹 Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow p-4">
          <h3>Total Earnings</h3>
          <p className="text-xl font-bold">৳ {totalEarning.toFixed(2)}</p>
        </div>

        <div className="card bg-base-100 shadow p-4">
          <h3>This Week</h3>
          <p className="text-xl font-bold text-green-600">
            ৳ {weeklyEarning.toFixed(2)}
          </p>
        </div>

        <div className="card bg-base-100 shadow p-4">
          <h3>This Month</h3>
          <p className="text-xl font-bold text-blue-600">
            ৳ {monthlyEarning.toFixed(2)}
          </p>
        </div>
      </div>

      {/* 🔎 Date Filter */}
      <div className="flex gap-4">
        <input
          type="date"
          className="input input-bordered"
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="input input-bordered"
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* 📊 Earnings Chart */}
      <div className="bg-white p-4 rounded-xl shadow h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="earning" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 💰 Cashout Button */}
      <button
        className="btn btn-success"
        onClick={async () => {
          await axiosSecure.post("/rider/cashout", {
            rider_email: user.email,
            amount: totalEarning
          });
          alert("Cashout Requested");
        }}
      >
        Request Cashout
      </button>
    </div>
  );
};

export default RiderEarnings;