import React from "react"

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Declined: "bg-red-100 text-red-800",
  }

  if (!status) {
    return null
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default StatusBadge