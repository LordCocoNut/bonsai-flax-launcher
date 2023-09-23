<template>
  <div class="row text-center">
    <div class="col-12 q-mb-xl">
      <img alt="Quasar logo" src="https://flaxengine.com/wp-content/uploads/2020/12/logo_1_150x100.png"
        style="width: 200px;">
      <p class="q-mb-sm">Flax Engine Launcher</p>
      <small>Linux edition</small>
    </div>
  </div>
  <div class="row">
    <div class="col-12 q-gutter-x-md text-center">
      <q-btn color="primary" :to="toPage(PAGE_NAMES.engine)">
        Engine
      </q-btn>
      <q-btn color="primary" :to="toPage(PAGE_NAMES.projects)">
        Projects
      </q-btn>
    </div>

  </div>
</template>

<script setup>
import { PAGE_NAMES } from 'src/router/routes';
import { toPage } from 'src/utils';


</script>
