# WebLink Extension - Configurable Dropdown Menu

This extension now features a properly structured, configurable dropdown menu system that follows React best practices and design principles.

## 🏗️ Architecture

### Components Structure

```
src/
├── components/
│   ├── LoggedInView.tsx          # Main logged-in view component
│   ├── ConfigurableDropdown.tsx  # Reusable dropdown component
│   ├── BookmarkButton.tsx        # Reusable bookmark button
│   ├── BackgroundGlow.tsx        # Background effect component
│   └── ui/                       # UI component library
├── config/
│   └── dropdownConfig.ts         # Dropdown configuration file
└── App.js                       # Main app component
```

## 🎛️ Configurable Dropdown Menu

The dropdown menu is now completely configurable through the `dropdownConfig.ts` file. You can easily modify the dropdown options without touching component code.

### Configuration Structure

```typescript
interface DropdownOption {
  id: string; // Unique identifier
  label: string; // Display text
  type: "checkbox" | "button" | "separator";
  checked?: boolean; // For checkboxes
  disabled?: boolean; // Disable option
  onClick?: () => void; // Custom click handler
}

interface DropdownConfig {
  title: string; // Dropdown button text
  options: DropdownOption[]; // Array of options
}
```

### Pre-configured Options

1. **Default Configuration** - Standard tag management
2. **Minimal Configuration** - Simplified interface
3. **Advanced Configuration** - Full-featured options

### How to Modify the Dropdown

#### 1. Edit Existing Configuration

Open `src/config/dropdownConfig.ts` and modify the `defaultDropdownConfig`:

```typescript
export const defaultDropdownConfig: DropdownConfig = {
  title: "Add tags",
  options: [
    {
      id: "work-tag",
      label: "Work",
      type: "checkbox",
      checked: true,
    },
    {
      id: "personal-tag",
      label: "Personal",
      type: "checkbox",
      checked: false,
    },
    // ... more options
  ],
};
```

#### 2. Create Custom Configuration

Use the helper function to create new configurations:

```typescript
const myCustomConfig = createDropdownConfig("My Tags", [
  { label: "Important", type: "checkbox", checked: true },
  { label: "Urgent", type: "checkbox", checked: false },
  { label: "", type: "separator" },
  { label: "+ Add Custom Tag", type: "button" },
]);
```

#### 3. Add New Option Types

Extend the `DropdownOption` interface to support new option types:

```typescript
type OptionType = "checkbox" | "button" | "separator" | "input" | "select";
```

## 🎨 Design Principles

### 1. Component Composition

- Each component has a single responsibility
- Components are reusable and composable
- Clear separation of concerns

### 2. Type Safety

- Full TypeScript support
- Proper interface definitions
- Type-safe configuration

### 3. Consistent Styling

- Uses Tailwind CSS for consistent styling
- Follows design system patterns
- Responsive and accessible

### 4. State Management

- Local state for UI interactions
- Configurable state through props
- Clean state updates

## 🚀 Features

### Dynamic Tag Addition

- Click "+ Add a new tag" to create new tags
- Real-time input with Enter/Escape handling
- Tags are added to the configuration dynamically

### Configuration Switching

- Switch between different dropdown configurations
- Live preview of changes
- Easy testing of different layouts

### Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly

## 🔧 Usage Examples

### Basic Usage

```typescript
import { defaultDropdownConfig } from "./config/dropdownConfig";

// Use default configuration
const [config, setConfig] = useState(defaultDropdownConfig);
```

### Custom Configuration

```typescript
const customConfig = createDropdownConfig("Quick Actions", [
  { label: "Bookmark", type: "checkbox", checked: true },
  { label: "Share", type: "checkbox", checked: false },
  { label: "", type: "separator" },
  { label: "+ Add Action", type: "button" },
]);
```

### Dynamic Updates

```typescript
const updateOption = (optionId: string, updates: Partial<DropdownOption>) => {
  setConfig((prev) => ({
    ...prev,
    options: prev.options.map((option) =>
      option.id === optionId ? { ...option, ...updates } : option
    ),
  }));
};
```

## 📝 Development Notes

- All components are properly typed with TypeScript
- Follows React best practices and hooks patterns
- Uses modern CSS with Tailwind for styling
- Implements proper error boundaries and fallbacks
- Maintains consistent code style and structure

## 🎯 Next Steps

To extend the dropdown functionality:

1. Add new option types (input fields, select dropdowns)
2. Implement persistence for user preferences
3. Add drag-and-drop reordering
4. Create a visual configuration editor
5. Add validation for custom options
