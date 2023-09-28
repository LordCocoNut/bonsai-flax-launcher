import { reactive } from "vue";
import * as fs from "fs";
import * as https from "https";

/**
 * @param {import("./router/routes").PAGE_NAMES} pageName
 * @returns {{name: string}}
 */
export const toPage = (pageName) => ({ name: pageName });

/**
 * Just a template for building engine installation info.
 * @typedef {{installed: boolean, version: number|string, build: number|string}} EngineInfo
 * @param {boolean} installed
 * @param {string|number} version
 * @param {string|number} build
 * @returns {EngineInfo}
 */
export const engineInfoTemplate = (
  installed = false,
  version = 1.6,
  build = 0
) => ({
  installed,
  version,
  build,
});

export const btoolsInfoTemplate = (installed = false) => ({
  installed,
});

/**
 * Used as a global store, since we dont need anything advanced like pinia, this will do
 * @typedef {{projectList: Array, engineInfo: EngineInfo, engineIsDownloading: boolean, engineIsInstalling: boolean, projectsFolder: string|undefined}} GlobalSharedStore
 * @type {import("vue").UnwrapNestedRefs<GlobalSharedStore>}
 */
export const SharedStore = reactive({
  projectList: [],
  engineInfo: engineInfoTemplate(),
  btoolsInfo: btoolsInfoTemplate(),
  engineIsDownloading: false,
  btoolsIsDownloading: false,
  engineIsInstalling: false,
  btoolsIsInstalling: false,
  projectsFolder: undefined,
});

/**
 * Checks whether folder exists and creates one if not
 * @param {string} path
 * @returns {void}
 */
export const ensureFolderExists = (path) => {
  fs.existsSync(path) || fs.mkdirSync(path);
};

/**
 * Checks whether file exists and creates one if not
 * @param {string} path
 * @returns {void}
 */
export const ensureFileExists = (path) => {
  fs.existsSync(path) || fs.writeFileSync(path, "");
};

export const saveSettings = (settings) =>
  fs.writeFileSync("", JSON.stringify(se));

export const readSettings = () => JSON.parse(fs.readFileSync(""));

/**
 * @typedef {object} InstallDataChanellSet
 * @prop {string} downloadStart
 * @prop {string} downloadFinished
 * @prop {string} downloadProgress
 * @prop {string} downloadFinished
 * @prop {string} installFinished
 */

/**
 * @callback DownloadInstallProgressMethod
 * @param {string} downloadFileName
 * @param {string} downloadFolder
 * @param {string} decompressFolder
 * @param {InstallDataChanellSet} eventChanels
 */

/**
 * @param {string} link
 * @param {import("electron").BrowserWindow } mainWindow
 * @param {import("decompress") } decompress
 * @returns {DownloadInstallProgressMethod}
 */
export const installData =
  (link, mainWindow, decompress) =>
  (downloadFileName, downloadFolder, decompressFolder, eventChanels) => {
    ensureFolderExists(downloadFolder);

    let downloadRequest = https.get(link, (res) => {
      // Data will be stored at this path
      const filePath = fs.createWriteStream(downloadFileName);
      res.pipe(filePath);

      const resourceSize = res.headers["content-length"];
      mainWindow.webContents.send(eventChanels.downloadStart, resourceSize);

      //Trigger download data amount update
      res.on("readable", () => {
        while (mainWindow && null !== (chunk = res.read())) {
          mainWindow.webContents.send(
            eventChanels.downloadProgress,
            chunk.length
          );
        }
      });

      filePath.on("finish", () => {
        downloadRequest = undefined;
        filePath.close();
        //Triger download finished event

        mainWindow.webContents.send(eventChanels.downloadFinished);
        //Trigger start of installation event

        //Unpack all files in downloaded zip to the engine editor path
        decompress(downloadFileName, decompressFolder)
          .then(() => {
            mainWindow.webContents.send(eventChanels.installFinished);
          })
          .catch((error) => {
            //TODO: this is pretty much useless we need better error handling
            console.log(error);
          });
      });
    });
  };
