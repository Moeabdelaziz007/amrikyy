export type WindowId = string;

export interface WindowState {
  id: WindowId;
  appId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  focused: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  previousState?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

class WindowManager {
  private windows: Map<WindowId, WindowState> = new Map();
  private zCounter = 1;
  private focusedWindowId: WindowId | null = null;

  create(appId: string, initial?: Partial<WindowState>): WindowState {
    const id = `${appId}-${Date.now()}`;
    
    // Unfocus all other windows
    this.unfocusAll();
    
    const state: WindowState = {
      id,
      appId,
      x: initial?.x ?? 80 + (this.windows.size * 20),
      y: initial?.y ?? 80 + (this.windows.size * 20),
      width: initial?.width ?? 800,
      height: initial?.height ?? 600,
      z: ++this.zCounter,
      focused: true,
      isMinimized: false,
      isMaximized: false,
      previousState: undefined,
    };
    
    this.windows.set(id, state);
    this.focusedWindowId = id;
    
    return state;
  }

  focus(id: WindowId): void {
    const win = this.windows.get(id);
    if (!win) return;
    
    // Unfocus all other windows
    this.unfocusAll();
    
    // Focus this window
    win.z = ++this.zCounter;
    win.focused = true;
    this.focusedWindowId = id;
  }

  private unfocusAll(): void {
    this.windows.forEach(win => {
      win.focused = false;
    });
  }

  updatePosition(id: WindowId, x: number, y: number): void {
    const win = this.windows.get(id);
    if (!win) return;
    win.x = x;
    win.y = y;
  }

  updateSize(id: WindowId, width: number, height: number): void {
    const win = this.windows.get(id);
    if (!win) return;
    win.width = Math.max(300, width); // Minimum width
    win.height = Math.max(200, height); // Minimum height
  }

  setSize(id: WindowId, newSize: { width: number; height: number }): void {
    this.updateSize(id, newSize.width, newSize.height);
  }

  minimize(id: WindowId): void {
    const win = this.windows.get(id);
    if (!win) return;
    
    win.isMinimized = true;
    win.focused = false;
    
    // Focus the next top window
    const topWindow = this.getTopWindow();
    if (topWindow && topWindow.id !== id) {
      this.focus(topWindow.id);
    } else {
      this.focusedWindowId = null;
    }
  }

  restore(id: WindowId): void {
    const win = this.windows.get(id);
    if (!win) return;
    
    win.isMinimized = false;
    this.focus(id);
  }

  maximize(id: WindowId): void {
    const win = this.windows.get(id);
    if (!win) return;
    
    if (win.isMaximized) {
      // Restore from maximized state
      if (win.previousState) {
        win.x = win.previousState.x;
        win.y = win.previousState.y;
        win.width = win.previousState.width;
        win.height = win.previousState.height;
      }
      win.isMaximized = false;
      win.previousState = undefined;
    } else {
      // Save current state and maximize
      win.previousState = {
        x: win.x,
        y: win.y,
        width: win.width,
        height: win.height,
      };
      
      // Maximize to screen size (with margins)
      win.x = 20;
      win.y = 20;
      win.width = window.innerWidth - 40;
      win.height = window.innerHeight - 40;
      win.isMaximized = true;
    }
    
    this.focus(id);
  }

  close(id: WindowId): void {
    this.windows.delete(id);
    
    // If the closed window was focused, focus the top window
    if (this.focusedWindowId === id) {
      const topWindow = this.getTopWindow();
      if (topWindow) {
        this.focus(topWindow.id);
      } else {
        this.focusedWindowId = null;
      }
    }
  }

  getTopWindow(): WindowState | null {
    const windows = this.list().filter(w => !w.isMinimized);
    return windows.length > 0 ? windows[windows.length - 1] : null;
  }

  getFocusedWindow(): WindowState | null {
    return this.focusedWindowId ? this.windows.get(this.focusedWindowId) || null : null;
  }

  getMinimizedWindows(): WindowState[] {
    return Array.from(this.windows.values())
      .filter(w => w.isMinimized)
      .sort((a, b) => a.z - b.z);
  }

  list(): WindowState[] {
    return Array.from(this.windows.values()).sort((a, b) => a.z - b.z);
  }

  listVisible(): WindowState[] {
    return this.list().filter(w => !w.isMinimized);
  }
}

export const windowManager = new WindowManager();


