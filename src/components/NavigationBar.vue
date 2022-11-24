<template>
  <v-app>
    <v-app-bar flat app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"> </v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn @click="logout" text grey>Logout</v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app color="white" outlined>
      <v-list-item nav dense>
        <v-list-item-content>
          <v-list-item-title>{{ nama }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :to="item.path"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  name: "NavigationBar",
  data() {
    return {
      role: "",
      drawer: false,
      nama: "",
      id: "",
      selectedItem: 0,
      items: [],
      sidebarAdmin: [
        {
          path: "/home",
          title: "Home",
          icon: "mdi-home",
        },
        {
          path: "/usermanagement",
          title: "User Management",
          icon: "mdi-account-group",
        },
      ],
      sidebarPegawai: [
        {
          path: "/home",
          title: "Home",
          icon: "mdi-home",
        },
        {
          path: `/tugas/?id_user=${this.id}`,
          title: "Tugas",
          icon: "mdi-book-multiple",
        },
      ],
    };
  },
  methods: {
    setDashboard() {
      if (this.role === "Admin") {
        this.items = this.sidebarAdmin;
      } else if (this.role === "Pegawai") {
        this.items = this.sidebarPegawai;
      }
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("role");
      this.$router.replace("/login");
    },
  },
  mounted() {
    if (localStorage.role) {
      this.id = localStorage.id;
      console.log(this.id);
      this.nama = localStorage.nama;
      this.role = localStorage.role;
      this.setDashboard();
    }
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>