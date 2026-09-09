import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { ArrowLeft, ArrowRight, Lock, Shield, Fingerprint, Activity, Cpu, Briefcase, PenTool, ShoppingBag, Users, BookMarked, MessageCircle, MessageSquare, BatteryMedium, Plus, Settings, SplitSquareHorizontal, Key, CreditCard, ShieldAlert, HardDrive, Waypoints, Ghost, Camera, RotateCcw, X, Wallet, Mail, VenetianMask, Search, Globe, Code, Music, Gamepad2, Coffee, MoonStar } from 'lucide-react';

type BaseTab = { id: string; title: string; active: boolean; isSecret?: boolean; url: string; suspended?: boolean };
type TabNode = BaseTab & { type: 'tab' };
type TabIsland = { type: 'island'; id: string; tabs: BaseTab[] };
type WorkspaceItem = TabNode | TabIsland;

const WORKSPACE_TABS: Record<string, WorkspaceItem[]> = {
  work: [
    { type: 'tab', id: 'w1', title: 'Privacy Manifesto', url: 'https://sovereign.kernel/zero-telemetry', active: true },
    { type: 'tab', id: 'w2', title: 'OpenClaw Mesh', url: 'kite://mesh-topology', active: false }
  ],
  writing: [
    { type: 'tab', id: 'wr1', title: 'Draft: Zero-Trust', url: 'https://docs.local/zero-trust', active: true },
    { type: 'tab', id: 'wr2', title: 'Research Notes', url: 'https://notes.local/research', active: false }
  ],
  shopping: [
    { type: 'tab', id: 's1', title: 'Hardware Wallets', url: 'https://shop.crypto/hardware', active: true }
  ],
  social: [
    { type: 'tab', id: 'so1', title: 'Decentralized Feed', url: 'https://social.mesh/feed', active: true },
    { type: 'tab', id: 'so2', title: 'Encrypted Chat', url: 'https://chat.secure', active: false }
  ],
  reference: [
    { type: 'tab', id: 'r1', title: 'Cryptography Docs', url: 'https://crypto.wiki/docs', active: true },
    { type: 'tab', id: 'r2', title: 'WASM NPU APIs', url: 'https://developer.npu/wasm', active: false }
  ]
};

const INITIAL_WORKSPACES = [
  { id: 'work', icon: Briefcase, color: 'text-[#DDA15E]', bg: 'bg-[#DDA15E]/10', indicator: 'bg-[#DDA15E]' },
  { id: 'writing', icon: PenTool, color: 'text-[#7E78D2]', bg: 'bg-[#7E78D2]/10', indicator: 'bg-[#7E78D2]' },
  { id: 'shopping', icon: ShoppingBag, color: 'text-[#52B788]', bg: 'bg-[#52B788]/10', indicator: 'bg-[#52B788]' },
  { id: 'social', icon: Users, color: 'text-[#3D8D8B]', bg: 'bg-[#3D8D8B]/10', indicator: 'bg-[#3D8D8B]' },
  { id: 'reference', icon: BookMarked, color: 'text-[#8D99AE]', bg: 'bg-[#8D99AE]/10', indicator: 'bg-[#8D99AE]' },
];

