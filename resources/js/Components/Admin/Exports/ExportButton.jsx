import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ExportButton = ({ onExportExcel, onExportPdf, exportParams }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Default export handlers
  const handleExportExcel = () => {
    axios
      .get("/export-voters", {
        params: exportParams,
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "voters.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Excel export failed:", error);
      });
  };

  const handleExportPdf = () => {
    axios
      .get("/export-voters-pdf", {
        params: exportParams,
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "voters.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("PDF export failed:", error);
      });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Export
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
          <button
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left rounded-t-lg"
            onClick={onExportExcel || handleExportExcel}
          >
            Export to Excel
          </button>
          <button
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left rounded-b-lg"
            onClick={onExportPdf || handleExportPdf}
          >
            Export to PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;