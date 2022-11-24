<template>
  <v-app>
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="6" md="4">
          <v-card width="700px" height="350px">
            <v-card-title>
              <h2>Login</h2>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <v-text-field
                  label="Email"
                  type="email"
                  v-model="email"
                  required
                ></v-text-field>
                <v-text-field
                  label="Password"
                  type="password"
                  v-model="password"
                  required
                ></v-text-field>
              </v-form>
              <v-spacer> </v-spacer>
              <v-btn @click="submit">Login</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{
      error_message
    }}</v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      load: false,
      snackbar: false,
      valid: false,
      error_message: "",
      color: "",
      nama: "",
      email: "",
      password: "",
      no_telepon: "",
      role: "",
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.load = true;
        this.$http
          .post(this.$api + "/login", {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            console.log(response);
            localStorage.setItem("id", response.data.user.id);
            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("nama", response.data.user.nama);
            localStorage.setItem("no_telepon", response.data.user.no_telepon);
            localStorage.setItem("role", response.data.user.role);
            localStorage.setItem("email", response.data.user.email);
            localStorage.setItem("password", response.data.user.password);
            this.error_message = response.data.msg;
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            this.$router.push({
              path: "/home",
            })
          })
          .catch((error) => {
            this.error_message = error.response.data.msg;
            console.log(error);
            this.color = "red";
            this.snackbar = true;
            localStorage.removeItem("token");
            this.load = false;
          });
      }
    },
    clear() {
      this.$ref.form.reset();
    },
  },
};
</script>

<style>
</style>