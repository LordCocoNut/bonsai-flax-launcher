import { SharedStore } from "src/utils";

export const useEngineInfo = () => {
  const refreshEngineInstallationInfo = engineApi.refreshEngineInfo;

  return {
    refreshInstallationInfo: async () => {
      SharedStore.engineInfo = await refreshEngineInstallationInfo();
    },
  };
};
