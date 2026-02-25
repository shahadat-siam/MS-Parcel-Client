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
import DateRangePicker from "../../../Shared/DateRangePicker/DateRangePicker";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";

const RiderEarningSummary = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch completed parcels
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

  // Calculate earning
  const parcelsWithEarning = useMemo(() => {
    return parcels.map((parcel) => {
      const sameRegion =
        parcel.sender_region?.toLowerCase() ===
        parcel.receiver_region?.toLowerCase();

      const earning = sameRegion
        ? parcel.delivery_cost * 0.8
        : parcel.delivery_cost * 0.3;

      return {
        ...parcel,
        earning,
      };
    });
  }, [parcels]);

  // Preset Logic
  const handlePresetSelect = (type) => {
    const now = new Date();

    if (type === "today") {
      const today = now.toISOString().split("T")[0];
      setStartDate(today);
      setEndDate(today);
    }

    if (type === "week") {
      const firstDay = new Date(
        now.setDate(now.getDate() - now.getDay())
      );
      setStartDate(firstDay.toISOString().split("T")[0]);
      setEndDate(new Date().toISOString().split("T")[0]);
    }

    if (type === "month") {
      const firstDay = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      setStartDate(firstDay.toISOString().split("T")[0]);
      setEndDate(new Date().toISOString().split("T")[0]);
    }
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
  };

  // Filter Logic
  const filteredParcels = useMemo(() => {
    if (!startDate && !endDate) return parcelsWithEarning;

    return parcelsWithEarning.filter((parcel) => {
      const deliveredDate = new Date(parcel.delivered_at);

      if (startDate && deliveredDate < new Date(startDate))
        return false;
      if (endDate && deliveredDate > new Date(endDate))
        return false;

      return true;
    });
  }, [parcelsWithEarning, startDate, endDate]);

  const totalEarning = filteredParcels.reduce(
    (sum, p) => sum + p.earning,
    0
  );

  // Chart Data (Grouped by Date)
  const chartData = filteredParcels.map((p) => ({
    date: new Date(p.delivered_at).toLocaleDateString(),
    earning: p.earning,
  }));

  return (
    <div className="p-6 space-y-6">

      {/* Summary Card */}
      <div className="card bg-base-100 shadow p-4">
        <h3 className="text-lg font-semibold">Total Earnings</h3>
        <p className="text-2xl font-bold text-green-600">
          ৳ {totalEarning.toFixed(2)}
        </p>
      </div>

      {/* Date Filter */}
      <DateRangePicker
        label="📅 Filter Earnings"
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
        onReset={handleReset}
        onPresetSelect={handlePresetSelect}
      />

      {/* Chart */}
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
    </div>
  );
};

export default RiderEarningSummary;