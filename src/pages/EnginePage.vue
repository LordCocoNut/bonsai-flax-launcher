<template>
  <div class="row text-center" v-if="!SharedStore.engineInfo.installed">
    <div class="col-12 q-mb-xl">
      <p>You didnt install any engine version yet. Pick the engine destination or install it.</p>
      <q-btn @click="installEngine" color="primary"
        v-if="!SharedStore.engineIsInstalling && !SharedStore.engineIsDownloading" label="Download engine" />

      <p v-if="SharedStore.engineIsInstalling">Installation in progress</p>
      <p v-else-if="SharedStore.engineIsDownloading">Downloading in progress</p>
    </div>
    <div class="col-12 q-px-sm" v-if="SharedStore.engineIsDownloading">
      <q-linear-progress dark stripe rounded size="20px" :value="downloadProgressPercentil" color="primary"
        class="q-mt-sm" />
    </div>
    <div class="col-12 q-px-sm" v-else-if="SharedStore.engineIsInstalling">
      <q-linear-progress dark rounded indeterminate color="secondary" size="20px" class="q-mt-sm" />
    </div>
  </div>
  <div class="row text-center" v-else>
    <div class="col-12 q-mb-xl">
      <p class="q-mb-none">You have Flax Engine v. {{ SharedStore.engineInfo.version }} installed</p>
      <p><small>Build v. {{ SharedStore.engineInfo.build }}</small></p>
      <q-icon name="done" size="4rem" />
    </div>
  </div>
</template>

<script setup>
import { min } from 'ramda';
import { useEngineInfo } from 'src/composables/engine-related';
import { SharedStore } from 'src/utils';
import { computed, ref } from 'vue';

const { refreshInstallationInfo } = useEngineInfo();
const installEngine = engineApi.installEngine;

const maxSize = ref(0);
const downloaded = ref(0);

const downloadProgressPercentil = computed(() => SharedStore.engineIsDownloading ? min(1, Math.round(downloaded.value / maxSize.value * 100) / 100) : 0);


engineApi.handleInstallFinished(() => {
  SharedStore.engineIsInstalling = true;
  refreshInstallationInfo()
});

engineApi.handleDownloadInitiated((_e, maxSizeNew) => {
  SharedStore.engineIsDownloading = true;
  maxSize.value = maxSizeNew;
});

engineApi.handleDownloadedBatch((e, downloadedDataSize) => downloaded.value += downloadedDataSize);
engineApi.handleDownloadFinished(() => {
  downloaded.value = 0;
  SharedStore.engineIsDownloading = false;
  SharedStore.engineIsInstalling = true;
});

</script>

<style>
.q-linear-progress__model--with-transition,
.q-linear-progress__track--with-transition {
  transition: transform 0.4s !important;
}

.q-linear-progress__stripe--with-transition {
  transition: transform 0.4s !important;
}
</style>
