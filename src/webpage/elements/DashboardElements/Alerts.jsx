import React from "react";

export default function Alerts({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 w-full md:w-4/5">
      {alerts.map((alert, idx) => {
        let bgColor = "bg-green-100 border-green-400 text-green-900";
        if (alert.type === "warning") bgColor = "bg-yellow-100 border-yellow-400 text-yellow-900";
        if (alert.type === "error") bgColor = "bg-red-100 border-red-400 text-red-900";

        return (
          <div
            key={idx}
            className={`p-3 border-l-4 rounded shadow-md ${bgColor}`}
          >
            {alert.message}
          </div>
        );
      })}
    </div>
  );
}