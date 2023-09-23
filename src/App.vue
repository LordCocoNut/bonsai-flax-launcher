<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { useProjectList } from './composables/project-related';
import { useEngineInfo } from './composables/engine-related';

const { refreshProjects } = useProjectList();
const { refreshInstallationInfo } = useEngineInfo();

const $q = useQuasar();
$q.dark.set(true);

projectApi.handleProjectCreated(refreshProjects);


onMounted(async () => {
  await refreshProjects();
  await refreshInstallationInfo();
})
</script>
