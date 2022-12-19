<template>
  <v-app>
    <div class="">
      <h1 class="text-center mt-10">Sistem Informasi Pegawai</h1>
    </div>
    <v-carousel
      class="mt-16"
      cycle
      height="500"
      
      hide-delimiter-background
      show-arrows-on-hover
    >
      <v-carousel-item v-for="(slide, i) in slides" :key="i">
        <v-sheet :color="colors[i]" height="500px" widht="500px">
          <v-row class="fill-height" align="center" justify="center">
            <div class="text-h2">{{ slide }} Contoh Pengumuman</div>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      colors: [
        "indigo",
        "warning",
        "pink darken-2",
        "red lighten-1",
        "deep-purple accent-4",
      ],
      slides: ["First", "Second", "Third", "Fourth", "Fifth"],
    };
  },
};
</script>

<style>
</style>