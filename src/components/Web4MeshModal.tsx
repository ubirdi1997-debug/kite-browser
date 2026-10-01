import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Shield, Waypoints, Cpu, Lock, CheckCircle2, RefreshCw, X, Radio, ArrowUpRight, Zap } from 'lucide-react';
import { web4Bridge, Web4MeshStatus, Web4NodePeer } from '../services/web4Bridge';

interface Web4MeshModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Web4MeshModal({ isOpen, onClose }: Web4MeshModalProps) {
  const [status, setStatus] = useState<Web4MeshStatus>(web4Bridge.getStatus());

  useEffect(() => {
    return web4Bridge.subscribe(setStatus);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] backdrop-blur-md bg-[#0E0E10]/80 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl bg-[#12141B] border border-[#2A2E35] rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col"
        >
          {/* Header Accent Bar */}
          <div className="h-1 bg-gradient-to-r from-[#3D8D8B] via-[#52B788] to-[#DDA15E]" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2E35] bg-[#101217]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#3D8D8B]/10 border border-[#3D8D8B]/30 flex items-center justify-center">
                <Waypoints className="w-5 h-5 text-[#3D8D8B]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[#F4F4F9] text-base font-bold tracking-tight">Web4 & Web3 Plus Mesh Topology</h3>
                  <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#52B788]/10 text-[#52B788] border border-[#52B788]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] animate-pulse" />
                    LIVE
                  </span>
                </div>
                <p className="text-[#8D99AE] text-xs font-mono">Decentralized Egress Routing • Zero-Telemetry</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl hover:bg-[#181A22] flex items-center justify-center text-[#8D99AE] hover:text-[#F4F4F9] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Active Network Card */}
            <div className="p-4 bg-[#101217] border border-[#2A2E35] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#8D99AE] font-mono uppercase tracking-wider block mb-1">
                  Active Network Mode
                </span>
                <div className="text-sm font-bold text-[#F4F4F9] flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#52B788]" />
                  {status.activeNetwork}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8D99AE] font-mono">Tunnel:</span>
                <button
                  onClick={() => web4Bridge.toggleTunnel()}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                    status.tunnelActive
                      ? 'bg-[#52B788]/15 border-[#52B788] text-[#52B788]'
                      : 'bg-[#2A2E35] border-transparent text-[#8D99AE]'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  {status.tunnelActive ? 'Encrypted (ON)' : 'Bypass (OFF)'}
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#101217] border border-[#2A2E35] p-3 rounded-xl">
                <span className="text-[10px] text-[#8D99AE] font-mono block">Current Node</span>
                <span className="text-xs font-bold text-[#DDA15E] truncate block mt-0.5">{status.currentNode}</span>
              </div>
              <div className="bg-[#101217] border border-[#2A2E35] p-3 rounded-xl">
                <span className="text-[10px] text-[#8D99AE] font-mono block">Active Peers</span>
                <span className="text-xs font-bold text-[#52B788] block mt-0.5">{status.peersCount} Mesh Nodes</span>
              </div>
              <div className="bg-[#101217] border border-[#2A2E35] p-3 rounded-xl">
                <span className="text-[10px] text-[#8D99AE] font-mono block">Cipher Suite</span>
                <span className="text-xs font-bold text-[#7E78D2] block mt-0.5">XChaCha20-Poly</span>
              </div>
            </div>

            {/* Mesh Peer Nodes List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#8D99AE] font-mono uppercase">
                  Connected Node Relays
                </span>
                <span className="text-[10px] text-[#52B788] font-mono">Multi-Hop Active</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {status.peers.map((peer) => (
                  <div
                    key={peer.id}
                    className="p-3 bg-[#101217] border border-[#2A2E35] rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#52B788]" />
                      <div>
                        <span className="font-semibold text-[#F4F4F9] block">{peer.id}</span>
                        <span className="text-[10px] text-[#8D99AE] font-mono">{peer.location} • {peer.egressIP}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[#52B788] font-mono font-bold block">{peer.latencyMs}ms</span>
                      <span className="text-[10px] text-[#8D99AE] font-mono">{peer.bandwidthMbps} Mbps</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Protocol Support Hint */}
            <div className="p-3 bg-[#181A22] border border-[#2A2E35] rounded-xl flex items-center gap-3 text-xs text-[#8D99AE]">
              <Zap className="w-4 h-4 text-[#DDA15E] shrink-0" />
              <span>
                Native support for <strong className="text-[#F4F4F9] font-mono">web4://</strong> and{' '}
                <strong className="text-[#F4F4F9] font-mono">web3p://</strong> domains with hardware passkey validation.
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 bg-[#101217] border-t border-[#2A2E35] flex items-center justify-between text-[11px]">
            <span className="text-[#8D99AE]">OpenClaw Sovereign Layer</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#2A2E35] hover:bg-[#323740] text-[#F4F4F9] rounded-lg font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
