<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from "quasar";
import { onMounted } from "vue";
import { useProjectList } from "./composables/project-related";
import { useInfos } from "./composables/engine-related";
import { useSettings } from "./composables/launcher-related";

const { refreshProjects } = useProjectList();
const { refreshInfos } = useInfos();
const { loadSettings } = useSettings();
const $q = useQuasar();
$q.dark.set(true);

projectApi.handleProjectCreated(refreshProjects);
projectApi.handleProjectFolderSet(async () => { await loadSettings(); await refreshProjects(); });



onMounted(async () => {
  await refreshProjects();
  await refreshInfos();
  await loadSettings();
});
</script>
