import { reactive } from "vue";
import * as fs from "fs";

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

/**
 * Used as a global store, since we dont need anything advanced like pinia, this will do
 * @typedef {{projectList: Array, engineInfo: EngineInfo, engineIsDownloading: boolean, engineIsInstalling: boolean}} GlobalSharedStore
 * @type {import("vue").UnwrapNestedRefs<GlobalSharedStore>}
 */
export const SharedStore = reactive({
  projectList: [],
  engineInfo: engineInfoTemplate(),
  engineIsDownloading: false,
  engineIsInstalling: false,
});

/**
 * Checks whether folder exists and creates one if not
 * @param {string} path
 * @returns {void}
 */
export const ensureFolderExists = (path) => {
  fs.existsSync(path) || fs.mkdirSync(path);
};
