import { exec } from "child_process";
import decompress from "decompress";
import { BrowserWindow, app, dialog, ipcMain, nativeTheme } from "electron";
import * as fs from "fs";
import { ClientRequest } from "http";
import * as https from "https";
import os from "os";
import path from "path";
import { forEach, map } from "ramda";
import { SharedStore, engineInfoTemplate, ensureFolderExists } from "src/utils";

/**
 * Electron main serves as the centrum for NodeJs operations. Those operations are than synced via api created using electron-preload.js. Thus,
 * electron-preload.js can be considered Event, this file can be considered Listener. Its also the only file that has access to node.js features as they are
 * disabled in the renderer for security reasons.
 */

//Define paths to filesystems
const system_engine_install_path = `${app.getPath("home")}/.flax-engine`;
const system_engine_editor_path = `${system_engine_install_path}/editor`;
const flax_proj_info = `${system_engine_editor_path}/Flax.flaxproj`;
const download_engine_tmp = `${system_engine_install_path}/download`;
const editor_run_binary = `${system_engine_editor_path}/Binaries/Editor/Linux/Development/FlaxEditor`;
const projects_path = `${system_engine_install_path}/projects`;
const project_icon_path = `Cache/icon.png`;

const REQUIRED_PATHS = [
  system_engine_install_path,
  system_engine_editor_path,
  projects_path,
];

/** @type {ClientRequest|undefined} */
let downloadRequest;

//Commands container
/** @type {Object<string, function(project): string} */
const COMMANDS = {
  CreateProject: (project) =>
    exec(`${editor_run_binary} -new -project ${projects_path}/${project}`),
  OpenProject: (project) =>
    exec(
      `${editor_run_binary} -project ${projects_path}/${project}`
    ),
};

//Check system folders exists and create them if not
forEach(ensureFolderExists, REQUIRED_PATHS);

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === "win32" && nativeTheme.shouldUseDarkColors === true) {
    require("fs").unlinkSync(
      path.join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

/** @type {BrowserWindow|undefined} */
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,

      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    // mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function registerListeners() {
  ipcMain.on("open-file-dialog", (event) => {
    dialog
      .showOpenDialog(mainWindow, {
        properties: ["openFile"],
      })
      .then(({ filePaths }) => {
        filePaths.length && event.reply("on-file-select", filePaths[0]);
      });
  });

  ipcMain.on("open-recent-project", () => {
    exec(
      "/home/bonsai/GameDev/flax_engine/Binaries/Editor/Linux/Development/FlaxEditor --project /home/bonsai/GameDev/flax_games/bygone_farm"
    );
  });
}

//Installation handler
ipcMain.handle("install-engine", () => {
  ensureFolderExists(download_engine_tmp);

  downloadRequest = https.get(
    "https://vps2.flaxengine.com/store/builds/Package_1_06_06344/FlaxEditorLinux.zip",
    (res) => {
      const downloadFileName = `${system_engine_install_path}/download/linux-editor.zip`;

      // Data will be stored at this path
      const filePath = fs.createWriteStream(downloadFileName);
      res.pipe(filePath);

      const resourceSize = res.headers["content-length"];
      mainWindow.webContents.send("engine-download-initiated", resourceSize);

      //Trigger download data amount update
      res.on("readable", () => {
        while (mainWindow && null !== (chunk = res.read())) {
          mainWindow.webContents.send("engine-download-progress", chunk.length);
        }
      });

      filePath.on("finish", () => {
        downloadRequest = undefined;
        filePath.close();
        //Triger download finished event

        mainWindow.webContents.send("engine-download-finished");
        //Trigger start of installation event

        //Unpack all files in downloaded zip to the engine editor path
        decompress(downloadFileName, system_engine_editor_path)
          .then(() => {
            mainWindow.webContents.send("engine-install-finished");
          })
          .catch((error) => {
            //TODO: this is pretty much useless we need better error handling
            console.log(error);
          });
      });
    }
  );
});

ipcMain.handle("refresh-projects", () =>
  map(
    (folder) => ({
      name: folder,
      icon:
        fs.existsSync(`/${projects_path}/${folder}/${project_icon_path}`) &&
        "data:image/png;base64," +
          fs
            .readFileSync(`/${projects_path}/${folder}/${project_icon_path}`)
            .toString("base64"),
    }),
    fs.readdirSync(projects_path)
  )
);

//Build engine installation ifno
ipcMain.handle("refresh-engine-info", () => {
  if (!fs.existsSync(editor_run_binary)) {
    return engineInfoTemplate(false, "none");
  }

  const projInfo = JSON.parse(fs.readFileSync(flax_proj_info, "utf-8"));

  return engineInfoTemplate(
    true,
    `${projInfo.Version.Major}.${projInfo.Version.Minor}`,
    projInfo.Version.Build
  );
});

ipcMain.handle("toggle-full-screen", () =>
  mainWindow.setFullScreen(!mainWindow.isFullScreen())
);
ipcMain.handle("minimize", () => mainWindow.minimize());
ipcMain.handle("close", () => {
  downloadRequest && downloadRequest.end();

  mainWindow.close();
});

ipcMain.handle("open-project", (e, name) => {
  COMMANDS.OpenProject(name);
});

ipcMain.handle("create-project", (e, name) => {
  COMMANDS.CreateProject(name);
  mainWindow.webContents.send("project-created");
});

app.whenReady().then(registerListeners).then(createWindow);

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
