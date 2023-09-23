import { SharedStore } from "src/utils";

export const useProjectList = () => {
  const refreshProjects = projectsApi.refreshProjectList;

  return {
    refreshProjects: async () =>
      (SharedStore.projectList = await refreshProjects()),
  };
};
