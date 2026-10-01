import React, { useState } from 'react';
import { Shield, Lock, Fingerprint, Download, Smartphone, Globe, Radio, Waypoints, Key } from 'lucide-react';
import { RELEASE_ASSETS, downloadReleaseAsset } from '../utils/downloader';
import { MobileBiometricOverlay } from './MobileBiometricOverlay';
import { useUsafeAuth } from '../hooks/useUsafeAuth';

export function MobileKite() {
  const { user } = useUsafeAuth();
  const apkAsset = RELEASE_ASSETS.find(a => a.platform === 'android') || RELEASE_ASSETS[1];

  return (
    <div className="w-[360px] h-[740px] bg-[#121214] border-[3px] border-[#2A2E35] rounded-[44px] flex flex-col relative overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.65)] font-sans ring-1 ring-black/50">
      
      {/* Mobile Status Bar */}
      <div className="h-11 w-full flex items-center justify-between px-7 shrink-0 pt-2 bg-[#121214]">
        <span className="text-[#F4F4F9] text-[11px] font-bold tracking-wide font-mono">09:41</span>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-[#52B788] bg-[#52B788]/15 px-1.5 py-0.2 rounded border border-[#52B788]/30">
            5G Web4
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#52B788] animate-pulse" />
          <div className="w-[14px] h-[8px] border border-[#F4F4F9] rounded-[2px]" />
        </div>
      </div>

      {/* Mobile App Header / Omnibox */}
      <div className="px-4 py-2 shrink-0 bg-[#121214]">
        <div className="h-10 bg-[#181A22] border border-[#2A2E35] rounded-full flex items-center px-3 relative">
          <div className="w-2 h-2 rounded-full bg-[#52B788]" />
          <span className="font-mono text-[10px] text-[#F4F4F9] ml-2 truncate max-w-[200px]">
            {user ? 'web4://vault.sovereign' : 'auth.usafe.in/ceremony'}
          </span>
          
          {/* Mobile Aura Pip */}
          <div className="absolute right-1 top-1 w-8 h-8 rounded-full bg-[#1E1C2B] border border-[#7E78D2] flex items-center justify-center">
            <span className="text-[#7E78D2] text-[8px] font-bold">AURA</span>
          </div>
        </div>
      </div>

      {/* Mobile View Content - Scrollable */}
      <div className="px-4 py-2 flex-1 overflow-y-auto space-y-3 [&::-webkit-scrollbar]:hidden">
        {/* Core Specimen Card */}
        <div className="bg-[#14161D] border border-[#2A2E35] rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#3D8D8B]/15 border border-[#3D8D8B]/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#3D8D8B]" />
              </div>
              <div>
                <h2 className="text-[#F4F4F9] text-xs font-bold leading-tight">Kite Mobile Sovereign Core</h2>
                <p className="text-[#8D99AE] text-[9.5px]">OpenClaw Mesh Relay Active</p>
              </div>
            </div>

            <span className="font-mono text-[8px] text-[#52B788] bg-[#52B788]/10 px-2 py-0.5 rounded border border-[#52B788]/20">
              0 TELEMETRY
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[9px] font-mono mb-3">
            <div className="bg-[#101217] p-2 rounded-lg border border-[#2A2E35]">
              <span className="text-[#8D99AE] block text-[8px]">SESSION IDENTITY:</span>
              <span className="text-[#DDA15E] font-bold truncate block">{user ? user.handle : 'UNAUTHENTICATED'}</span>
            </div>
            <div className="bg-[#101217] p-2 rounded-lg border border-[#2A2E35]">
              <span className="text-[#8D99AE] block text-[8px]">RELAY NODE:</span>
              <span className="text-[#52B788] font-bold truncate block">{user ? user.node.split(' ')[0] : 'Mumbai-01'}</span>
            </div>
          </div>

          <button
            onClick={() => downloadReleaseAsset(apkAsset)}
            className="w-full py-2 bg-[#181A22] hover:bg-[#20242e] border border-[#2A2E35] hover:border-[#52B788]/40 text-[#F4F4F9] rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#52B788]" />
            Download Android APK (v1.2.0 • 48 MB)
          </button>
        </div>
      </div>

      {/* Simulated Biometric Authentication Overlay & Handshake Inspector */}
      <div className="shrink-0 max-h-[460px] overflow-y-auto">
        <MobileBiometricOverlay />
      </div>

      {/* Home Gesture Indicator */}
      <div className="h-4 bg-[#14161D] w-full flex items-center justify-center shrink-0">
        <div className="w-24 h-1 bg-[#8D99AE] opacity-40 rounded-full" />
      </div>

    </div>
  );
}
