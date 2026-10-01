# Architecture Overview

## Structural Layers

1. **DesktopKite / MobileKite:** Primary layout managers handling the browser shell, tab strips, aura sidebars, gesture tracking, and Omnibox URL routing with native protocol support (`web4://`, `web3p://`, `kite://`).
2. **uSafe Identity Integration (`src/services/usafeAuth.ts` & `USafeAuthModal.tsx`):**
   - Implements the official uSafe Identity Ecosystem specification (`auth.usafe.in`).
   - WebAuthn/FIDO2 hardware passkeys (Touch ID, Windows Hello, YubiKey, StrongBox Ed25519).
   - Generates and verifies ES256 JWT tokens and PASETO session claims (`sub`, `handle`, `role`, `tier`, `permissions`, `node`).
   - Mobile passkey pairing QR code flow for cross-device authentication.
3. **Web4 & Web3 Plus Bridge (`src/services/web4Bridge.ts` & `Web4MeshModal.tsx`):**
   - Decentralized egress routing over OpenClaw mesh relays (e.g., Zurich-04, Reykjavik-02, Mumbai-01).
   - End-to-end encrypted multi-hop tunnels using XChaCha20-Poly1305.
   - Zero-telemetry execution sandbox for decentralized applications.
4. **Electron Native Desktop Runtime (`electron/main.cjs` & `electron/preload.cjs`):**
   - Frameless tactical obsidian desktop window with native title bar controls (minimize, maximize, close) connected via IPC.
   - Privileged protocol registrations for `web4://`, `web3p://`, and `kite://`.
   - Native Secure Enclave bridge for passkey authentication.
5. **KiteLogo:** The SVG brand heart of the application with Framer Motion heartbeat pulse.
6. **RamSaverChart:** A D3.js component rendering dynamic memory allocation across workspace islands.
7. **GestureCanvas:** Invisible 2D Canvas overlay rendering subtle glowing mouse trails for right-click gesture navigation.
8. **Installer:** Standalone view for one-click setup and OpenClaw node configuration.

## Theming & Design System
- **Obsidian Theme:** `#0E0E10`, `#101217`, `#14161D`, with borders in `#2A2E35`.
- **Accents:** Amber (`#DDA15E`), Emerald (`#52B788`), and Deep Purple (`#7E78D2`).
- **Profile Ring:** Sleek emerald green ring (`ring-2 ring-[#52B788]`) encircling the active sovereign avatar circle.
