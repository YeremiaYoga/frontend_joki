<template>
  <v-container>
    <v-card class="justify-center">
      <v-card>
        <v-card-title class="justify-center">
          <h2>Kelola User</h2>
        </v-card-title>

        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>

          <v-spacer></v-spacer>
          <v-btn color="success" dark @click="dialog = true">
            Tambah User
          </v-btn>
        </v-card-title>
        <v-data-table :headers="headers" :items="users" :search="search">
          <template v-slot:[`item.actions`]="{ item }">
            <v-row>
              <div>
                <v-btn
                  small
                  color="primary"
                  class="mr-2"
                  @click="editHandler(item)"
                >
                  Edit
                </v-btn>
              </div>
              <v-btn
                small
                color="success"
                class="mr-2"
                :to="`/taskmanagement/?id_user=${item.id}`"
                >Tugas</v-btn
              >
              <v-btn small color="error" @click="deleteHandler(item)">
                Delete
              </v-btn>
            </v-row>
          </template>
        </v-data-table>
      </v-card>
      <v-dialog v-model="dialog" max-width="1000px">
        <v-card>
          <v-card-title>
            <span>Tambah User</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <div class="mx-1"></div>
                <v-text-field v-model="form.nama" label="Nama" required>
                </v-text-field>
              </v-row>
              <v-row>
                <div class="mx-1"></div>
                <v-text-field
                  v-model="form.no_telepon"
                  label="Telepon"
                  required
                >
                </v-text-field>
              </v-row>
              <v-row>
                <div class="mx-1"></div>
                <v-select
                  v-model="form.role"
                  label="Role"
                  :items="['Admin', 'Pegawai']"
                  required
                >
                </v-select>
              </v-row>
              <v-row>
                <div class="mx-1"></div>
                <v-text-field v-model="form.jabatan" label="Jabatan" required>
                </v-text-field>
              </v-row>
              <v-row>
                <div class="mx-1"></div>
                <v-text-field
                  v-model="form.email"
                  :rules="emailRules"
                  label="Email"
                  required
                >
                </v-text-field>
              </v-row>
              <v-row>
                <div class="mx-1"></div>
                <v-text-field v-model="form.password" label="Password" required>
                </v-text-field>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="cancel">Cancel</v-btn>
            <v-btn
              color="primary"
              text
              @click="setForm"
              :disabled="!form.email || !form.password"
              >Tambah</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogedit" max-width="1000px">
        <v-card>
          <v-card-title>
            <span>Update User</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <div class="mx-1"></div>
                <v-text-field v-model="form.nama" label="Username" required>
                </v-text-field>
              </v-row>
              <v-row>
                <div class="mx-1"></div>
                <v-text-field v-model="form.no_telepon" label="Phone Number">
                </v-text-field>
              </v-row>
              <v-row>
                <div class="mx-1"></div>
                <v-select
                  v-model="form.role"
                  label="Role"
                  :items="['Admin', 'Pegawai']"
                >
                </v-select>
              </v-row>
              <v-row>
                <div class="mx-1"></div>
                <v-text-field v-model="form.jabatan" label="Jabatan" required>
                </v-text-field>
              </v-row>
              <v-row>
                <div class="mx-1"></div>
                <v-text-field
                  v-model="form.email"
                  :rules="emailRules"
                  label="Email"
                >
                </v-text-field>
              </v-row>
              <v-row>
                <div class="mx-1"></div>
                <v-text-field v-model="form.password" label="Password">
                </v-text-field>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="cancel">Cancel</v-btn>
            <v-btn color="primary" text @click="setForm">Update</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-container>
            <v-card-title>
              <span>Hapus User</span>
            </v-card-title>
            <v-card-text>
              <p>Yakin ingin menghapus user ini?</p>
            </v-card-text>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="cancel">Cancel</v-btn>
            <v-btn color="primary" text @click="deleteData">Hapus</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{
        error_message
      }}</v-snackbar>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "UserManagement",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogedit: false,
      dialogDelete: false,
      emailRules: [
        (v) => !!v || "Email kosong",
        (v) => /.+@.+/.test(v) || "Format salah",
      ],
      headers: [
        {
          text: "Nama",
          align: "start",
          sortable: true,
          value: "nama",
        },
        {
          text: "Jabatan",
          value: "jabatan",
        },

        {
          text: "Role",
          value: "role",
        },
        {
          text: "",
          value: "actions",
        },
      ],
      user: new FormData(),
      users: [],

      form: {
        nama: null,
        no_telepon: null,
        role: null,
        jabatan: null,
        email: null,
        password: null,
      },
      deleteId: "",
      editId: "",
    };
  },
  methods: {
    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    readData() {
      var url = this.$api + "/user/tampil";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.users = response.data.data;
        });
    },
    save() {
      this.user.append("nama", this.form.nama);
      this.user.append("no_telepon", this.form.no_telepon);
      this.user.append("role", this.form.role);
      this.user.append("jabatan", this.form.jabatan);
      this.user.append("email", this.form.email);
      this.user.append("password", this.form.password);
      var url = this.$api + "/user/tambah";
      this.load = true;
      this.$http
        .post(url, this.user, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          (this.load = false), this.close();
          this.readData();
          this.resetForm();
        })
        .catch((error) => {
          console.log(error);
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    update() {
      let newData = {
        nama: this.form.nama,
        no_telepon: this.form.no_telepon,
        role: this.form.role,
        jabatan: this.form.jabatan,
        email: this.form.email,
        password: this.form.password,
      };
      var url = this.$api + "/user/update/" + this.editId;
      this.load = true;
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData();
          this.form;
          this.inputType = "Tambah";
        })
        .catch((error) => {
          console.log(error);
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    deleteData() {
      var url = this.$api + "/user/hapus/" + this.deleteId;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData();
          this.form;
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    editHandler(item) {
      this.inputType = "Detail";
      this.editId = item.id;
      this.form.nama = item.nama;
      this.form.no_telepon = item.no_telepon;
      this.form.role = item.role;
      this.form.jabatan = item.jabatan;
      this.form.email = item.email;
      this.form.password = item.password;
      this.dialogedit = true;
    },
    deleteHandler(item) {
      this.deleteId = item.id;
      this.dialogDelete = true;
    },
    close() {
      this.dialog = false;
      this.dialogedit = false;
      this.dialogDelete = false;
      (this.inputType = "Tambah"), (this.form = {});
    },
    cancel() {
      this.dialog = false;
      this.dialogedit = false;
      this.dialogDelete = false;
      this.form = {
        nama: null,
        no_telepon: null,
        role: null,
        jabatan: null,
        email: null,
        password: null,
      };
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
  },
};
</script>

<style>
</style>