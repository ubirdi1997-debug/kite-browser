import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Fingerprint, 
  Scan, 
  Shield, 
  CheckCircle2, 
  Lock, 
  Key, 
  ArrowRight, 
  Terminal, 
  Globe, 
  RefreshCw, 
  Cpu, 
  Sparkles, 
  X, 
  ChevronRight,
  ChevronDown,
  Layers,
  Zap,
  Radio
} from 'lucide-react';
import { useUsafeAuth } from '../hooks/useUsafeAuth';

export type HandshakeStage = 
  | 'idle' 
  | 'requesting_challenge' 
  | 'biometric_scanning' 
  | 'signing_assertion' 
  | 'verifying_assertion' 
  | 'authenticated';

export interface MobileBiometricOverlayProps {
  onSuccess?: () => void;
  isOpen?: boolean;
}

export function MobileBiometricOverlay({ onSuccess }: MobileBiometricOverlayProps) {
  const { user, loginWithPasskey, logout } = useUsafeAuth();
  const [stage, setStage] = useState<HandshakeStage>(user ? 'authenticated' : 'idle');
  const [biometricType, setBiometricType] = useState<'fingerprint' | 'face'>('fingerprint');
  const [showApiInspector, setShowApiInspector] = useState(false);
  const [activePacket, setActivePacket] = useState<'challenge' | 'assertion' | 'token'>('challenge');

  // Realistic mock cryptographic payload values mapped to auth.usafe.in & api.usafe.in
  const [sessionNonce, setSessionNonce] = useState('0x4e89f2a019b88c714d2e99a1');
  const [signatureHash, setSignatureHash] = useState('0x3045022100e981...78a2');

  const startAuthentication = async () => {
    if (stage !== 'idle') return;

    // Stage 1: Request Challenge from auth.usafe.in & api.usafe.in
    setStage('requesting_challenge');
    const newNonce = '0x' + Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setSessionNonce(newNonce);

    setTimeout(() => {
      // Stage 2: Hardware Biometric Sensor Reading
      setStage('biometric_scanning');

      setTimeout(() => {
        // Stage 3: Secure Enclave Cryptographic Signing
        setStage('signing_assertion');
        const newSig = '0x3045022100' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...ed25519';
        setSignatureHash(newSig);

        setTimeout(async () => {
          // Stage 4: Transmitting to auth.usafe.in /v1/auth/token
          setStage('verifying_assertion');

          setTimeout(async () => {
            // Stage 5: Finalized session
            await loginWithPasskey('@sovereign.kite');
            setStage('authenticated');
            if (onSuccess) onSuccess();
          }, 900);
        }, 1000);
      }, 1200);
    }, 800);
  };

  const resetAuthentication = async () => {
    await logout();
    setStage('idle');
  };

  return (
    <div className="w-full flex flex-col bg-[#14161D] border-t border-[#2A2E35] rounded-t-[32px] p-5 shadow-[0_-15px_50px_rgba(0,0,0,0.8)] relative z-20 overflow-hidden font-sans">
      {/* Top Handle */}
      <div className="w-10 h-1 bg-[#2A2E35] rounded-full mx-auto mb-4" />

      {/* Header with uSafe Ecosystem Badges */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#DDA15E]/15 border border-[#DDA15E]/40 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-[#DDA15E]" />
          </div>
          <div>
            <h3 className="text-[#F4F4F9] text-xs font-bold leading-tight">uSafe FIDO2 Ceremony</h3>
            <span className="text-[9px] font-mono text-[#8D99AE]">auth.usafe.in • api.usafe.in</span>
          </div>
        </div>

        {/* Biometric Toggle Switch */}
        <div className="flex bg-[#0E0E10] border border-[#2A2E35] rounded-lg p-0.5">
          <button
            onClick={() => setBiometricType('fingerprint')}
            className={`px-2 py-1 rounded text-[9px] font-mono transition-colors flex items-center gap-1 ${
              biometricType === 'fingerprint' ? 'bg-[#2A2E35] text-[#DDA15E]' : 'text-[#8D99AE]'
            }`}
          >
            <Fingerprint className="w-3 h-3" />
            Touch
          </button>
          <button
            onClick={() => setBiometricType('face')}
            className={`px-2 py-1 rounded text-[9px] font-mono transition-colors flex items-center gap-1 ${
              biometricType === 'face' ? 'bg-[#2A2E35] text-[#52B788]' : 'text-[#8D99AE]'
            }`}
          >
            <Scan className="w-3 h-3" />
            Face
          </button>
        </div>
      </div>

      {/* Main Biometric Handshake Visualizer Box */}
      <div className="bg-[#0E0E10] border border-[#2A2E35] rounded-2xl p-4 flex flex-col items-center relative overflow-hidden">
        {/* Subtle radial glow based on stage */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            stage === 'authenticated' 
              ? 'bg-[#52B788]/10' 
              : stage === 'biometric_scanning' || stage === 'signing_assertion'
              ? 'bg-[#DDA15E]/10'
              : 'opacity-0'
          }`} 
        />

        {/* Biometric Sensor Scanning Area */}
        <div className="relative w-24 h-24 my-2 flex items-center justify-center">
          {/* Animated concentric pulse rings */}
          {stage === 'biometric_scanning' && (
            <>
              <motion.div 
                className="absolute inset-0 rounded-full border border-[#DDA15E]/40"
                animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full border border-[#52B788]/40"
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
              />
            </>
          )}

          {/* Enclave Ring */}
          <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center relative transition-colors duration-300 ${
            stage === 'authenticated'
              ? 'border-[#52B788] bg-[#52B788]/15 shadow-[0_0_25px_rgba(82,183,136,0.35)]'
              : stage === 'biometric_scanning' || stage === 'signing_assertion'
              ? 'border-[#DDA15E] bg-[#DDA15E]/10 shadow-[0_0_20px_rgba(221,161,94,0.3)]'
              : 'border-[#2A2E35] bg-[#14161D]'
          }`}>
            
            {/* Spinning encryption brackets during signing */}
            {stage === 'signing_assertion' && (
              <motion.div 
                className="absolute -inset-1 rounded-full border-2 border-dashed border-[#DDA15E]"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            )}

            {/* Icon representation */}
            {stage === 'authenticated' ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <CheckCircle2 className="w-10 h-10 text-[#52B788]" />
              </motion.div>
            ) : biometricType === 'fingerprint' ? (
              <Fingerprint className={`w-10 h-10 transition-colors duration-300 ${
                stage === 'biometric_scanning' || stage === 'signing_assertion' 
                  ? 'text-[#DDA15E]' 
                  : 'text-[#8D99AE]'
              }`} />
            ) : (
              <Scan className={`w-10 h-10 transition-colors duration-300 ${
                stage === 'biometric_scanning' || stage === 'signing_assertion' 
                  ? 'text-[#52B788]' 
                  : 'text-[#8D99AE]'
              }`} />
            )}

            {/* Laser scanning beam animation for Touch/Face scan */}
            {stage === 'biometric_scanning' && (
              <motion.div 
                className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#DDA15E] to-transparent shadow-[0_0_8px_#DDA15E]"
                animate={{ y: [-24, 24, -24] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>
        </div>

        {/* Handshake Status Pill & Descriptive Text */}
        <div className="text-center mt-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#181A22] border border-[#2A2E35] text-[10px] font-mono mb-1">
            <span className={`w-1.5 h-1.5 rounded-full ${
              stage === 'authenticated' 
                ? 'bg-[#52B788]' 
                : stage === 'idle' 
                ? 'bg-[#8D99AE]' 
                : 'bg-[#DDA15E] animate-pulse'
            }`} />
            <span className="text-[#F4F4F9] uppercase tracking-wide">
              {stage === 'idle' && 'Waiting for Touch / Sensor'}
              {stage === 'requesting_challenge' && '1/4: Fetching Nonce (api.usafe.in)'}
              {stage === 'biometric_scanning' && '2/4: Biometric Matching (Enclave)'}
              {stage === 'signing_assertion' && '3/4: Ed25519 Signing (TPM)'}
              {stage === 'verifying_assertion' && '4/4: Attestation (auth.usafe.in)'}
              {stage === 'authenticated' && 'Session Verified & Protected'}
            </span>
          </div>

          <p className="text-[10px] font-mono text-[#8D99AE] mt-0.5">
            {stage === 'idle' && 'Touch the sensor to execute WebAuthn ceremony'}
            {stage === 'requesting_challenge' && 'GET /v1/webauthn/challenge • 256-bit Nonce'}
            {stage === 'biometric_scanning' && 'User presence verified via biometric match'}
            {stage === 'signing_assertion' && 'Generating ES256 hardware assertion signature'}
            {stage === 'verifying_assertion' && 'POST /v1/auth/token • Validating payload'}
            {stage === 'authenticated' && '@sovereign.kite • PASETO v4 Session Active'}
          </p>
        </div>

        {/* Live Cryptographic Telemetry Box */}
        <div className="w-full mt-3 pt-3 border-t border-[#1C202A] grid grid-cols-2 gap-2 text-[9px] font-mono">
          <div className="bg-[#14161D] p-2 rounded-lg border border-[#2A2E35]">
            <span className="text-[#8D99AE] block text-[8px]">CHALLENGE NONCE:</span>
            <span className="text-[#DDA15E] truncate block">{sessionNonce}</span>
          </div>
          <div className="bg-[#14161D] p-2 rounded-lg border border-[#2A2E35]">
            <span className="text-[#8D99AE] block text-[8px]">ASSERTION SIGNATURE:</span>
            <span className="text-[#52B788] truncate block">
              {stage === 'idle' ? '0x0000000000000000' : signatureHash}
            </span>
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="mt-4 flex gap-2">
        {stage !== 'authenticated' ? (
          <button
            onClick={startAuthentication}
            disabled={stage !== 'idle'}
            className="flex-1 py-3 bg-[#DDA15E] hover:bg-[#e0ae75] text-[#121214] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {stage === 'idle' ? (
              <>
                <Fingerprint className="w-4 h-4" />
                Authenticate Passkey
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Executing Handshake...
              </>
            )}
          </button>
        ) : (
          <button
            onClick={resetAuthentication}
            className="flex-1 py-2.5 bg-[#2A2E35] hover:bg-[#32363e] text-[#F4F4F9] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-test Handshake
          </button>
        )}

        <button
          onClick={() => setShowApiInspector(!showApiInspector)}
          className={`px-3 py-2.5 rounded-xl border text-xs font-mono transition-colors flex items-center gap-1.5 ${
            showApiInspector 
              ? 'bg-[#181A22] border-[#DDA15E] text-[#DDA15E]' 
              : 'bg-[#14161D] border-[#2A2E35] text-[#8D99AE] hover:text-[#F4F4F9]'
          }`}
          title="Map Out uSafe API Ecosystem"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>API Map</span>
        </button>
      </div>

      {/* Expandable uSafe API Contract & Architecture Map */}
      <AnimatePresence>
        {showApiInspector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 bg-[#0E0E10] border border-[#2A2E35] rounded-2xl p-4 text-[10px] font-mono space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#2A2E35]">
              <span className="font-bold text-[#F4F4F9] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#52B788]" />
                uSafe API Ecosystem Topology
              </span>
              <span className="text-[9px] text-[#52B788]">FIDO2 / WebAuthn v2</span>
            </div>

            {/* Sub-Tabs for endpoints */}
            <div className="flex gap-1 bg-[#14161D] p-1 rounded-lg border border-[#2A2E35]">
              <button
                onClick={() => setActivePacket('challenge')}
                className={`flex-1 py-1 rounded text-center transition-colors ${
                  activePacket === 'challenge' ? 'bg-[#2A2E35] text-[#DDA15E] font-bold' : 'text-[#8D99AE]'
                }`}
              >
                api.usafe.in
              </button>
              <button
                onClick={() => setActivePacket('assertion')}
                className={`flex-1 py-1 rounded text-center transition-colors ${
                  activePacket === 'assertion' ? 'bg-[#2A2E35] text-[#52B788] font-bold' : 'text-[#8D99AE]'
                }`}
              >
                auth.usafe.in
              </button>
              <button
                onClick={() => setActivePacket('token')}
                className={`flex-1 py-1 rounded text-center transition-colors ${
                  activePacket === 'token' ? 'bg-[#2A2E35] text-[#7E78D2] font-bold' : 'text-[#8D99AE]'
                }`}
              >
                Token Claims
              </button>
            </div>

            {/* Packet Details */}
            {activePacket === 'challenge' && (
              <div className="space-y-1.5 text-[#8D99AE]">
                <div className="text-[#DDA15E] font-bold">POST https://api.usafe.in/v1/webauthn/challenge</div>
                <div>Request Payload:</div>
                <div className="bg-[#14161D] p-2 rounded border border-[#2A2E35] text-[#F4F4F9]">
                  {`{\n  "rpId": "usafe.in",\n  "handle": "@sovereign.kite",\n  "userVerification": "required",\n  "attestation": "direct"\n}`}
                </div>
                <div className="text-[9px] text-[#52B788]">Returns: 32-byte cryptographically secure challenge nonce</div>
              </div>
            )}

            {activePacket === 'assertion' && (
              <div className="space-y-1.5 text-[#8D99AE]">
                <div className="text-[#52B788] font-bold">POST https://auth.usafe.in/v1/auth/token</div>
                <div>WebAuthn Assertion Payload:</div>
                <div className="bg-[#14161D] p-2 rounded border border-[#2A2E35] text-[#F4F4F9]">
                  {`{\n  "id": "fido2-ed25519-strongbox-0x89",\n  "authenticatorData": "0x49960de588...",\n  "clientDataJSON": "eyJnZXQiOiAiY...",\n  "signature": "${signatureHash}"\n}`}
                </div>
                <div className="text-[9px] text-[#52B788]">Returns: PASETO v4 local session & ES256 JWT bearer token</div>
              </div>
            )}

            {activePacket === 'token' && (
              <div className="space-y-1.5 text-[#8D99AE]">
                <div className="text-[#7E78D2] font-bold">Token Structure (RFC 7519 / PASETO v4):</div>
                <div className="bg-[#14161D] p-2 rounded border border-[#2A2E35] text-[#F4F4F9]">
                  {`{\n  "sub": "@sovereign.kite",\n  "tier": "pro",\n  "role": "developer",\n  "node": "ap-south-1 (Mumbai Relay)",\n  "iss": "https://auth.usafe.in",\n  "exp": 1696012800\n}`}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
