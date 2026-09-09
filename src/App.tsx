/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DesktopKite } from './components/DesktopKite';
import { MobileKite } from './components/MobileKite';
import { Installer } from './components/Installer';
import { Monitor, Smartphone, Download } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'installer'>('desktop');

  return (
    <div className="min-h-screen bg-[#0E0E10] flex flex-col font-sans text-[#F4F4F9]">
      
      {/* Specimen Header */}
      <header className="h-16 border-b border-[#2A2E35] bg-[#121214] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#DDA15E] rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-[#121214] rounded-sm" />
          </div>
          <div>
            <h1 className="text-[13px] font-bold text-[#F4F4F9]">Kite Browser Design System</h1>
            <p className="text-[10px] text-[#8D99AE] font-mono mt-0.5">Tactical Obsidian Chrome Specimen</p>
          </div>
        </div>

        {/* View Toggles */}
        <div className="flex bg-[#181A22] border border-[#2A2E35] rounded-lg p-1 gap-1">
          <button 
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
              viewMode === 'desktop' 
                ? 'bg-[#2A2E35] text-[#F4F4F9]' 
                : 'text-[#8D99AE] hover:text-[#F4F4F9]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Desktop View
          </button>
          <button 
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
              viewMode === 'mobile' 
                ? 'bg-[#2A2E35] text-[#F4F4F9]' 
                : 'text-[#8D99AE] hover:text-[#F4F4F9]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile View
          </button>
          <button 
            onClick={() => setViewMode('installer')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
              viewMode === 'installer' 
                ? 'bg-[#2A2E35] text-[#F4F4F9]' 
                : 'text-[#8D99AE] hover:text-[#F4F4F9]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Installer View
          </button>
        </div>
      </header>

      {/* Main Showcase Area */}
      <main className="flex-1 overflow-auto flex items-center justify-center p-6 lg:p-12 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1c23] via-[#0E0E10] to-[#0E0E10]">
        
        {viewMode === 'desktop' ? (
          <div className="w-full max-w-6xl flex justify-center animate-in fade-in zoom-in-95 duration-300">
            <DesktopKite />
          </div>
        ) : viewMode === 'mobile' ? (
          <div className="w-full flex justify-center animate-in fade-in zoom-in-95 duration-300">
            <MobileKite />
          </div>
        ) : (
          <div className="w-full flex justify-center animate-in fade-in zoom-in-95 duration-300">
            <Installer />
          </div>
        )}

      </main>
    </div>
  );
}
