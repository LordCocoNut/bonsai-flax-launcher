<template>
  <q-layout view="hHh Lpr lff">
    <q-header>
      <q-bar :class="[{ 'bg-primary': !$q.dark, 'bg-dark': $q.dark }, 'text-white']">
        <span class="window-title">Flax Engine Launcher - Linux Edition</span>
        <q-space class="title-bar" />
        <q-btn v-for="toolbarBtn in toolbarBtns" :key="toolbarBtn.icon" dense flat v-bind="toolbarBtn"
          @click="toolbarBtn.click" />
      </q-bar>
    </q-header>

    <q-drawer show :width="250" :breakpoint="500" :class="[{ 'bg-primary': !$q.dark, 'bg-dark': $q.dark }, 'text-white']"
      v-model="drawer">
      <q-list>
        <q-item v-for="link in navSectionLinks" :key="link.label" :active-class="$q.dark ? 'bg-grey-8' : 'bg-blue-8'"
          :to="link.route" clickable v-ripple>
          <q-item-section>
            <q-item-label>
              {{ link.label }}
              <q-badge v-if="link.badge" color="secondary">
                {{ link.badge }}
              </q-badge>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="flex q-pt-xl">
        <div class="full-width">
          <router-view />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { PAGE_NAMES } from 'src/router/routes';
import { SharedStore, toPage } from 'src/utils';
import { computed, ref } from 'vue';

const toggleFullscreen = windowApi.toggleFulscreen;
const close = windowApi.close;
const minimize = windowApi.minimize;

const drawer = ref(true);

const toolbarBtns = [
  { icon: "minimize", click: minimize },
  { icon: "crop_square", click: toggleFullscreen },
  { icon: "close", click: close }
]

const navSectionLinks = computed(() => [
  { label: "Engine", route: toPage(PAGE_NAMES.engine) },
  { label: "Projects", route: toPage(PAGE_NAMES.projects), badge: SharedStore.projectList.length },
  { label: "Dev blog news" },
]);

</script>

<style lang="scss">
.title-bar {
  -webkit-app-region: drag;
  height: 100%;
}

.window-title {
  font-size: 0.8rem;
}
</style>
