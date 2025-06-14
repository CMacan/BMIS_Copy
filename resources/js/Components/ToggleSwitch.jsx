"use client";

import { useState } from "react";

export default function ToggleSwitch({ isChecked, onChange }) {
  return (
    <div
      className={`relative w-12 h-6 flex items-center bg-gray-500 rounded-full p-1 cursor-pointer transition-all ${
        isChecked ? "bg-green-700" : "bg-gray-400"
      }`}
      onClick={() => onChange(!isChecked)}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${
          isChecked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </div>
  );
}
