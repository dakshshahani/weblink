// Configuration file for dropdown options
// This makes it easy to modify the dropdown menu without touching component code

// Default configuration - easily modifiable
export const defaultDropdownConfig = {
  title: "Add tags",
  options: [
    {
      id: "status-bar",
      label: "Status Bar",
      type: "checkbox",
      checked: true,
    },
    {
      id: "activity-bar",
      label: "Activity Bar",
      type: "checkbox",
      checked: false,
    },
    {
      id: "panel",
      label: "Panel",
      type: "checkbox",
      checked: false,
    },
    {
      id: "separator-1",
      label: "",
      type: "separator",
    },
    {
      id: "add-new-tag",
      label: "+ Add a new tag",
      type: "button",
      onClick: () => alert("Add new tag clicked"),
    },
  ],
};

// Alternative configurations for different use cases
export const minimalDropdownConfig = {
  title: "Quick Actions",
  options: [
    {
      id: "bookmark",
      label: "Bookmark",
      type: "checkbox",
      checked: true,
    },
    {
      id: "add-new-tag",
      label: "+ Add tag",
      type: "button",
    },
  ],
};

export const advancedDropdownConfig = {
  title: "Tag Management",
  options: [
    {
      id: "status-bar",
      label: "Status Bar",
      type: "checkbox",
      checked: true,
    },
    {
      id: "activity-bar",
      label: "Activity Bar",
      type: "checkbox",
      checked: false,
    },
    {
      id: "panel",
      label: "Panel",
      type: "checkbox",
      checked: false,
    },
    {
      id: "sidebar",
      label: "Sidebar",
      type: "checkbox",
      checked: true,
    },
    {
      id: "separator-1",
      label: "",
      type: "separator",
    },
    {
      id: "add-new-tag",
      label: "+ Add a new tag",
      type: "button",
    },
    {
      id: "manage-tags",
      label: "Manage existing tags",
      type: "button",
      onClick: () => alert("Manage tags clicked"),
    },
  ],
};

// Helper function to create custom configurations
export function createDropdownConfig(title, options) {
  return {
    title,
    options: options.map((option, index) => ({
      ...option,
      id: option.id || `option-${index}`,
    })),
  };
}

// Example usage:
// const customConfig = createDropdownConfig("My Tags", [
//   { label: "Work", type: "checkbox", checked: true },
//   { label: "Personal", type: "checkbox", checked: false },
//   { label: "", type: "separator" },
//   { label: "+ Add Tag", type: "button" },
// ]);
