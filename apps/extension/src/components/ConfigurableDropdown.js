import React, { useState } from "react";
import { Button } from "./ui/button";

export function ConfigurableDropdown({
  config,
  isOpen,
  onToggle,
  onOptionChange,
  onAddNewTag,
  className = "",
}) {
  const [newTagInput, setNewTagInput] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);

  const handleCheckboxChange = (optionId, checked) => {
    onOptionChange(optionId, { checked });
  };

  const handleAddNewTag = () => {
    if (newTagInput.trim()) {
      onAddNewTag(newTagInput.trim());
      setNewTagInput("");
      setShowAddInput(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddNewTag();
    } else if (e.key === "Escape") {
      setShowAddInput(false);
      setNewTagInput("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Dropdown Trigger */}
      <Button
        onClick={onToggle}
        className="flex items-center justify-between bg-white text-black text-[9px] font-medium rounded-md h-6 w-full px-2 hover:bg-gray-200 transition-colors"
        variant="ghost"
      >
        <span>{config.title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-2.5 h-2.5 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </Button>

      {/* Dropdown Content */}
      <div
        className={`absolute left-0 mt-1 w-full bg-white text-black text-[9px] rounded-md shadow-md border border-gray-200 z-20 p-1.5 space-y-0.5 
          transform transition-all duration-200 ease-out origin-top ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
          }`}
      >
        {config.options.map((option) => {
          if (option.type === "separator") {
            return (
              <div key={option.id} className="border-t border-gray-200 my-1" />
            );
          }

          if (option.type === "checkbox") {
            return (
              <label
                key={option.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-[2px]"
              >
                <input
                  type="checkbox"
                  className="accent-[#180B62] h-2.5 w-2.5"
                  checked={option.checked || false}
                  disabled={option.disabled}
                  onChange={(e) =>
                    handleCheckboxChange(option.id, e.target.checked)
                  }
                />
                <span className={option.disabled ? "text-gray-400" : ""}>
                  {option.label}
                </span>
              </label>
            );
          }

          if (option.type === "button") {
            if (option.id === "add-new-tag" && showAddInput) {
              return (
                <div key={option.id} className="px-2 py-[2px]">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter tag name"
                    className="w-full px-2 py-1 text-[8px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#180B62]"
                    autoFocus
                  />
                  <div className="flex gap-1 mt-1">
                    <button
                      onClick={handleAddNewTag}
                      className="px-2 py-1 text-[8px] bg-[#180B62] text-white rounded hover:bg-[#180B62]/90"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddInput(false);
                        setNewTagInput("");
                      }}
                      className="px-2 py-1 text-[8px] bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={option.id}
                onClick={() => {
                  if (option.id === "add-new-tag") {
                    setShowAddInput(true);
                  } else if (option.onClick) {
                    option.onClick();
                  }
                }}
                className="flex items-center gap-2 w-full text-left px-2 py-[2px] rounded hover:bg-gray-100 text-[#180B62] font-medium"
              >
                <span>{option.label}</span>
              </button>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
