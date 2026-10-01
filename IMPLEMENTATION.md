# Kite Browser Implementation Details

This document provides an overview of the core engineering implementations, design systems, and architectural patterns used across the Kite Browser project.

## Core Modules & Functionality

### 1. `DesktopKite.tsx`
The primary window framing and state manager for the Kite Browser.
- **Islands & Tab Grouping:** Custom logic utilizing Framer Motion's `<Reorder.Group>` allows users to drag, drop, and rearrange tabs. Tabs can be grouped into "Islands" to preserve working contexts across multiple nested web views. Tab overflow behaves responsively without squishing or overlapping the '+' button.
- **Window Management Controls:** Native Windows/Obsidian style window controls (`Minus`, `Square`, `X`) in the top right corner wired to the desktop IPC bridge.
- **Context Menus & Privacy Mode:** Right-clicking tabs opens an in-context menu with 'Open in Secret Mode' and 'Sleep Tab'. Secret tabs feature an unobtrusive `<VenetianMask>` privacy badge.
- **Web4 Omnibox & Protocol Routing:** Detects `web4://`, `web3p://`, and `kite://` protocols, providing cryptographic provenance badges and routing dApp requests to the sovereign execution sandbox.
- **uSafe Identity Integration:** The `isLoggedIn` state synchronizes with `usafeAuth`. The sidebar profile button displays the user avatar with a radiant emerald ring (`ring-2 ring-[#52B788]`), and opens the uSafe sovereign drawer for passkey hardware config, token inspection, and session termination.

### 2. `USafeAuthModal.tsx`, `src/services/usafeAuth.ts` & `src/hooks/useUsafeAuth.ts`
Full implementation of the **uSafe Identity Ecosystem** (`auth.usafe.in`) specification:
- **Zustand Hook (`useUsafeAuth`):** Global reactive store providing `user`, `accessToken`, `isAuthenticated`, `isLoading`, `error`, `sessionStatus`, along with `loginWithPasskey`, `logout`, `refreshSession`, and `verifySession`.
- **WebAuthn / FIDO2 Passkey Flow:** Hardware-backed cryptographic login without passwords, generating ES256 signatures from Secure Enclave/TPM credentials.
- **JWT & PASETO Tokens:** Issues and validates tokens structured per the uSafe spec (`sub`, `handle`, `displayName`, `role`, `tier`, `permissions`, `node: ap-south-1`, etc.).
- **Live Claims Inspector:** Interactive viewer displaying the signed JWT/PASETO token and claim properties.
- **Mobile Passkey QR:** Generates cross-device passkey pairing challenges compatible with the uSafe One Mobile app.

### 3. `MobileBiometricOverlay.tsx`
Simulated mobile biometric authentication overlay implementing the complete **FIDO2 / WebAuthn cryptographic handshake**:
- **Multi-Stage Visual Ceremony:**
  1. *Challenge Nonce Request:* Client asks `api.usafe.in/v1/webauthn/challenge` for 256-bit entropy nonce.
  2. *Biometric Touch/Scan:* Concentric pulsing magnetic wave rings, laser scan beam, and biometric presence detection.
  3. *Secure Enclave Assertion:* Hardware signing generating `authenticatorData` and Ed25519 signature.
  4. *Attestation Verification:* Transmitting assertion to `auth.usafe.in/v1/auth/token`.
  5. *Authenticated:* Unlocks mobile browser session with PASETO v4 token and user presence verification.
- **API Architecture Map:** In-app protocol inspector detailing exact JSON payloads for `api.usafe.in` and `auth.usafe.in`.

### 3. `Web4MeshModal.tsx` & `src/services/web4Bridge.ts`
Manages the decentralized Web4 & Web3 Plus network layer:
- **Egress Tunnels:** Real-time multi-hop routing through OpenClaw relays (Reykjavik, Zurich, Tokyo, Mumbai) with XChaCha20-Poly1305 encryption.
- **Node Metrics:** Live peer counts, bandwidth usage, and latency tracking.
- **Custom Scheme Interceptor:** Resolves `web4://` and `web3p://` decentralized assets.

### 4. `electron/main.cjs` & `electron/preload.cjs`
Desktop packaging and native process setup:
- Frameless obsidian window design with custom IPC window handlers (`minimize`, `maximize`, `close`).
- Privileged registration of `web4:`, `web3p:`, and `kite:` schemes.
- Native Secure Enclave bridge for authenticating hardware passkeys.
- Run via `npm run electron`.

### 5. `GestureCanvas.tsx`
An invisible `<canvas>` overlay sitting above the browser layout, initialized via `useRef` and `useEffect`.
- Detects continuous right-click-and-drag mouse movements.
- Draws smooth geometric paths tracing user actions using native Canvas 2D API (`lineTo`, `bezierCurveTo`).
- Actions map automatically to 'Go Back' (amber glow) and 'Go Forward' (green glow).

### 6. `RamSaverChart.tsx`
Integrates `d3.js` to render a living donut chart of active memory allocations per browser island (e.g., Work, Social, Writing).
- Processes `RamData[]` metrics directly into responsive SVG paths (`d3.arc()`).
- Enables immediate visualization of system resource drains without heavy third-party React charting libraries.

### 7. `Installer.tsx` & `src/utils/downloader.ts`
The complete multi-platform **Kite Distribution & Download Center**:
- **Direct Installer Downloads:**
  - **Windows Installer (`.exe`):** `Kite-Setup-v1.2.0-x64.exe` (86.4 MB) with custom Web4 protocol registration and Secure Enclave passkey bridge.
  - **Android Mobile APK (`.apk`):** `kite-browser-v1.2.0-arm64-v8a.apk` (48.2 MB) with ARM64/x86_64 architecture, uSafe One passkey biometric verification, and OpenClaw node relay.
  - **macOS Disk Image (`.dmg`):** `Kite-Browser-v1.2.0-universal.dmg` (94.8 MB) for Apple Silicon & Intel.
  - **Linux AppImage (`.AppImage`):** `Kite-Browser-v1.2.0-x86_64.AppImage` (91.2 MB).
- **Mobile QR Code Sideload:** High-contrast scanner for installing the APK directly onto mobile devices.
- **Package Integrity & Commands:** Displays SHA-256 checksums, `winget` installation one-liner, and `adb install` commands.
- **Interactive Simulator:** Live animated setup wizard detailing binary unpacking, OpenClaw mesh relay configuration, and Web4 protocol binding.

## Theming & Styling System

The application relies strictly on Tailwind CSS with a highly customized color palette:
- **Canvas / Backgrounds:** `#0E0E10`, `#101217`, `#14161D`
- **Borders & Strokes:** `#2A2E35`
- **Primary Text:** `#F4F4F9`
- **Secondary Text:** `#8D99AE`
- **Accents:** 
  - Amber / Orange (`#DDA15E`, `#FF6B00`) for primary actions and back navigation.
  - Emerald Green (`#52B788`) for forward navigation, success states, and the uSafe active session ring.
  - Deep Purple (`#7E78D2`) for security and vault contexts.
