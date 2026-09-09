import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KiteLogo } from './KiteLogo';
import { Download, CheckCircle, Terminal, Shield, Zap } from 'lucide-react';

export function Installer() {
  const [step, setStep] = useState(0); // 0: Start, 1: Installing, 2: Done
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Ready to install');

  useEffect(() => {
    if (step === 1) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 5 + 2;
        if (currentProgress > 100) currentProgress = 100;
        
        setProgress(currentProgress);
        
        if (currentProgress < 30) setStatusText('Unpacking core binaries...');
        else if (currentProgress < 60) setStatusText('Sideloading OpenClaw Node...');
        else if (currentProgress < 85) setStatusText('Configuring secure mesh network...');
        else if (currentProgress < 100) setStatusText('Finalizing UI components...');
        else setStatusText('Installation Complete');
        
        if (currentProgress === 100) {
          clearInterval(interval);
          setTimeout(() => setStep(2), 500);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="w-full h-[100dvh] bg-[#000] flex items-center justify-center font-sans relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#DDA15E]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-[540px] bg-[#101217] border border-[#2A2E35] rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col">
        {/* Fake window title bar */}
        <div className="h-10 bg-[#0E0E10] flex items-center px-4 border-b border-[#2A2E35]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="mx-auto text-[11px] text-[#8D99AE] font-medium tracking-wide">
            Kite Installer
          </div>
          <div className="w-11" /> {/* spacer for center alignment */}
        </div>

        <div className="p-10 flex flex-col items-center">
          <KiteLogo className="w-20 h-20 mb-6" />
          <h1 className="text-[#F4F4F9] text-2xl font-bold mb-2 text-center">Kite Browser</h1>
          <p className="text-[#8D99AE] text-sm text-center max-w-[320px] mb-10 leading-relaxed">
            The next-generation privacy-first workspace. Powered by the decentralized OpenClaw mesh network.
          </p>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div 
                key="step0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col items-center gap-6"
              >
                <div className="w-full bg-[#14161D] border border-[#2A2E35] rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-[#7E78D2]" />
                    <span className="text-[#F4F4F9] text-xs font-semibold">Tauri Desktop Shell</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-[#52B788]" />
                    <span className="text-[#F4F4F9] text-xs font-semibold">OpenClaw Node Sideload</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-[#DDA15E]" />
                    <span className="text-[#F4F4F9] text-xs font-semibold">Zero-Trust Memory Vault</span>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(1)}
                  className="w-full py-3.5 bg-[#DDA15E] text-[#14161D] text-sm font-bold rounded-xl hover:bg-[#e0ae75] transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Install Now
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col gap-4"
              >
                <div className="w-full h-2 bg-[#181A22] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#FF6B00] to-[#DDA15E]"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8D99AE] text-xs font-mono">{statusText}</span>
                  <span className="text-[#F4F4F9] text-xs font-bold">{Math.round(progress)}%</span>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center gap-6"
              >
                <div className="w-16 h-16 rounded-full bg-[#52B788]/10 border border-[#52B788]/30 flex items-center justify-center mb-2">
                  <CheckCircle className="w-8 h-8 text-[#52B788]" />
                </div>
                <p className="text-[#F4F4F9] text-sm text-center">Installation was successful. Kite is now ready to use.</p>
                
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-3.5 bg-[#2A2E35] text-[#F4F4F9] text-sm font-bold rounded-xl hover:bg-[#32363e] transition-colors mt-2"
                >
                  Launch Kite Browser
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
