"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { BackgroundGlow } from "./BackgroundGlow";
import { ConfigurableDropdown } from "./ConfigurableDropdown";
import { BookmarkButton } from "./BookmarkButton";
import {
  defaultDropdownConfig,
  minimalDropdownConfig,
  advancedDropdownConfig,
} from "../config/dropdownConfig";

export default function LoggedInView() {
  const [dropdownConfig, setDropdownConfig] = useState(defaultDropdownConfig);
  const [showDropdown, setShowDropdown] = useState(false);
  const [configType, setConfigType] = useState("default");

  // Switch between different configurations
  const switchConfig = (type) => {
    setConfigType(type);
    switch (type) {
      case "minimal":
        setDropdownConfig(minimalDropdownConfig);
        break;
      case "advanced":
        setDropdownConfig(advancedDropdownConfig);
        break;
      default:
        setDropdownConfig(defaultDropdownConfig);
    }
  };

  // Function to update dropdown option state
  const updateDropdownOption = (optionId, updates) => {
    setDropdownConfig((prev) => ({
      ...prev,
      options: prev.options.map((option) =>
        option.id === optionId ? { ...option, ...updates } : option
      ),
    }));
  };

  // Function to add new tag option dynamically
  const addNewTag = (tagName) => {
    const newTag = {
      id: `tag-${Date.now()}`,
      label: tagName,
      type: "checkbox",
      checked: false,
    };

    setDropdownConfig((prev) => ({
      ...prev,
      options: [
        ...prev.options.slice(0, -1),
        newTag,
        prev.options[prev.options.length - 1],
      ],
    }));
  };

  return (
    <div className="relative w-[15rem] h-[15rem] overflow-hidden rounded-lg flex flex-col items-center justify-center text-white bg-neutral-950">
      <BackgroundGlow />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-between text-center px-4 py-3 w-full h-full">
        {/* Logo */}
        <div className="flex items-center justify-center w-full">
          <img
            src="/logo.png"
            alt="WebLink Logo"
            className="w-9 h-9 select-none"
            draggable="false"
          />
        </div>

        {/* Main Actions */}
        <div className="flex flex-col gap-2 w-[10.3rem] mx-auto flex-1 justify-center">
          {/* Bookmark Button */}
          <BookmarkButton />

          {/* Subtitle */}
          <p className="text-[9px] text-gray-300 leading-snug max-w-[11rem]">
            We've determined this page links with /input no/ links!
          </p>

          {/* Configurable Dropdown */}
          <ConfigurableDropdown
            config={dropdownConfig}
            isOpen={showDropdown}
            onToggle={() => setShowDropdown((prev) => !prev)}
            onOptionChange={updateDropdownOption}
            onAddNewTag={addNewTag}
          />
        </div>

        {/* Configuration Switcher */}
        <div className="flex-shrink-0 mt-2">
          <div className="flex gap-1 mb-2">
            {["default", "minimal", "advanced"].map((type) => (
              <button
                key={type}
                onClick={() => switchConfig(type)}
                className={`px-2 py-1 text-[7px] rounded transition-colors ${
                  configType === type
                    ? "bg-[#180B62] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <p className="text-[8px] text-gray-400 max-w-[10rem] text-center leading-snug">
            Add tags in addition to the ones we've identified.
          </p>
        </div>
      </div>
    </div>
  );
}
