import type { Preview } from "@storybook/react-vite";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [
        { name: "dark", value: "#0B1120" },
        { name: "light", value: "#F8FAFC" },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals?.theme || "dark";
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
      return Story();
    },
  ],
  globalTypes: {
    theme: {
      description: "Global theme for components",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "dark",
  },
};

export default preview;
