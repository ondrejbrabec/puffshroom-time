import React from "react";

export default function ProgressBar({ percent = 100 }) {
  return (
    <div className="w-40 bg-gray-800 rounded h-2.5">
      <div
        className="bg-yellow-600 h-2.5 rounded-full"
        style={{
          width: percent + "%",
        }}
      ></div>
    </div>
  );
}
