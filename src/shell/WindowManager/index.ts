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
}

class WindowManager {
  private windows: Map<WindowId, WindowState> = new Map();
  private zCounter = 1;

  create(appId: string, initial?: Partial<WindowState>): WindowState {
    const id = `${appId}-${Date.now()}`;
    const state: WindowState = {
      id,
      appId,
      x: initial?.x ?? 80,
      y: initial?.y ?? 80,
      width: initial?.width ?? 800,
      height: initial?.height ?? 600,
      z: ++this.zCounter,
      focused: true,
    };
    this.windows.set(id, state);
    return state;
  }

  focus(id: WindowId): void {
    const win = this.windows.get(id);
    if (!win) return;
    win.z = ++this.zCounter;
    win.focused = true;
  }

  close(id: WindowId): void {
    this.windows.delete(id);
  }

  list(): WindowState[] {
    return Array.from(this.windows.values()).sort((a, b) => a.z - b.z);
  }
}

export const windowManager = new WindowManager();


