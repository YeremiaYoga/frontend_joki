<template>
  <v-app>
    <div class="">
      <h1 class="text-center mt-10">Sistem Informasi Pegawai</h1>
    </div>
    <v-card class="mx-auto mt-16" max-width="1000">
      <v-carousel hide-delimiter-background show-arrows-on-hover cycle>
        <v-carousel-item
          v-for="item in items"
          :key="item.src"
          :src="item.src"
        ></v-carousel-item>
      </v-carousel>
    </v-card>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          src: "https://media.discordapp.net/attachments/558291614850613287/1055422132177338429/tampilan_Home_5.jpg",
        },
        {
          src: "https://media.discordapp.net/attachments/558291614850613287/1055422130998743070/Tampilan_Home_2.jpg",
        },
        {
          src: "https://cdn.discordapp.com/attachments/558291614850613287/1055422131426558002/tampilan_Home_3.jpg",
        },
        {
          src: "https://media.discordapp.net/attachments/558291614850613287/1055422131749523526/Tampilan_Home_4.jpg",
        },
      ],
    };
  },
};
</script>

<style>
</style>