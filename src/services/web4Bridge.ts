/**
 * Web4 / Web3 Plus Bridge & Electron IPC Connector
 * Manages decentralized mesh tunnels, custom protocol routing (web4://, web3p://, kite://),
 * and Electron hardware passkey / window controls.
 */

export interface Web4NodePeer {
  id: string;
  location: string;
  latencyMs: number;
  status: 'connected' | 'routing' | 'idle';
  encryption: 'XChaCha20-Poly1305' | 'AES-256-GCM';
  egressIP: string;
  bandwidthMbps: number;
}

export interface Web4MeshStatus {
  connected: boolean;
  activeNetwork: 'Web4 Sovereign Mesh' | 'Web3 Plus Layer-1' | 'Local Isolated Sandbox';
  currentNode: string;
  peersCount: number;
  tunnelActive: boolean;
  totalDataEncryptedMb: number;
  peers: Web4NodePeer[];
}

export class Web4BridgeService {
  private meshStatus: Web4MeshStatus = {
    connected: true,
    activeNetwork: 'Web4 Sovereign Mesh',
    currentNode: 'ap-south-1 (Mumbai Relay)',
    peersCount: 14,
    tunnelActive: true,
    totalDataEncryptedMb: 418.6,
    peers: [
      { id: 'node-reykjavik-02', location: 'Reykjavik, IS', latencyMs: 38, status: 'connected', encryption: 'XChaCha20-Poly1305', egressIP: '185.220.101.44', bandwidthMbps: 450 },
      { id: 'node-zurich-04', location: 'Zurich, CH', latencyMs: 24, status: 'routing', encryption: 'XChaCha20-Poly1305', egressIP: '194.126.177.10', bandwidthMbps: 820 },
      { id: 'node-tokyo-09', location: 'Tokyo, JP', latencyMs: 62, status: 'connected', encryption: 'XChaCha20-Poly1305', egressIP: '103.251.167.3', bandwidthMbps: 610 },
      { id: 'node-mumbai-01', location: 'Mumbai, IN', latencyMs: 12, status: 'connected', encryption: 'XChaCha20-Poly1305', egressIP: '49.207.54.89', bandwidthMbps: 940 },
    ]
  };

  private listeners: ((status: Web4MeshStatus) => void)[] = [];

  public subscribe(listener: (status: Web4MeshStatus) => void) {
    this.listeners.push(listener);
    listener(this.meshStatus);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.meshStatus));
  }

  public getStatus(): Web4MeshStatus {
    return this.meshStatus;
  }

  public isElectron(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window as any).electronAPI || !!(window as any).process?.versions?.electron;
  }

  public toggleTunnel(): boolean {
    this.meshStatus.tunnelActive = !this.meshStatus.tunnelActive;
    this.notify();
    return this.meshStatus.tunnelActive;
  }

  public switchNetwork(network: Web4MeshStatus['activeNetwork']) {
    this.meshStatus.activeNetwork = network;
    this.notify();
  }

  /**
   * Resolves web4:// or web3p:// URLs to decentralized content or gateway
   */
  public resolveProtocol(rawUrl: string): { isWeb4: boolean; resolvedTitle: string; badge: string } {
    const trimmed = rawUrl.trim();
    if (trimmed.startsWith('web4://') || trimmed.startsWith('web3p://')) {
      const path = trimmed.replace(/^(web4|web3p):\/\//, '');
      return {
        isWeb4: true,
        resolvedTitle: `Web4: ${path || 'Decentralized Gateway'}`,
        badge: 'Web4 Sovereign Tunnel'
      };
    }
    if (trimmed.startsWith('kite://')) {
      return {
        isWeb4: true,
        resolvedTitle: `Kite Internal: ${trimmed.replace('kite://', '')}`,
        badge: 'Kite Enclave'
      };
    }
    return {
      isWeb4: false,
      resolvedTitle: rawUrl,
      badge: 'TLS 1.3 / Clear'
    };
  }

  /**
   * Triggers Electron native window control action
   */
  public sendWindowControl(action: 'minimize' | 'maximize' | 'close') {
    if (this.isElectron() && (window as any).electronAPI) {
      (window as any).electronAPI.windowControl(action);
    } else {
      console.log(`[Electron Native IPC Emulation] Window control: ${action}`);
    }
  }
}

export const web4Bridge = new Web4BridgeService();
