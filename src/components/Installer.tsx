import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KiteLogo } from './KiteLogo';
import { 
  Download, 
  CheckCircle, 
  Terminal, 
  Shield, 
  Zap, 
  Smartphone, 
  Monitor, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink,
  Cpu,
  Lock,
  ArrowDownToLine,
  Layers,
  AlertTriangle,
  Play
} from 'lucide-react';
import { RELEASE_ASSETS, ReleaseAsset, downloadReleaseAsset } from '../utils/downloader';

export function Installer() {
  const [tab, setTab] = useState<'downloads' | 'simulator'>('downloads');
  const [copiedSha, setCopiedSha] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Simulator state
  const [step, setStep] = useState(0); // 0: Start, 1: Installing, 2: Done
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Ready to install');

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // Fallback instruction
      alert('On Android or Desktop: Tap your browser menu (⋮ or Share) and select "Install app" or "Add to Home screen" to install the native WebAPK app with passkey biometric authentication.');
    }
  };

  useEffect(() => {
    if (step === 1) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 5 + 2;
        if (currentProgress > 100) currentProgress = 100;
        
        setProgress(currentProgress);
        
        if (currentProgress < 25) setStatusText('Unpacking hardened Chromium binaries...');
        else if (currentProgress < 50) setStatusText('Configuring Web4 protocol handlers (web4://, web3p://)...');
        else if (currentProgress < 75) setStatusText('Sideloading OpenClaw Relay Node & Mesh Tunnel...');
        else if (currentProgress < 95) setStatusText('Registering uSafe Passkey Secure Enclave...');
        else setStatusText('Installation Complete');
        
        if (currentProgress === 100) {
          clearInterval(interval);
          setTimeout(() => setStep(2), 500);
        }
      }, 140);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleDownload = (asset: ReleaseAsset) => {
    setDownloadingId(asset.id);
    downloadReleaseAsset(asset);
    setTimeout(() => setDownloadingId(null), 1200);
  };

  const copySha = (sha: string) => {
    navigator.clipboard?.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#0E0E10] flex flex-col items-center justify-center p-4 md:p-8 font-sans relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#DDA15E]/10 via-[#52B788]/5 to-[#7E78D2]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-[#12141B] border border-[#2A2E35] rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden relative z-10 flex flex-col">
        
        {/* Fake Window Title Bar */}
        <div className="h-12 bg-[#0E0E10] flex items-center justify-between px-5 border-b border-[#2A2E35]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]/80" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/80" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]/80" />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#8D99AE]">
            <Shield className="w-3.5 h-3.5 text-[#52B788]" />
            <span>Kite Distribution Gateway • Web4 Sovereign Binaries</span>
          </div>

          <div className="flex bg-[#181A22] rounded-lg p-0.5 border border-[#2A2E35]">
            <button
              onClick={() => setTab('downloads')}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
                tab === 'downloads' ? 'bg-[#2A2E35] text-[#F4F4F9]' : 'text-[#8D99AE] hover:text-[#F4F4F9]'
              }`}
            >
              <ArrowDownToLine className="w-3 h-3" />
              Direct Downloads
            </button>
            <button
              onClick={() => setTab('simulator')}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
                tab === 'simulator' ? 'bg-[#2A2E35] text-[#F4F4F9]' : 'text-[#8D99AE] hover:text-[#F4F4F9]'
              }`}
            >
              <Cpu className="w-3 h-3" />
              Live Simulator
            </button>
          </div>
        </div>

        {/* Tab 1: Direct Downloads */}
        {tab === 'downloads' && (
          <div className="p-6 md:p-10 space-y-6 animate-in fade-in duration-200">
            {/* Header info */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#2A2E35] pb-6">
              <div className="flex items-center gap-4">
                <KiteLogo className="w-16 h-16 shrink-0" />
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black text-[#F4F4F9] tracking-tight">Kite Browser Installers</h1>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#52B788]/15 text-[#52B788] border border-[#52B788]/30 font-bold">
                      v1.2.0 Web4
                    </span>
                  </div>
                  <p className="text-xs text-[#8D99AE] mt-1 max-w-lg leading-relaxed">
                    Choose between the one-click Windows desktop installer script, the Android WebAPK package, or the full 86MB native Electron builder.
                  </p>
                </div>
              </div>

              {/* Direct Android / PWA One-Tap Install button */}
              <button
                onClick={handleInstallPwa}
                className="px-4 py-2.5 bg-[#52B788] hover:bg-[#43a175] text-[#101217] rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
              >
                <Smartphone className="w-4 h-4" />
                Install WebAPK to Mobile
              </button>
            </div>

            {/* Crucial Notice regarding .EXE Execution */}
            <div className="bg-[#181A22] border border-[#DDA15E]/40 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#DDA15E] shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-[#F4F4F9] block">
                  How to run Kite Browser on Windows & Android:
                </span>
                <p className="text-[#8D99AE] leading-relaxed">
                  Real Windows executables (.exe) are compiled 86 MB PE binaries. If you download a mock text file disguised as a .exe, Windows flags it as corrupt.
                  Instead, use <strong className="text-[#DDA15E]">Kite-Setup.bat</strong> (Option 1 below), which runs 100% reliably on any Windows PC, creates a desktop shortcut, registers <code className="text-[#52B788]">web4://</code> protocols, and launches Kite in dedicated standalone window.
                </p>
              </div>
            </div>

            {/* Asset Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RELEASE_ASSETS.map((asset) => {
                const isAndroid = asset.platform === 'android';
                const isWindows = asset.platform === 'windows';

                return (
                  <div
                    key={asset.id}
                    className={`bg-[#101217] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-[#DDA15E]/50 ${
                      asset.id === 'win-installer'
                        ? 'border-[#DDA15E]/50 bg-gradient-to-br from-[#101217] via-[#1c1813] to-[#101217]' 
                        : isAndroid 
                        ? 'border-[#52B788]/40 bg-gradient-to-br from-[#101217] via-[#141d18] to-[#101217]'
                        : 'border-[#2A2E35]'
                    }`}
                  >
                    <div>
                      {/* Platform header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {isAndroid ? (
                            <div className="w-8 h-8 rounded-lg bg-[#52B788]/20 border border-[#52B788]/40 flex items-center justify-center text-[#52B788]">
                              <Smartphone className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-[#DDA15E]/20 border border-[#DDA15E]/40 flex items-center justify-center text-[#DDA15E]">
                              <Monitor className="w-4 h-4" />
                            </div>
                          )}

                          <div>
                            <h3 className="text-sm font-bold text-[#F4F4F9]">{asset.name}</h3>
                            <span className="text-[10px] font-mono text-[#8D99AE]">{asset.architecture}</span>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold text-[#F4F4F9] bg-[#181A22] px-2 py-1 rounded-lg border border-[#2A2E35]">
                          {asset.size}
                        </span>
                      </div>

                      <p className="text-xs text-[#8D99AE] leading-relaxed mb-4">
                        {asset.description}
                      </p>

                      {/* File Details */}
                      <div className="bg-[#0E0E10] border border-[#2A2E35] rounded-xl p-3 font-mono text-[11px] space-y-1 mb-4">
                        <div className="flex items-center justify-between text-[#8D99AE]">
                          <span>File:</span>
                          <span className="text-[#F4F4F9] font-bold">{asset.filename}</span>
                        </div>
                        <div className="flex items-center justify-between text-[#8D99AE]">
                          <span>Status:</span>
                          <span className="text-[#52B788] flex items-center gap-1">
                            <Check className="w-3 h-3" /> Ready to Run
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Download Trigger Button */}
                    <button
                      onClick={() => handleDownload(asset)}
                      disabled={downloadingId === asset.id}
                      className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                        asset.id === 'win-installer'
                          ? 'bg-[#DDA15E] hover:bg-[#e0ae75] text-[#101217]'
                          : isAndroid
                          ? 'bg-[#52B788] hover:bg-[#43a175] text-[#101217]'
                          : 'bg-[#2A2E35] hover:bg-[#32363e] text-[#F4F4F9]'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      {downloadingId === asset.id ? 'Preparing Download...' : `Download ${asset.filename}`}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Build 86MB Native .EXE Locally */}
            <div className="bg-[#101217] border border-[#2A2E35] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F4F4F9]">
                  <Terminal className="w-4 h-4 text-[#7E78D2]" />
                  <span>Build 86MB Standalone Native Windows .EXE Locally</span>
                </div>
                <span className="text-[10px] font-mono text-[#DDA15E]">Electron Builder</span>
              </div>

              <p className="text-xs text-[#8D99AE] leading-relaxed">
                If you have cloned the project or have Node.js installed, compile the true 86 MB NSIS installer binary with one command:
              </p>

              <div className="bg-[#0E0E10] border border-[#2A2E35] p-3 rounded-xl flex items-center justify-between font-mono text-xs text-[#52B788]">
                <code>npm run build:electron</code>
                <button 
                  onClick={() => copySha('npm run build:electron')}
                  className="px-2.5 py-1 rounded bg-[#181A22] hover:bg-[#252a36] text-[#8D99AE] hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Command</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Installer Simulator */}
        {tab === 'simulator' && (
          <div className="p-10 flex flex-col items-center animate-in fade-in duration-200">
            <KiteLogo className="w-24 h-24 mb-6" />
            <h2 className="text-[#F4F4F9] text-2xl font-bold mb-2 text-center">Kite Browser Desktop Setup</h2>
            <p className="text-[#8D99AE] text-sm text-center max-w-[340px] mb-8 leading-relaxed">
              Experience the native one-click deployment for the hardened Chromium core and OpenClaw node relay.
            </p>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div 
                  key="step0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full max-w-md flex flex-col items-center gap-6"
                >
                  <div className="w-full bg-[#101217] border border-[#2A2E35] rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-[#7E78D2]" />
                      <span className="text-[#F4F4F9] text-xs font-semibold">Chromium Core + Custom Skin Engine</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Terminal className="w-4 h-4 text-[#52B788]" />
                      <span className="text-[#F4F4F9] text-xs font-semibold">OpenClaw Node Sideload (Multi-Hop)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-[#DDA15E]" />
                      <span className="text-[#F4F4F9] text-xs font-semibold">uSafe WebAuthn & Hardware Passkey Store</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep(1)}
                    className="w-full py-3.5 bg-[#DDA15E] text-[#14161D] text-sm font-bold rounded-xl hover:bg-[#e0ae75] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    Simulate Desktop Installation
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full max-w-md flex flex-col gap-4"
                >
                  <div className="w-full h-2.5 bg-[#181A22] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#FF6B00] via-[#DDA15E] to-[#52B788]"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8D99AE] text-xs font-mono">{statusText}</span>
                    <span className="text-[#52B788] text-xs font-bold font-mono">{Math.round(progress)}%</span>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-[#52B788]/15 border border-[#52B788]/40 flex items-center justify-center mb-2">
                    <CheckCircle className="w-8 h-8 text-[#52B788]" />
                  </div>
                  <p className="text-[#F4F4F9] text-sm text-center font-medium">
                    Installation was successful! Kite is configured with zero telemetry and Web4 protocol support.
                  </p>
                  
                  <button 
                    onClick={() => {
                      setStep(0);
                      setProgress(0);
                    }}
                    className="w-full py-3.5 bg-[#2A2E35] hover:bg-[#383d47] text-[#F4F4F9] text-sm font-bold rounded-xl transition-colors cursor-pointer mt-2"
                  >
                    Reset Simulator
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Footer */}
        <div className="h-12 bg-[#0E0E10] border-t border-[#2A2E35] flex items-center justify-between px-6 text-[11px] text-[#8D99AE]">
          <span>Cryptographically Signed with uSafe Authority</span>
          <span className="font-mono">Official Builds • Zero-Telemetry</span>
        </div>
      </div>
    </div>
  );
}
