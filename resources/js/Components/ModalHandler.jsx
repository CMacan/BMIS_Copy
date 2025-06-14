import React from "react";

export default function Modal({ show, onClose, children, disableCloseOnOutsideClick = false }) {
  if (!show) return null;

  const handleBackdropClick = (e) => {
    if (!disableCloseOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="relative z-60 bg-white rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
}