export function DesktopKite() {
  const [workspaces, setWorkspaces] = useState(INITIAL_WORKSPACES);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceIcon, setNewWorkspaceIcon] = useState<any>(Code);
  const [memorySaver, setMemorySaver] = useState(true);

  const [auraOpen, setAuraOpen] = useState(false);
  const [isGeminiConnected, setIsGeminiConnected] = useState(false);
  const [heldTabId, setHeldTabId] = useState<string | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState('work');
  const [tabs, setTabs] = useState<WorkspaceItem[]>(WORKSPACE_TABS['work']);
  const [isTiledView, setIsTiledView] = useState(false);
  const [uAuthOpen, setUauthOpen] = useState(false);
  const [snapshotSaved, setSnapshotSaved] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, tabId: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const [gesture, setGesture] = useState<{
    active: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    path: {x: number, y: number}[];
    action: 'back' | 'forward' | null;
  } | null>(null);

  const getActiveTab = (): BaseTab | null => {
    for (const item of tabs) {
      if (item.type === 'island') {
        const found = item.tabs.find(t => t.active);
        if (found) return found;
      } else {
        if (item.active) return item;
      }
    }
    return null;
  };
  const activeTab = getActiveTab();

  const activateTab = (tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.map(item => {
        if (item.type === 'island') {
          return { 
            ...item, 
            tabs: item.tabs.map(t => ({ 
              ...t, 
              active: t.id === tabId,
              suspended: t.id === tabId ? false : (memorySaver && !t.active && t.id !== tabId ? true : t.suspended)
            })) 
          };
        }
        return { 
          ...item, 
          active: item.id === tabId,
          suspended: item.id === tabId ? false : (memorySaver && !item.active && item.id !== tabId ? true : item.suspended)
        };
      });
      WORKSPACE_TABS[activeWorkspace] = newTabs;
      return newTabs;
    });
  };

  const handleAddWorkspace = () => {
    if (!newWorkspaceName.trim()) return;
    const id = newWorkspaceName.toLowerCase().replace(/\s+/g, '-');
    const newWs = {
      id,
      icon: newWorkspaceIcon,
      color: 'text-[#F4F4F9]',
      bg: 'bg-[#2A2E35]',
      indicator: 'bg-[#F4F4F9]'
    };
    WORKSPACE_TABS[id] = [{ type: 'tab', id: `t-${Date.now()}`, title: 'New Session', url: '', active: true }];
    setWorkspaces(prev => [...prev, newWs]);
    setShowWorkspaceModal(false);
    setNewWorkspaceName('');
    handleWorkspaceChange(id);
  };

  const toggleMemorySaver = () => {
    setMemorySaver(prev => {
      const next = !prev;
      setTabs(currentTabs => {
        const newTabs = currentTabs.map(item => {
          if (item.type === 'island') {
            return { 
              ...item, 
              tabs: item.tabs.map(t => ({ ...t, suspended: next ? (!t.active ? true : false) : false })) 
            };
          }
          return { 
            ...item as TabNode, 
            suspended: next ? (!item.active ? true : false) : false 
          };
        });
        WORKSPACE_TABS[activeWorkspace] = newTabs;
        return newTabs;
      });
      return next;
    });
  };

  const updateActiveTabUrl = (newUrl: string) => {
    if (!activeTab) return;
    setTabs(prev => {
      const newTabs = prev.map(item => {
        if (item.type === 'island') {
          return { ...item, tabs: item.tabs.map(t => t.id === activeTab.id ? { ...t, url: newUrl, title: newUrl || 'New Session' } : t) };
        }
        if (item.id === activeTab.id) {
          return { ...item as TabNode, url: newUrl, title: newUrl || 'New Session' };
        }
        return item;
      });
      WORKSPACE_TABS[activeWorkspace] = newTabs;
      return newTabs;
    });
  };

  const handleWorkspaceChange = (id: string) => {
    setActiveWorkspace(id);
    setTabs(WORKSPACE_TABS[id]);
  };

  const handleSaveSnapshot = () => {
    localStorage.setItem(`kite_snapshot_${activeWorkspace}`, JSON.stringify(tabs));
    setSnapshotSaved(true);
    setTimeout(() => setSnapshotSaved(false), 2000);
  };

  const handleRestoreSnapshot = () => {
    const saved = localStorage.getItem(`kite_snapshot_${activeWorkspace}`);
    if (saved) {
      setTabs(JSON.parse(saved));
      WORKSPACE_TABS[activeWorkspace] = JSON.parse(saved);
    }
  };

  const closeTab = (tabId: string) => {
    setTabs(prev => {
      let newTabs = prev.map(item => {
        if (item.type === 'island') {
          return { ...item, tabs: item.tabs.filter(t => t.id !== tabId) };
        }
        return item;
      }).filter(item => {
        if (item.type === 'island') return item.tabs.length > 0;
        return item.id !== tabId;
      });
      WORKSPACE_TABS[activeWorkspace] = newTabs;
      return newTabs;
    });
    setContextMenu(null);
  };

  const toggleSecretMode = (tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.map(item => {
        if (item.type === 'island') {
          return {
            ...item,
            tabs: item.tabs.map(t => t.id === tabId ? { ...t, isSecret: !t.isSecret } : t)
          };
        }
        if (item.id === tabId) {
          return { ...item as TabNode, isSecret: !(item as TabNode).isSecret };
        }
        return item;
      });
      WORKSPACE_TABS[activeWorkspace] = newTabs;
      return newTabs;
    });
    setContextMenu(null);
  };

  const addNewTab = () => {
    const newTab: TabNode = { type: 'tab', id: `t-${Date.now()}`, title: 'New Session', url: '', active: true };
    setTabs(prev => {
      // Deactivate all others
      const deactivate = (items: WorkspaceItem[]) => items.map(i => {
        if (i.type === 'island') {
          return { ...i, tabs: i.tabs.map(t => ({...t, active: false}))};
        }
        return { ...i, active: false };
      });
      const updated = [...deactivate(prev), newTab];
      WORKSPACE_TABS[activeWorkspace] = updated;
      return updated;
    });
  };

  const handleDragEnd = (event: any, info: any, draggedItem: WorkspaceItem) => {
    setHeldTabId(null);
    
    const point = info?.point || { x: event.clientX, y: event.clientY };
    if (!point.x || !point.y) return;

    // Detect drop over another tab component
    const elements = document.elementsFromPoint(point.x, point.y);
    const dropTarget = elements.find(el => el.hasAttribute('data-droppable-id') && el.getAttribute('data-droppable-id') !== draggedItem.id);

    if (dropTarget) {
      const targetId = dropTarget.getAttribute('data-droppable-id');
      
      setTabs(prevTabs => {
        const newTabs = [...prevTabs];
        const draggedIdx = newTabs.findIndex(t => t.id === draggedItem.id);
        const targetIdx = newTabs.findIndex(t => t.id === targetId);
        
        if (draggedIdx === -1 || targetIdx === -1 || draggedIdx === targetIdx) return prevTabs;

        const dragged = newTabs[draggedIdx];
        const target = newTabs[targetIdx];

        newTabs.splice(draggedIdx, 1);
        
        const newTargetIdx = newTabs.findIndex(t => t.id === targetId);
        if (newTargetIdx === -1) return prevTabs;
        
        if (target.type === 'island') {
          // Append to existing island
          const itemsToAdd = dragged.type === 'island' ? dragged.tabs : [dragged as BaseTab];
          newTabs[newTargetIdx] = {
            ...target,
            tabs: [...target.tabs, ...itemsToAdd]
          };
        } else {
          // Create new island group
          const itemsToAdd = dragged.type === 'island' ? dragged.tabs : [dragged as BaseTab];
          newTabs[newTargetIdx] = {
            type: 'island',
            id: `island-${Date.now()}`,
            tabs: [target as BaseTab, ...itemsToAdd]
          };
        }

        WORKSPACE_TABS[activeWorkspace] = newTabs;
        return newTabs;
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setGesture({
        active: true,
        startX: x,
        startY: y,
        currentX: x,
        currentY: y,
        path: [{x, y}],
        action: null
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gesture?.active) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const dx = x - gesture.startX;
      const dy = y - gesture.startY;
      
      let action: 'back' | 'forward' | null = null;
      if (dx < -80 && Math.abs(dx) > Math.abs(dy)) action = 'back';
      else if (dx > 80 && Math.abs(dx) > Math.abs(dy)) action = 'forward';

      setGesture(prev => prev ? {
        ...prev,
        currentX: x,
        currentY: y,
        path: [...prev.path, {x, y}],
        action
      } : null);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 2 && gesture?.active) {
      if (gesture.action === 'back') {
        // Handle back action (visual simulation)
      } else if (gesture.action === 'forward') {
        // Handle forward action (visual simulation)
      }
      setGesture(null);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (gesture && gesture.path.length > 5) {
      e.preventDefault();
    }
  };

  const getFavicon = (tab: BaseTab) => {
    if (tab.suspended) return <MoonStar className="w-3.5 h-3.5 text-[#8D99AE] shrink-0" />;
    if (tab.url.startsWith('kite://')) return <Shield className="w-3.5 h-3.5 text-[#7E78D2] shrink-0" />;
    if (!tab.url) return <Search className="w-3.5 h-3.5 text-[#8D99AE] shrink-0" />;
    return <Globe className="w-3.5 h-3.5 text-[#3D8D8B] shrink-0" />;
  };

  const renderTab = (tab: BaseTab, isHeld: boolean) => (
    <div 
      key={tab.id}
      onClick={(e) => { e.stopPropagation(); activateTab(tab.id); }}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, tabId: tab.id });
      }}
      className={`flex items-center gap-2 rounded-xl px-4 py-1.5 h-[34px] select-none relative transition-colors cursor-pointer ${
        tab.active ? 'bg-[#181A22] min-w-[200px]' : 'bg-[#101217] min-w-[160px]'
      } ${
        isHeld
          ? (tab.active ? 'border-2 border-dashed border-[#DDA15E]/80 opacity-80' : 'border-2 border-dashed border-[#8D99AE]/60 opacity-80')
          : (tab.active ? 'border border-solid border-[#DDA15E]' : 'border border-solid border-[#2A2E35]')
      }`}
    >
      {getFavicon(tab)}
      <span className={`text-[11px] pointer-events-none truncate ${tab.active ? 'text-[#F4F4F9] font-semibold' : (tab.suspended ? 'text-[#8D99AE]/50 italic' : 'text-[#8D99AE]')}`}>
        {tab.title}
      </span>
      {tab.isSecret && <Ghost className="w-3.5 h-3.5 text-[#7E78D2] shrink-0 ml-1" />}
      
      <div className="ml-auto flex items-center gap-1 shrink-0 z-10">
        {tab.active && !tab.isSecret && <div className="w-1.5 h-1.5 rounded-full bg-[#52B788]" />}
        <button 
          onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
          className="w-4 h-4 flex items-center justify-center rounded hover:bg-[#2A2E35] text-[#8D99AE] hover:text-[#F4F4F9] transition-colors"
          title="Close Tab"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div 
      className="w-full h-[100dvh] md:h-[700px] md:max-w-5xl border-none md:border border-[#2A2E35] rounded-none md:rounded-2xl bg-[#14161D] flex flex-col overflow-hidden relative md:shadow-[0_20px_50px_rgba(0,0,0,0.5)] font-sans"
      onClick={() => setContextMenu(null)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      
      {/* Window Top Header / Tabs */}
      <div className="h-12 bg-[#101217] flex items-center px-4 border-b border-[#2A2E35] shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Window Controls */}
        <div className="hidden md:flex gap-2 mr-6">
          <div className="w-3 h-3 rounded-full bg-[#2A2E35]" />
          <div className="w-3 h-3 rounded-full bg-[#2A2E35]" />
          <div className="w-3 h-3 rounded-full bg-[#2A2E35]" />
        </div>

        {/* Reorderable Tabs & Islands */}
        <Reorder.Group axis="x" values={tabs} onReorder={setTabs} className="flex gap-2 flex-1 min-w-max">
          {tabs.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              onDragEnd={(e, info) => handleDragEnd(e, info, item)}
              onMouseDown={() => setHeldTabId(item.id)}
              onMouseUp={() => setHeldTabId(null)}
              onMouseLeave={() => setHeldTabId(null)}
              animate={{ scale: heldTabId === item.id ? 0.98 : 1 }}
              transition={{ duration: 0.15 }}
              data-droppable-id={item.id}
              className="cursor-grab active:cursor-grabbing select-none shrink-0 relative"
            >
              {item.type === 'island' ? (
                <div className="flex gap-1 p-1 bg-[#1A1D24] border border-[#2A2E35] rounded-[18px] items-center shadow-inner relative group">
                  {/* Island Indicator Pip */}
                  <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#7E78D2] border border-[#14161D] rounded-full z-10" />
                  {item.tabs.map(subTab => renderTab(subTab, heldTabId === item.id))}
                </div>
              ) : (
                renderTab(item, heldTabId === item.id)
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <button 
          onClick={addNewTab}
          className="flex items-center justify-center w-[34px] h-[34px] rounded-xl hover:bg-[#181A22] text-[#8D99AE] hover:text-[#F4F4F9] transition-colors border border-transparent hover:border-[#2A2E35]"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation & Omnibox Bar */}
      <div className="h-[52px] bg-[#14161D] border-b border-[#2A2E35] flex items-center px-4 gap-2 md:gap-4 shrink-0">
        
        {/* Back / Forward Icons */}
        <div className="hidden md:flex gap-3">
          <ArrowLeft className="w-4 h-4 text-[#8D99AE]" strokeWidth={2.5} />
          <ArrowRight className="w-4 h-4 text-[#2A2E35]" strokeWidth={2.5} />
        </div>

        {/* Omnibox */}
        <div className="flex-1 bg-[#0E0E10] border border-[#2A2E35] rounded-full h-[36px] flex items-center px-3 gap-2">
          {activeTab?.url.startsWith('https') ? (
            <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
              <Lock className="w-3.5 h-3.5 text-[#52B788]" strokeWidth={2.5} />
              <div className="absolute bottom-0 right-0 w-2 h-1.5 bg-[#52B788] rounded-[2px]" />
            </div>
          ) : activeTab?.url.startsWith('kite://') ? (
            <Shield className="w-4 h-4 text-[#7E78D2] shrink-0" />
          ) : (
            <Search className="w-4 h-4 text-[#8D99AE] shrink-0" />
          )}
          
          <input 
            type="text" 
            value={activeTab?.url || ''} 
            onChange={(e) => updateActiveTabUrl(e.target.value)}
            placeholder="Search or enter address"
            className="bg-transparent border-none outline-none text-[#F4F4F9] font-mono text-[11px] w-full ml-1 placeholder:text-[#8D99AE]"
          />

          {/* Dynamic Relay Indicator */}
          <div className="ml-auto bg-[#1E222D] rounded-full px-3 py-1 flex items-center gap-1.5 h-6">
            <Ghost className="w-3 h-3 text-[#7E78D2]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#3D8D8B]" />
            <span className="font-mono text-[9px] text-[#3D8D8B] tracking-wide">ZURICH-04 Egress</span>
          </div>
        </div>

        <button
          onClick={() => setIsTiledView(!isTiledView)}
          className={`hidden md:flex rounded-xl px-2 py-1 items-center justify-center h-[36px] border transition-colors ${
            isTiledView ? 'bg-[#181A22] border-[#52B788] text-[#52B788]' : 'bg-[#14161D] border-[#2A2E35] hover:border-[#52B788]/50 text-[#8D99AE]'
          }`}
          title="Split-Screen Tiling"
        >
          <SplitSquareHorizontal className="w-4 h-4" />
        </button>

        {/* Battery Saver Mode */}
        <button 
          onClick={toggleMemorySaver}
          title="Memory Saver"
          className={`rounded-full px-3 py-1 flex items-center gap-2 h-[36px] border ml-2 transition-colors shrink-0 ${
            memorySaver ? 'bg-[#181A22] border-[#52B788]/30' : 'bg-[#14161D] border-[#2A2E35]'
          }`}
        >
          <BatteryMedium className={`w-4 h-4 ${memorySaver ? 'text-[#52B788]' : 'text-[#8D99AE]'}`} />
        </button>

        {/* Aura AI Trigger */}
        <button 
          onClick={() => setAuraOpen(!auraOpen)}
          className={`rounded-full px-4 py-1 flex items-center justify-center gap-2 h-[36px] border transition-colors ${
            auraOpen 
              ? 'bg-[#1E1C2B] border-[#7E78D2]' 
              : 'bg-[#14161D] border-[#2A2E35] hover:border-[#7E78D2]/50'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${auraOpen ? 'bg-[#7E78D2]' : 'bg-[#2A2E35]'}`} />
          <span className={`text-[11px] font-bold ${auraOpen ? 'text-[#7E78D2]' : 'text-[#8D99AE]'}`}>AI</span>
        </button>
      </div>

        {/* Browser Main Canvas */}
        <div className="flex-1 bg-[#14161D] relative flex flex-col md:flex-row overflow-hidden">
          
          {/* Mouse Gesture Overlay */}
          <AnimatePresence>
            {gesture?.active && gesture.path.length > 2 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="absolute inset-0 pointer-events-none z-[150]"
              >
                {/* Action Indicator HUD */}
                {gesture.action && (
                  <div 
                    className="absolute flex flex-col items-center justify-center bg-[#181A22]/90 backdrop-blur-md border border-[#2A2E35] rounded-2xl shadow-2xl p-4 transition-all duration-200"
                    style={{ 
                      left: Math.max(20, Math.min(gesture.currentX + (gesture.action === 'back' ? -100 : 40), window.innerWidth - 120)), 
                      top: Math.max(20, gesture.currentY - 60) 
                    }}
                  >
                    {gesture.action === 'back' ? (
                      <ArrowLeft className="w-8 h-8 text-[#DDA15E] mb-1" strokeWidth={2.5} />
                    ) : (
                      <ArrowRight className="w-8 h-8 text-[#52B788] mb-1" strokeWidth={2.5} />
                    )}
                    <span className={`text-[12px] font-bold ${gesture.action === 'back' ? 'text-[#DDA15E]' : 'text-[#52B788]'}`}>
                      {gesture.action === 'back' ? 'Go Back' : 'Go Forward'}
                    </span>
                  </div>
                )}
                
                {/* Trail SVG */}
                <svg className="w-full h-full" style={{ filter: 'drop-shadow(0 0 4px rgba(126, 120, 210, 0.5))' }}>
                  <polyline 
                    points={gesture.path.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke={gesture.action === 'back' ? '#DDA15E' : gesture.action === 'forward' ? '#52B788' : '#7E78D2'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-80"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Workspace & Social Sidebar (Desktop) / Bottom Nav (Mobile) */}
        <div className="md:w-[60px] w-full h-[60px] md:h-auto bg-[#0E0E10] border-t md:border-t-0 md:border-r border-[#2A2E35] flex flex-row md:flex-col items-center py-2 md:py-4 px-4 md:px-0 gap-4 md:gap-6 shrink-0 z-10 order-last md:order-first overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Workspaces */}
          <div className="flex flex-row md:flex-col gap-3 w-full md:items-center">
            {workspaces.map((ws) => {
              const Icon = ws.icon;
              const isActive = activeWorkspace === ws.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => handleWorkspaceChange(ws.id)}
                  className={`shrink-0 relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? ws.bg : 'hover:bg-[#181A22]'
                  }`}
                  title={ws.id.charAt(0).toUpperCase() + ws.id.slice(1)}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeWorkspaceIndicator"
                      className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full hidden md:block ${ws.indicator}`}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeWorkspaceIndicatorMobile"
                      className={`absolute bottom-0 left-2 right-2 h-[3px] rounded-t-full block md:hidden ${ws.indicator}`}
                    />
                  )}
                  <Icon className={`w-5 h-5 ${isActive ? ws.color : 'text-[#8D99AE]'}`} strokeWidth={isActive ? 2.5 : 2} />
                </button>
              );
            })}

            <button 
              onClick={() => setShowWorkspaceModal(true)}
              className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border border-dashed border-[#2A2E35] hover:bg-[#181A22] transition-colors"
            >
              <Plus className="w-5 h-5 text-[#8D99AE]" />
            </button>
          </div>

          <div className="hidden md:block w-8 h-[1px] bg-[#2A2E35] rounded-full my-2" />
          <div className="block md:hidden h-8 w-[1px] bg-[#2A2E35] rounded-full mx-2" />

          {/* Settings & Tools */}
          <div className="md:mt-auto md:mb-4 ml-auto md:ml-0 flex flex-row md:flex-col items-center gap-3">
            {/* Snapshot Tools */}
            <button 
              onClick={handleSaveSnapshot}
              className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                snapshotSaved ? 'bg-[#181A22] text-[#52B788]' : 'hover:bg-[#181A22] text-[#8D99AE] group-hover:text-[#F4F4F9]'
              }`}
              title="Snapshot Workspace State"
            >
              <Camera className="w-5 h-5" />
            </button>

            {/* uAuth Anchor */}
            <div className="relative">
              <button 
                onClick={() => setUauthOpen(!uAuthOpen)}
                className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#181A22] group transition-colors relative"
              >
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-[#0E0E10] ${isLoggedIn ? 'bg-[#DDA15E]' : 'bg-[#8D99AE]'}`} />
                <Fingerprint className={`w-5 h-5 ${isLoggedIn ? 'text-[#DDA15E]' : 'text-[#8D99AE]'}`} strokeWidth={2} />
              </button>
              
              <AnimatePresence>
                {uAuthOpen && isLoggedIn && (
                  <motion.div
                    initial={{ opacity: 0, x: -10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-0 left-[60px] w-[240px] bg-[#101217] border border-[#2A2E35] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2 z-50 flex flex-col gap-1"
                  >
                    <div className="px-3 py-2 border-b border-[#2A2E35] mb-1">
                      <span className="text-[10px] text-[#8D99AE] font-mono tracking-wide uppercase">uAuth Identity</span>
                    </div>
                    <button className="flex items-center gap-3 w-full px-3 py-2 hover:bg-[#181A22] rounded-lg transition-colors text-left group">
                      <Key className="w-4 h-4 text-[#DDA15E]" />
                      <div className="flex flex-col">
                        <span className="text-[11px] text-[#F4F4F9] font-medium group-hover:text-[#DDA15E]">Hardware Passkeys</span>
                        <span className="text-[9px] text-[#8D99AE]">StrongBox Ed25519</span>
                      </div>
                    </button>
                    <button className="flex items-center gap-3 w-full px-3 py-2 hover:bg-[#181A22] rounded-lg transition-colors text-left group">
                      <CreditCard className="w-4 h-4 text-[#52B788]" />
                      <div className="flex flex-col">
                        <span className="text-[11px] text-[#F4F4F9] font-medium group-hover:text-[#52B788]">uPay Methods</span>
                        <span className="text-[9px] text-[#8D99AE]">Zero-Knowledge Payments</span>
                      </div>
                    </button>
                    <button className="flex items-center gap-3 w-full px-3 py-2 hover:bg-[#181A22] rounded-lg transition-colors text-left group">
                      <ShieldAlert className="w-4 h-4 text-[#3D8D8B]" />
                      <div className="flex flex-col">
                        <span className="text-[11px] text-[#F4F4F9] font-medium group-hover:text-[#3D8D8B]">Legacy Passwords</span>
                        <span className="text-[9px] text-[#8D99AE]">TPM Enclave Encryption</span>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#181A22] group transition-colors" title="Browser Settings">
              <Settings className="w-5 h-5 text-[#8D99AE] group-hover:text-[#F4F4F9]" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Split Screen / Main Canvas */}
        <div className="flex-1 flex overflow-hidden">
          {tabs.length === 0 ? (
            <div className="flex-1 bg-[#0E0E10] flex items-center justify-center p-10 relative">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #2A2E35 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              
              {!isLoggedIn ? (
                <div className="w-80 bg-[#14161D] border border-[#2A2E35] rounded-2xl p-8 flex flex-col items-center shadow-xl relative z-10">
                   <Shield className="w-12 h-12 text-[#DDA15E] mb-5" />
                   <h2 className="text-[#F4F4F9] text-xl font-extrabold mb-2">uSafe Sovereign ID</h2>
                   <p className="text-[#8D99AE] text-[12px] text-center mb-8">Authenticate to decrypt your mesh session and access the app drawer.</p>
                   <button onClick={() => setIsLoggedIn(true)} className="w-full py-3 bg-[#DDA15E] text-[#14161D] text-[13px] font-bold rounded-xl hover:bg-[#e0ae75] transition-colors">
                     Login / Sign Up
                   </button>
                </div>
              ) : (
                <div className="w-[600px] flex flex-col items-center relative z-10">
                  <h2 className="text-[#F4F4F9] text-3xl font-extrabold mb-12">uSafe App Drawer</h2>
                  <div className="grid grid-cols-4 gap-8 w-full">
                     {[
                       { label: 'Passkeys', icon: Key, color: 'text-[#DDA15E]', bg: 'group-hover:border-[#DDA15E]/50' },
                       { label: 'Wallet', icon: Wallet, color: 'text-[#52B788]', bg: 'group-hover:border-[#52B788]/50' },
                       { label: 'Mail', icon: Mail, color: 'text-[#7E78D2]', bg: 'group-hover:border-[#7E78D2]/50' },
                       { label: 'Mesh Nodes', icon: Waypoints, color: 'text-[#3D8D8B]', bg: 'group-hover:border-[#3D8D8B]/50' }
                     ].map(app => (
                       <div key={app.label} className="flex flex-col items-center gap-4 group cursor-pointer">
                          <div className={`w-20 h-20 bg-[#181A22] border border-[#2A2E35] rounded-[24px] flex items-center justify-center transition-all duration-300 group-hover:bg-[#1E222D] ${app.bg} group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)]`}>
                             <app.icon className={`w-8 h-8 ${app.color}`} />
                          </div>
                          <span className="text-[#F4F4F9] text-[12px] font-medium tracking-wide">{app.label}</span>
                       </div>
                     ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Pane 1 (Primary) */}
              <div className={`flex-1 flex flex-col bg-[#14161D] overflow-y-auto ${isTiledView ? 'border-r border-[#2A2E35]' : ''}`}>
                {!activeTab?.url ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-10">
                    <Shield className="w-16 h-16 text-[#2A2E35] mb-6" />
                    <div className="w-full max-w-xl bg-[#0E0E10] border border-[#2A2E35] rounded-full h-12 flex items-center px-4 mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] focus-within:border-[#DDA15E] transition-colors">
                      <Search className="w-5 h-5 text-[#8D99AE] mr-3" />
                      <input 
                        type="text" 
                        placeholder="Search the decentralized web or enter URL..."
                        className="bg-transparent outline-none text-[#F4F4F9] w-full text-[13px]"
                        value={activeTab?.url || ''}
                        onChange={(e) => updateActiveTabUrl(e.target.value)}
                      />
                    </div>
                    <p className="text-[#8D99AE] text-[11px]">Private, zero-telemetry search routing</p>
                  </div>
                ) : activeTab?.url.startsWith('kite://') ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-10">
                    <Settings className="w-16 h-16 text-[#2A2E35] mb-6" />
                    <h1 className="text-[#F4F4F9] text-2xl font-extrabold mb-2">Internal System Config</h1>
                    <p className="text-[#8D99AE] text-[12px] font-mono tracking-widest">{activeTab.url}</p>
                  </div>
                ) : (
                  <div className="p-10">
                    <h1 className="text-[#F4F4F9] text-2xl font-extrabold mb-2">Deterministic Chromium Hardening</h1>
                    <p className="text-[#8D99AE] text-[12px] mb-8">Hardware isolation via StrongBox • Pure local execution</p>
                    
                    <div className="space-y-4 max-w-2xl mb-10">
                      <div className="h-1.5 bg-[#232836] rounded-full w-[100%]" />
                      <div className="h-1.5 bg-[#232836] rounded-full w-[90%]" />
                      <div className="h-1.5 bg-[#232836] rounded-full w-[95%]" />
                      <div className="h-1.5 bg-[#232836] rounded-full w-[70%]" />
                    </div>

                    <div className="max-w-2xl h-28 rounded-xl bg-[#101217] border border-[#232836] flex items-center justify-center mb-10">
                      <span className="font-mono text-[11px] text-[#4A6FA5]">[ Sandboxed DOM Process Isolated from OS Directives ]</span>
                    </div>

                    <div className="space-y-4 max-w-2xl">
                      <div className="h-1.5 bg-[#232836] rounded-full w-[100%]" />
                      <div className="h-1.5 bg-[#232836] rounded-full w-[85%]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Pane 2 (Tiled) */}
              {isTiledView && (
                <div className="flex-1 bg-[#14161D] p-8 overflow-y-auto flex flex-col relative animate-in slide-in-from-right-4 duration-300">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-[#101217] border-b border-[#2A2E35] flex items-center px-4 gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#DDA15E]" />
                    <span className="text-[#8D99AE] text-[10px] font-mono tracking-widest">kite://mesh-topology</span>
                  </div>
                  
                  <div className="mt-12">
                    <h1 className="text-[#F4F4F9] text-xl font-extrabold mb-2">OpenClaw Mesh Relay</h1>
                    <p className="text-[#8D99AE] text-[11px] mb-8">Multi-hop egress routing via localized peers</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 bg-[#181A22] p-4 rounded-xl border border-[#2A2E35]">
                        <div className="w-10 h-10 rounded-full bg-[#3D8D8B]/10 border border-[#3D8D8B]/30 flex items-center justify-center shrink-0">
                          <Waypoints className="w-5 h-5 text-[#3D8D8B]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[12px] text-[#F4F4F9] font-bold">Entry Node: Reykjavik-02</span>
                          <span className="text-[10px] text-[#8D99AE] font-mono mt-0.5">Origin IP Masked • Encrypted</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className="w-0.5 h-6 bg-[#2A2E35]" />
                      </div>

                      <div className="flex items-center gap-4 bg-[#181A22] p-4 rounded-xl border border-[#DDA15E]">
                        <div className="w-10 h-10 rounded-full bg-[#DDA15E]/10 border border-[#DDA15E]/30 flex items-center justify-center shrink-0">
                          <Lock className="w-5 h-5 text-[#DDA15E]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[12px] text-[#F4F4F9] font-bold">Exit Node: Zurich-04</span>
                          <span className="text-[10px] text-[#8D99AE] font-mono mt-0.5">XChaCha20-Poly1305 Tunnel Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Aura AI In-Tab HUD (Right Drawer) */}
        <AnimatePresence>
          {auraOpen && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[260px] bg-[#101217] border-l border-[#2A2E35] flex flex-col absolute right-0 top-0 bottom-0 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] m-4 rounded-xl"
            >
              <div className="p-5 flex flex-col h-full">
                {/* Drawer Header */}
                <div className="inline-flex px-2 py-0.5 bg-[#181A24] border border-[#7E78D2] rounded-md text-[9px] font-bold text-[#7E78D2] tracking-wider mb-6 w-fit">
                  AURA SYNTH
                </div>
                
                <h2 className="text-[#F4F4F9] text-[13px] font-bold mb-1">Aura Assistant</h2>
                
                {!isGeminiConnected ? (
                  <>
                    <p className="text-[#8D99AE] text-[10.5px] mb-8">AI capabilities inactive</p>
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <Shield className="w-8 h-8 text-[#2A2E35] mb-4" />
                      <h3 className="text-[#F4F4F9] text-[12px] font-bold mb-2">Connect to OpenClaw</h3>
                      <p className="text-[#8D99AE] text-[10px] mb-6 leading-relaxed">
                        Route your AI queries securely through the decentralized mesh by connecting Gemini via OpenClaw.
                      </p>
                      <button 
                        onClick={() => setIsGeminiConnected(true)}
                        className="w-full py-2.5 bg-[#7E78D2]/10 border border-[#7E78D2]/30 rounded-xl text-[#7E78D2] text-[11px] font-bold hover:bg-[#7E78D2]/20 transition-colors"
                      >
                        Authorize & Connect
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[#8D99AE] text-[10.5px] mb-8">Powered by Gemini via OpenClaw</p>
                    
                    {/* Chat Placeholder */}
                    <div className="space-y-4 flex-1 flex flex-col justify-end">
                       <div className="text-center text-[#8D99AE] text-[11px] mb-4">
                         How can I help you today?
                       </div>
                    </div>

                    {/* Action Button */}
                    <button className="mt-auto w-full py-2.5 bg-[#181A22] border border-[#2A2E35] rounded-full text-[#7E78D2] text-[11px] font-bold hover:bg-[#1E222D] hover:border-[#7E78D2]/50 transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-3.5 h-3.5" />
                      New Chat
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Custom Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 bg-[#101217] border border-[#2A2E35] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] p-1.5 w-48 flex flex-col gap-1"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => toggleSecretMode(contextMenu.tabId)}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-left rounded-lg hover:bg-[#181A22] group transition-colors"
            >
              <VenetianMask className="w-4 h-4 text-[#7E78D2]" />
              <span className="text-[#F4F4F9] text-[11px] font-medium group-hover:text-[#7E78D2]">Secret Mode</span>
            </button>
            <button 
              onClick={() => {
                setTabs(prev => prev.map(item => {
                  if (item.type === 'island') {
                    return { ...item, tabs: item.tabs.map(t => t.id === contextMenu.tabId ? { ...t, suspended: true } : t) };
                  }
                  return item.id === contextMenu.tabId ? { ...item as TabNode, suspended: true } : item;
                }));
                setContextMenu(null);
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-left rounded-lg hover:bg-[#181A22] group transition-colors"
            >
              <MoonStar className="w-4 h-4 text-[#8D99AE] group-hover:text-[#52B788]" />
              <span className="text-[#F4F4F9] text-[11px] font-medium group-hover:text-[#52B788]">Sleep Tab</span>
            </button>
            <div className="h-[1px] bg-[#2A2E35] mx-1 my-0.5" />
            <button 
              onClick={() => closeTab(contextMenu.tabId)}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-left rounded-lg hover:bg-[#181A22] group transition-colors"
            >
              <X className="w-4 h-4 text-[#8D99AE] group-hover:text-red-400" />
              <span className="text-[#F4F4F9] text-[11px] font-medium group-hover:text-red-400">Close Tab</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspace Creation Modal */}
      <AnimatePresence>
        {showWorkspaceModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[110] backdrop-blur-sm bg-[#0E0E10]/80 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm bg-[#14161D] border border-[#2A2E35] rounded-[24px] p-6 shadow-2xl">
              <h3 className="text-[#F4F4F9] text-lg font-bold mb-4">New Workspace</h3>
              
              <input 
                type="text" 
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="Workspace Name"
                className="w-full bg-[#0E0E10] border border-[#2A2E35] rounded-xl px-4 py-3 text-[#F4F4F9] text-sm outline-none focus:border-[#DDA15E] transition-colors mb-6"
                autoFocus
              />
              
              <div className="mb-6">
                <span className="text-[#8D99AE] text-xs font-semibold mb-3 block">SELECT ICON</span>
                <div className="flex flex-wrap gap-3">
                  {[Briefcase, PenTool, ShoppingBag, Users, Code, Music, Gamepad2, Coffee, Globe, BookMarked].map((IconComp, idx) => (
                    <button
                      key={idx}
                      onClick={() => setNewWorkspaceIcon(() => IconComp)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                        newWorkspaceIcon === IconComp 
                          ? 'bg-[#DDA15E]/10 border-[#DDA15E] text-[#DDA15E]' 
                          : 'bg-[#181A22] border-transparent text-[#8D99AE] hover:bg-[#2A2E35]'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setShowWorkspaceModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#2A2E35] text-[#8D99AE] text-sm font-semibold hover:bg-[#181A22] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddWorkspace}
                  disabled={!newWorkspaceName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[#DDA15E] text-[#14161D] text-sm font-bold hover:bg-[#e0ae75] transition-colors disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* First-Time Boot / Animated Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] backdrop-blur-md bg-[#0E0E10]/80 flex items-center justify-center"
          >
            <div className="w-[420px] bg-[#14161D] border border-[#7E78D2]/30 rounded-[24px] p-8 flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#DDA15E] via-[#52B788] to-[#7E78D2]" />
              <div className="w-16 h-16 rounded-full bg-[#181A22] border border-[#2A2E35] flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-[#7E78D2]" />
              </div>
              <h2 className="text-[#F4F4F9] text-2xl font-extrabold mb-3 text-center">Welcome to uSafe One</h2>
              <p className="text-[#8D99AE] text-[13px] text-center mb-8 leading-relaxed">
                Sign up with your SSO provider to instantly sync your workspaces and establish your encrypted mesh session.
              </p>
              <button 
                onClick={() => {
                  setIsLoggedIn(true);
                  setShowTutorial(false);
                }}
                className="w-full py-3 bg-[#DDA15E] text-[#14161D] text-[13px] font-bold rounded-xl hover:bg-[#e0ae75] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-5 h-5" />
                Continue with SSO
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
