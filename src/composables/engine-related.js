import { SharedStore } from "src/utils";

export const useEngineInfo = () => {
  const refreshEngineInstallationInfo = engineApi.refreshEngineInfo;

  return {
    refreshInstallationInfo: async () => {
      SharedStore.engineInfo = await refreshEngineInstallationInfo();
    },
  };
};

export const useBtoolsInfo = () => {
  const refreshBtoolsInfo = engineApi.refreshBtoolsInfo;

  return {
    refreshBtoolsInfo: async () => {
      SharedStore.btoolsInfo = await refreshBtoolsInfo();
    },
  };
};


export const useInfos = () => {
  const { refreshBtoolsInfo } = useBtoolsInfo();
  const { refreshInstallationInfo } = useEngineInfo();

  return {
    refreshInfos: () => {
      refreshBtoolsInfo();
      refreshInstallationInfo();
    }
  }
};
