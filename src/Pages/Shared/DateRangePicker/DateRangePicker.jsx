import React from "react";

const DateRangePicker = ({
  label = "Filter by Date",
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onReset,
  onPresetSelect,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      <label className="block text-sm font-semibold mb-2">
        {label}
      </label>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => onPresetSelect("today")}
        >
          Today
        </button>

        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => onPresetSelect("week")}
        >
          This Week
        </button>

        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => onPresetSelect("month")}
        >
          This Month
        </button>

        <button
          type="button"
          className="btn btn-sm btn-error"
          onClick={onReset}
        >
          Reset
        </button>
      </div>

      {/* Date Inputs */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="date"
          className="input input-bordered w-full"
          value={startDate || ""}
          onChange={(e) => onStartChange(e.target.value)}
        />

        <input
          type="date"
          className="input input-bordered w-full"
          value={endDate || ""}
          onChange={(e) => onEndChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;