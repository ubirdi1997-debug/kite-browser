# Kite Browser Implementation Details

This document provides an overview of the core engineering implementations, design systems, and architectural patterns used across the Kite Browser project.

## Core Modules & Functionality

### 1. `DesktopKite.tsx`
The primary window framing and state manager for the Kite Browser.
- **Islands & Tab Grouping:** Custom logic utilizing Framer Motion's `<Reorder.Group>` allows users to drag, drop, and rearrange tabs. Tabs can be grouped into "Islands" to preserve working contexts across multiple nested web views.
- **uSafe Identity Integration:** The `isLoggedIn` state controls conditional rendering across the application. When unauthenticated, users are prompted via the Welcome tutorial to sign in using SSO or the Firebase CLI connector. Upon successful login, the `UserCircle2` icon transitions into the user's fetched profile picture (`<img>`).
- **Settings Ecosystem:** Houses multi-modal settings overlays including:
  - **RAM Saver:** Memory allocation management.
  - **Security Vault:** Encrypted passkey/password manager mimicking the StrongBox interface.
  - **Keyboard Shortcuts:** A mapping listener (`useEffect`) tracking global shortcuts like `Cmd/Ctrl + T` (New Tab) or `Cmd/Ctrl + J` (Toggle Aura).

### 2. `Installer.tsx`
Simulates a seamless, one-click Tauri installation procedure for sideloading the decentralized OpenClaw Node.
- Built using React state combined with timed intervals to progress through the installation sequence (unpacking binaries, sideloading OpenClaw, configuring mesh networks).

### 3. `GestureCanvas.tsx`
An invisible `<canvas>` overlay sitting above the browser layout, initialized via `useRef` and `useEffect`.
- Detects continuous right-click-and-drag mouse movements.
- Draws smooth geometric paths tracing user actions using native Canvas 2D API (`lineTo`, `bezierCurveTo`).
- Actions map automatically to 'Go Back' (amber glow) and 'Go Forward' (green glow).

### 4. `RamSaverChart.tsx`
Integrates `d3.js` to render a living donut chart of active memory allocations per browser island (e.g., Work, Social, Writing).
- Processes `RamData[]` metrics directly into responsive SVG paths (`d3.arc()`).
- Enables immediate visualization of system resource drains without heavy third-party React charting libraries.

### 5. `KiteLogo.tsx`
An inline SVG component embodying the brand's visual identity.
- Embedded `framer-motion` properties generate an infinite, pulsating heartbeat effect via `drop-shadow`.
- Gradients transition from vibrant amber (`#FF6B00`) down to sleek slate/gray (`#8D99AE` to `#3D4351`) to contrast effectively against the obsidian layout backgrounds.

## Theming & Styling System

The application relies strictly on Tailwind CSS with a highly customized color palette:
- **Canvas / Backgrounds:** `#0E0E10`, `#101217`, `#14161D`
- **Borders & Strokes:** `#2A2E35`
- **Primary Text:** `#F4F4F9`
- **Secondary Text:** `#8D99AE`
- **Accents:** 
  - Amber / Orange (`#DDA15E`, `#FF6B00`) for primary actions and back navigation.
  - Emerald Green (`#52B788`) for forward navigation and success states.
  - Deep Purple (`#7E78D2`) for security and vault contexts.

## External Libraries
- **Framer Motion (`motion/react`):** Powers all micro-interactions, modal transitions, and drag-and-drop mechanics.
- **Lucide React:** Supplies the uniform icon set used across the sidebar, tabs, and settings modals.
- **D3 (`d3`):** Handles complex path generation and math for the RAM Saver donut chart.
