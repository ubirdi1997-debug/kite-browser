import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Fingerprint } from 'lucide-react';

export function MobileKite() {
  return (
    <div className="w-[320px] h-[680px] bg-[#121214] border-[3px] border-[#2A2E35] rounded-[40px] flex flex-col relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] font-sans ring-1 ring-black/50">
      
      {/* Mobile Status Bar */}
      <div className="h-12 w-full flex items-center justify-between px-6 shrink-0 pt-2">
        <span className="text-[#F4F4F9] text-[10px] font-bold tracking-wide">9:41</span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#52B788]" />
          <div className="w-[12px] h-[7px] border border-[#F4F4F9] rounded-[2px]" />
        </div>
      </div>

      {/* Mobile App Header / Omnibox */}
      <div className="px-4 mb-6">
        <div className="h-10 bg-[#181A22] border border-[#2A2E35] rounded-full flex items-center px-3 relative">
          <div className="w-2 h-2 rounded-full bg-[#52B788]" />
          <span className="font-mono text-[10px] text-[#8D99AE] ml-2">kite://sandboxed</span>
          
          {/* Mobile Aura Pip */}
          <div className="absolute right-1 top-1 w-8 h-8 rounded-full bg-[#1E1C2B] border border-[#7E78D2] flex items-center justify-center">
            <span className="text-[#7E78D2] text-[8px] font-bold">AI</span>
          </div>
        </div>
      </div>

      {/* Mobile View Content */}
      <div className="px-4 flex-1">
        <div className="bg-[#14161D] border border-[#2A2E35] rounded-2xl p-5 relative overflow-hidden">
          <Shield className="w-8 h-8 text-[#3D8D8B] mb-4 opacity-80" />
          <h2 className="text-[#F4F4F9] text-[14px] font-extrabold mb-2 leading-tight">Kite Mobile</h2>
          <p className="text-[#8D99AE] text-[10px] mb-1">Hardened Chromium Content Core</p>
          <p className="text-[#8D99AE] text-[10px] mb-4">Connected to OpenClaw Node Mesh</p>
          
          <div className="inline-flex bg-[#1E222D] border border-[#2A2E35] rounded-full px-3 py-1">
            <span className="font-mono text-[8px] text-[#3D8D8B] uppercase tracking-widest">0 Telemetry Pings</span>
          </div>
        </div>
      </div>

      {/* Enclave Passkey Verification Bottom Sheet */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 h-[260px] bg-[#181A22] border-t border-[#DDA15E] rounded-t-[28px] p-6 flex flex-col z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]"
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-[#2A2E35] rounded-full mx-auto mb-6" />

        <h3 className="text-[#F4F4F9] text-[12px] font-bold mb-1">uAuth Passkey Challenge</h3>
        <p className="text-[#8D99AE] text-[9.5px] mb-6">Sovereign Hardware StrongBox Signer</p>

        {/* Biometric Glyphs */}
        <div className="flex flex-col items-center justify-center flex-1 mb-4">
          <div className="w-14 h-14 bg-[#14161D] border border-[#2A2E35] rounded-2xl flex items-center justify-center relative mb-4">
            {/* Mocked dashed circle */}
            <div className="absolute inset-2 border-2 border-dashed border-[#DDA15E]/50 rounded-full animate-[spin_10s_linear_infinite]" />
            <Fingerprint className="w-6 h-6 text-[#DDA15E]" />
          </div>
          <span className="font-mono text-[9px] text-[#8D99AE]">Ed25519 • @alex.id</span>
        </div>

        {/* CTA Button */}
        <button className="w-full py-3 bg-[#DDA15E] rounded-full text-[#121214] text-[11px] font-extrabold hover:bg-[#e0ae75] transition-colors">
          Authenticate Passkey
        </button>
      </motion.div>

      {/* Home Gesture Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#8D99AE] opacity-40 rounded-full z-30" />

    </div>
  );
}
