# Architecture Overview

## Structural Layers
1. **DesktopKite / MobileKite:** Primary layout managers handling the browser shell, tab strips, aura sidebars, and gesture tracking.
2. **KiteLogo:** The SVG heart of the application. It includes Framer Motion properties to pulse (heartbeat) indicating a successful connection to the OpenClaw Node.
3. **RamSaverChart:** A D3.js component injecting a pie/donut chart representing active memory allocation across workspace islands.
4. **GestureCanvas:** An invisible `canvas` overlay that listens to right-click drag events to draw glowing neon trails (purple, amber, green) corresponding to navigation actions.
5. **Installer:** A standalone view designed as a one-click Tauri setup window, displaying the sideload progress of the OpenClaw Node.

## Component Patterns
- **Framing & Dragging:** Handled entirely using Framer Motion's `Reorder` component for tabs.
- **State Management:** All complex local state (workspaces, tabs, gestures, shortcuts) is localized in `DesktopKite.tsx` but is structurally modular for future extraction.
- **Styling:** Tailwind classes using strict HEX colors (`#14161D`, `#DDA15E`, etc.) to maintain the brand identity.
