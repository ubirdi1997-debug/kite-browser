# Kite Browser Project 🪁

Welcome to the Kite Browser repository. This project defines the frontend interface, architecture, and design system of the next-generation privacy-first workspace.

## 🌟 Overview

Kite is a secure, decentralized browser built with web technologies and designed for the OpenClaw mesh network. It features zero-telemetry operations, strong enclave encryption (StrongBox), an integrated "RAM Saver", and seamless uSafe SSO authentication.

### Core Features

- **Tauri Shell Native Design:** Beautiful desktop framing with custom window controls.
- **uSafe Sovereign ID:** Fast, secure SSO authentication substituting legacy passkeys.
- **OpenClaw Mesh Network:** A decentralized topology ensuring maximum privacy. The beating heartbeat of the Kite Logo indicates a live, synced connection to a sideloaded OpenClaw Node.
- **RAM Saver:** Dynamically manages tab resources and unloads unused 'islands' from memory.
- **Gesture Canvas:** Right-click dragging invokes a sleek neon path that allows quick back/forward navigation.
- **Vault:** Built-in credentials manager supporting Ed25519 and P-256 passkeys.

## 🚀 Getting Started

Ensure you have Node.js and npm installed.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 🏗 Architecture

- **React & TypeScript:** Core UI frameworks.
- **Tailwind CSS:** For all styling. Uses a tactical obsidian/dark mode default design system.
- **Framer Motion:** High-performance, physics-based animations (e.g. gesture paths, tab swapping).
- **D3.js:** Used for data visualizations such as the memory allocation donut chart.
- **Lucide Icons:** Unified iconography across the workspace.

## 🔒 OpenClaw Integration

The standalone Kite application includes an embedded OpenClaw Node sideloaded alongside the core binary. This prevents tracking points and routes web requests through encrypted tunnels. The **Installer View** simulates this process directly on launch, proving the seamless onboarding experience.

## 👥 Contributors

Built for those who value privacy, speed, and elegance.
