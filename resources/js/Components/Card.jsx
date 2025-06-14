import React from "react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-base font-bold">
    {children}
  </h2>
);

const CardContent = ({ children }) => (
  <div>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardContent };
export default Card;