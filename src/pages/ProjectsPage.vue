<template>
  <div class="row text-center">

    <q-dialog v-model="createDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Project name</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense :model-value="projectName" @update:model-value="formatCreateName" autofocus
            @keyup:enter="onCreateSubmit" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="projectName = ''" v-close-popup />
          <q-btn flat @click="onCreateSubmit" label="Create" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>



    <div class="col-12 q-mb-xl">
      <p>Here are your projects</p>
      <p v-if="!SharedStore.engineInfo.installed">You dont have engine installed. Install one before opening a project.
      </p>
      <q-btn v-if="SharedStore.engineInfo.installed" @click="createDialog = true" color="primary"
        label="Create new one" />
    </div>
    <div class="col-12 q-px-lg">
      <q-card class="my-card shadow-0 cursor-pointer" v-for="project in SharedStore.projectList" :key="project.name"
        @click="openProject(project.name)">
        <q-img :src="project.icon">
          <div class="text-subtitle2 absolute-top text-center">
            {{ project.name }}
          </div>
        </q-img>
      </q-card>


    </div>

  </div>
</template>

<script setup>
import { head, join, map, pipe, replace, split, tail, toLower, toUpper } from 'ramda';
import { SharedStore } from 'src/utils';
import { ref } from 'vue';

const refreshProjects = projectsApi.refreshProjectList;
const openProject = projectApi.openProject;
const createProject = projectApi.createProject;

const formatCreateName = (v) => console.log(v) || (projectName.value = pipe(replace(/\s/g, '_'), toLower)(v));
const formatProjectName = pipe(split("_"), map((v) => `${toUpper(head(v))}${tail(v)}`), join(" "));


const createDialog = ref(false);
const projectName = ref(undefined);

const onCreateSubmit = () => {
  if (undefined === projectName.value) {
    return false;
  }

  createProject(projectName.value);
  projectName.value = undefined;
}

</script>

<style scoped>
.project-title {
  font-size: 1.5rem;
}

.my-card {
  width: 100%;
  background-position: center;
  background-size: cover;
  max-width: 33%;
}
</style>
