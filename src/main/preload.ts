/* The MIT License (MIT)
 *
 * Copyright (c) 2022-present David G. Simmons
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = ['message', 'editMainJSON', 'editUTMJSON'];
export type Events = 'get-font';

export type electronAPI = {
  // getQRConfig: () => Promise<string>;
  // saveQRConfig: (params: string) => Promise<string>;
  getFont: () => Promise<any>;
};

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: string, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
export type ElectronHandler = typeof electronHandler;

contextBridge.exposeInMainWorld('electronAPI', {
  getFont: () => {
    return ipcRenderer.invoke('get-font');
  },
});

// Path: src/main/preload.ts

declare global {
  interface Window {
    electronAPI: {
      getFont: () => Promise<any>;
    };
  }
}
