/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 */
import { contextBridge, ipcMain, ipcRenderer } from "electron";

const ipcInvoke =
  (channel) =>
  (...data) =>
    ipcRenderer.invoke(channel, ...data);

contextBridge.exposeInMainWorld("dialogAPI", {
  openFileDialog: () => ipcRenderer.send("open-file-dialog"),
});

contextBridge.exposeInMainWorld("projectApi", {
  openRecentProject: () => ipcRenderer.send("open-recent-project"),
  openProject: (name) => ipcRenderer.invoke("open-project", name),
  createProject: ipcInvoke("create-project"),
  handleProjectCreated: (cback) => ipcRenderer.on("project-created", cback),
});

contextBridge.exposeInMainWorld("engineApi", {
  openRecentProject: () => ipcRenderer.send("install"),
  installEngine: () => ipcRenderer.invoke("install-engine"),
  installBuildTools: () => ipcRenderer.invoke("install-build-tools"),
  handleDownloadInitiated: (cback) =>
    ipcRenderer.on("engine-download-initiated", cback),
  handleDownloadedBatch: (cback) =>
    ipcRenderer.on("engine-download-progress", cback),
  handleDownloadFinished: (cback) =>
    ipcRenderer.on("engine-download-finished", cback),
  handleInstallStarted: (cback) =>
    ipcRenderer.on("engine-install-started", cback),
  handleInstallFinished: (cback) =>
    ipcRenderer.on("engine-install-finished", cback),

  handleBtoolsDownloadInitiated: (cback) => ipcRenderer.on("btools-download-initiated", cback),
  handleBtoolsDownloadedBatch: (cback) => ipcRenderer.on("btools-download-progress", cback),
  handleBtoolsDownloadFinished: (cback) => ipcRenderer.on("btools-download-finished", cback),
  handleBtoolsInstallFinished: (cback) => ipcRenderer.on("btools-install-finished", cback),

  refreshEngineInfo: () => ipcRenderer.invoke("refresh-engine-info"),
});

contextBridge.exposeInMainWorld("windowApi", {
  toggleFulscreen: () => ipcRenderer.invoke("toggle-full-screen"),
  minimize: () => ipcRenderer.invoke("minimize"),
  close: () => ipcRenderer.invoke("close"),
});

contextBridge.exposeInMainWorld("projectsApi", {
  refreshProjectList: () => ipcRenderer.invoke("refresh-projects"),
});

contextBridge.exposeInMainWorld("electronAPI", {
  handleCounter: (callback) => ipcRenderer.on("update-counter", callback),
});

/**
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.js you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */
