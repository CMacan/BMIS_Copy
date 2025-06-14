import React, { useState, createContext, useContext } from "react";
import PropTypes from "prop-types";

const TabsContext = createContext();

export function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabClick = (value) => {
    setActiveTab(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, handleTabClick }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.propTypes = {
  children: PropTypes.node,
  defaultValue: PropTypes.string,
};

export function TabsList({ children, className = "" }) {
  return <div className={`tabs-list ${className}`}>{children}</div>;
}

TabsList.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export function TabsTrigger({ children, value, className = "", onClick }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  const handleClick = () => {
    setActiveTab(value);
    if (onClick) {
      onClick(value);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`tabs-trigger px-4 py-2 ${
        isActive
          ? "bg-white text-gray cursor-default" 
          : "bg-[#C6D1FF] text-gray-700 hover:bg-[#A4B1F5] transition-colors" 
      } ${className}`}
      type="button"
    >
      {children}
    </button>
  );
}

TabsTrigger.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
