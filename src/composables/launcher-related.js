import { forEachObjIndexed, isEmpty, when } from "ramda";
import { SettingsStorage } from "src/utils";

export const useSettings = () => {
  return {
    loadSettings: async () =>
      forEachObjIndexed((value, key) => (SettingsStorage[key] = value))(
        when(isEmpty, () => ({}))(await engineApi.loadSettings())
      ),
  };
};
