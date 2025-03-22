// Tooltip.jsx
import React from "react";

const Tooltip = ({ text, children, position = "top" }) => {
  return (
    <div className="group relative inline-block">
      {children}
      <span
        className={`invisible absolute z-10 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100 ${position === "top" && "bottom-full left-1/2 mb-2 -translate-x-1/2"} ${position === "bottom" && "top-full left-1/2 mt-2 -translate-x-1/2"} ${position === "left" && "top-1/2 right-full mr-2 -translate-y-1/2"} ${position === "right" && "top-1/2 left-full ml-2 -translate-y-1/2"} `}
      >
        {text}
      </span>
    </div>
  );
};

export default Tooltip;
