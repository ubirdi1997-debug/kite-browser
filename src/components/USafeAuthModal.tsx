import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Shield, Fingerprint, QrCode, CheckCircle2, RefreshCw, X, LogOut, Terminal, Globe, Lock, Cpu, Sparkles, ExternalLink } from 'lucide-react';
import { usafeAuth, USafeUser } from '../services/usafeAuth';
import { web4Bridge } from '../services/web4Bridge';
import { useUsafeAuth } from '../hooks/useUsafeAuth';

interface USafeAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: USafeUser) => void;
}

export function USafeAuthModal({ isOpen, onClose, onSuccess }: USafeAuthModalProps) {
  const { user: currentUser, loginWithPasskey, logout, refreshSession } = useUsafeAuth();
  const [handle, setHandle] = useState('@sovereign.kite');
  const [authStep, setAuthStep] = useState<'idle' | 'prompting' | 'verifying' | 'success'>('idle');
  const [activeTab, setActiveTab] = useState<'passkey' | 'qr' | 'token_inspector'>('passkey');
  const [jwtString, setJwtString] = useState<string>(currentUser ? usafeAuth.generateJwtPayload(currentUser) : '');
  const [refreshing, setRefreshing] = useState(false);

  if (!isOpen) return null;

  const handlePasskeyAuth = async () => {
    setAuthStep('prompting');
    
    // Simulate realistic hardware passkey challenge resolution
    setTimeout(async () => {
      setAuthStep('verifying');
      try {
        const user = await loginWithPasskey(handle);
        if (user) {
          setJwtString(usafeAuth.generateJwtPayload(user));
          setAuthStep('success');
          setTimeout(() => {
            setAuthStep('idle');
            if (onSuccess) onSuccess(user);
            onClose();
          }, 1200);
        } else {
          setAuthStep('idle');
        }
      } catch (e) {
        setAuthStep('idle');
      }
    }, 1000);
  };

  const handleRefreshToken = async () => {
    setRefreshing(true);
    await refreshSession();
    const updated = usafeAuth.getCurrentUser();
    if (updated) {
      setJwtString(usafeAuth.generateJwtPayload(updated));
    }
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleLogout = async () => {
    await logout();
    setJwtString('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] backdrop-blur-md bg-[#0E0E10]/80 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl bg-[#12141B] border border-[#2A2E35] rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col relative"
        >
          {/* Header Accent Bar */}
          <div className="h-1 bg-gradient-to-r from-[#DDA15E] via-[#52B788] to-[#7E78D2]" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2E35] bg-[#101217]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#DDA15E]/10 border border-[#DDA15E]/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#DDA15E]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[#F4F4F9] text-base font-bold tracking-tight">uSafe Identity Ecosystem</h3>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#52B788]/10 text-[#52B788] border border-[#52B788]/20">
                    Web4 / Web3 Plus
                  </span>
                </div>
                <p className="text-[#8D99AE] text-xs font-mono">auth.usafe.in • FIDO2 WebAuthn & PASETO</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl hover:bg-[#181A22] flex items-center justify-center text-[#8D99AE] hover:text-[#F4F4F9] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex px-6 pt-3 border-b border-[#2A2E35] bg-[#101217]/50 gap-2">
            <button
              onClick={() => setActiveTab('passkey')}
              className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'passkey'
                  ? 'border-[#DDA15E] text-[#DDA15E]'
                  : 'border-transparent text-[#8D99AE] hover:text-[#F4F4F9]'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5" />
              Passkey Auth
            </button>

            <button
              onClick={() => setActiveTab('qr')}
              className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'qr'
                  ? 'border-[#DDA15E] text-[#DDA15E]'
                  : 'border-transparent text-[#8D99AE] hover:text-[#F4F4F9]'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              Mobile Passkey QR
            </button>

            <button
              onClick={() => setActiveTab('token_inspector')}
              className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'token_inspector'
                  ? 'border-[#DDA15E] text-[#DDA15E]'
                  : 'border-transparent text-[#8D99AE] hover:text-[#F4F4F9]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              JWT / PASETO Claims
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {activeTab === 'passkey' && (
              <div className="space-y-5">
                {currentUser ? (
                  <div className="bg-[#101217] border border-[#2A2E35] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.displayName}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#52B788] ring-offset-2 ring-offset-[#101217]"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#52B788] rounded-full border-2 border-[#101217] flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-[#101217]" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#F4F4F9]">{currentUser.displayName}</span>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#DDA15E]/10 text-[#DDA15E] border border-[#DDA15E]/20">
                              {currentUser.tier}
                            </span>
                          </div>
                          <span className="text-xs text-[#52B788] font-mono">{currentUser.handle}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-[#8D99AE] font-mono block">Node Relay</span>
                        <span className="text-xs font-mono text-[#F4F4F9]">{currentUser.node}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-3 border-t border-[#2A2E35]">
                      <div>
                        <span className="text-[#8D99AE] block text-[10px]">Credential Hardware</span>
                        <span className="text-[#F4F4F9] text-[11px] truncate block">{currentUser.deviceCredentialId}</span>
                      </div>
                      <div>
                        <span className="text-[#8D99AE] block text-[10px]">Session Status</span>
                        <span className="text-[#52B788] text-[11px]">Valid • Auto-Renew Active</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={handleRefreshToken}
                        disabled={refreshing}
                        className="flex-1 py-2.5 rounded-xl border border-[#2A2E35] bg-[#181A22] text-[#F4F4F9] text-xs font-semibold hover:border-[#DDA15E] transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-[#DDA15E] ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh Token
                      </button>
                      <button
                        onClick={handleLogout}
                        className="py-2.5 px-4 rounded-xl border border-rose-900/40 bg-rose-950/20 text-rose-300 text-xs font-semibold hover:bg-rose-900/40 transition-all flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Disconnect
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#101217] border border-[#2A2E35] rounded-2xl">
                      <label className="text-xs font-semibold text-[#8D99AE] block mb-2 font-mono">
                        uSafe Sovereign Handle
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={handle}
                          onChange={(e) => setHandle(e.target.value)}
                          placeholder="@username"
                          className="w-full bg-[#181A22] border border-[#2A2E35] rounded-xl px-4 py-3 text-sm text-[#F4F4F9] font-mono outline-none focus:border-[#DDA15E] transition-colors"
                        />
                        <span className="absolute right-3 top-3 text-[10px] font-mono text-[#8D99AE] bg-[#101217] px-2 py-0.5 rounded border border-[#2A2E35]">
                          auth.usafe.in
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8D99AE] mt-2">
                        Authenticates against your device's Secure Enclave, YubiKey, or TPM chip.
                      </p>
                    </div>

                    {authStep === 'prompting' && (
                      <div className="p-4 rounded-2xl bg-[#DDA15E]/10 border border-[#DDA15E]/40 flex items-center gap-3 animate-pulse">
                        <Fingerprint className="w-6 h-6 text-[#DDA15E] shrink-0" />
                        <div className="text-xs text-[#F4F4F9]">
                          <span className="font-bold block">Touch your Passkey / Security Key</span>
                          <span className="text-[#8D99AE]">Waiting for biometric confirmation...</span>
                        </div>
                      </div>
                    )}

                    {authStep === 'verifying' && (
                      <div className="p-4 rounded-2xl bg-[#52B788]/10 border border-[#52B788]/40 flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-[#52B788] animate-spin shrink-0" />
                        <div className="text-xs text-[#F4F4F9]">
                          <span className="font-bold block">Verifying ES256 Signature with auth.usafe.in</span>
                          <span className="text-[#8D99AE]">Establishing Web4 / Web3 Plus tunnel session...</span>
                        </div>
                      </div>
                    )}

                    {authStep === 'success' && (
                      <div className="p-4 rounded-2xl bg-[#52B788]/20 border border-[#52B788] flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#52B788] shrink-0" />
                        <div className="text-xs text-[#52B788] font-bold">
                          Passkey Verified! Welcome to the Sovereign Web4 Mesh.
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handlePasskeyAuth}
                      disabled={authStep !== 'idle' || !handle.trim()}
                      className="w-full py-3.5 bg-[#DDA15E] text-[#101217] rounded-xl text-sm font-bold hover:bg-[#e2ad6f] transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(221,161,94,0.3)] disabled:opacity-50"
                    >
                      <Key className="w-4 h-4" />
                      Authenticate with uSafe Passkey
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'qr' && (
              <div className="flex flex-col items-center justify-center p-4 text-center space-y-4">
                <div className="p-4 bg-white rounded-2xl shadow-xl border-4 border-[#101217]">
                  {/* Styled QR Code representation */}
                  <div className="w-48 h-48 bg-slate-900 rounded-lg p-2 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between">
                      <div className="w-12 h-12 border-4 border-emerald-400 p-1"><div className="w-full h-full bg-emerald-400" /></div>
                      <div className="w-12 h-12 border-4 border-emerald-400 p-1"><div className="w-full h-full bg-emerald-400" /></div>
                    </div>
                    <div className="flex items-center justify-center">
                      <Shield className="w-10 h-10 text-[#DDA15E]" />
                    </div>
                    <div className="flex justify-between">
                      <div className="w-12 h-12 border-4 border-emerald-400 p-1"><div className="w-full h-full bg-emerald-400" /></div>
                      <div className="w-10 h-10 border-2 border-dashed border-emerald-300" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#F4F4F9]">uSafe One Mobile Passkey Sync</h4>
                  <p className="text-xs text-[#8D99AE] mt-1 max-w-sm">
                    Open your <strong>uSafe One</strong> mobile app, tap <em>Scan Passkey QR</em>, and approve with your device biometric.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-[#52B788] bg-[#52B788]/10 px-3 py-1.5 rounded-full border border-[#52B788]/20">
                  <Cpu className="w-3.5 h-3.5" />
                  E2E Encrypted QR Handshake Active
                </div>
              </div>
            )}

            {activeTab === 'token_inspector' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8D99AE] font-mono">Issued Token (ES256 / PASETO format):</span>
                  <span className="text-[10px] font-mono text-[#52B788]">Verified Issuer: https://auth.usafe.in</span>
                </div>

                <div className="bg-[#0E0E10] border border-[#2A2E35] rounded-xl p-3 font-mono text-[11px] text-[#8D99AE] break-all max-h-36 overflow-y-auto">
                  {jwtString ? (
                    <span className="text-[#DDA15E]">{jwtString}</span>
                  ) : (
                    <span className="text-[#555]">No active token. Please authenticate using passkey.</span>
                  )}
                </div>

                {currentUser && (
                  <div className="bg-[#101217] border border-[#2A2E35] rounded-xl p-3 font-mono text-[11px] space-y-1.5">
                    <div className="text-[#52B788] font-bold">Token Decoded Claims:</div>
                    <div className="text-[#F4F4F9]">sub: <span className="text-[#DDA15E]">"{currentUser.sub}"</span></div>
                    <div className="text-[#F4F4F9]">tier: <span className="text-[#52B788]">"{currentUser.tier}"</span></div>
                    <div className="text-[#F4F4F9]">node: <span className="text-[#7E78D2]">"{currentUser.node}"</span></div>
                    <div className="text-[#F4F4F9]">permissions: <span className="text-[#8D99AE]">{JSON.stringify(currentUser.permissions)}</span></div>
                    <div className="text-[#F4F4F9]">exp: <span className="text-[#8D99AE]">{new Date(currentUser.exp * 1000).toLocaleString()}</span></div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-6 py-3.5 bg-[#101217] border-t border-[#2A2E35] flex items-center justify-between text-[11px] text-[#8D99AE]">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#52B788]" />
              Zero-Telemetry Web4 Runtime
            </span>
            <span className="font-mono">client_id: kite-browser-web4</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
