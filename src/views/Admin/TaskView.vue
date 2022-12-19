<template>
  <v-container>
    <v-btn @click="$router.back()"
      ><v-icon>mdi-arrow-left-thick</v-icon>Back</v-btn
    >
    <v-card class="justify-center">
      <v-card>
        <v-card-title class="justify-center">
          <h2>Task View</h2>
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
        </v-card-title>
        <v-data-table :headers="headers" :items="tasks" :search="search">
          <template v-slot:[`item.actions`]="{ item }">
            <v-row>
              <div>
                <v-btn
                  small
                  color="primary"
                  class="mr-2"
                  @click="editHandler(item)"
                >
                  Detail
                </v-btn>
              </div>
              <v-btn small color="success" :disabled="item.status === 'Belum dikerjakan'" @click="konfirmasiHandler(item)">
                  Konfirmasi
                </v-btn>
            </v-row>
          </template>
        </v-data-table>
      </v-card>
      <v-dialog v-model="dialogedit" max-width="500px">
        <v-card>
          <v-card-title>
            <span>Detail Tugas</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <div class="mx-1 flex flex-col">
                  <strong>Nama Tugas</strong>

                  <p>{{ this.form.nama_tugas }}</p>
                </div>
              </v-row>
              
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="cancel">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-container>
            <v-card-title>
              <span>Konfirmasi Tugas</span>
            </v-card-title>
            <v-card-text>
              <p>Konfirmasi Tugas?</p>
            </v-card-text>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="cancel">Cancel</v-btn>
            <v-btn color="primary" text @click="konfirmasi">Confirm</v-btn>
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
  name: "TaskManagement",
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
      headers: [
        {
          text: "Nama Tugas",
          align: "start",
          sortable: true,
          value: "nama_tugas",
        },
        {
          text: "Nama User",
          value: "nama",
        },
        {
          text: "Jabatan",
          value: "jabatan",
        },
        {
          text: "Status",
          value: "status",
        },
        {
          text: "",
          value: "actions",
        },
      ],
      task: new FormData(),
      tasks: [],
      form: {
        nama_tugas: null,
        status: "Baru",
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
      var url = this.$api + "/tugas/tugas";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.tasks = response.data.data;
        });
    },
    save() {
      var id_user = this.$route.query.id_user;
      this.task.append("id_user", id_user);
      this.task.append("nama_tugas", this.form.nama_tugas);
      this.task.append("status", "Belum dikerjakan");

      var url = this.$api + "/tugas/tambah";
      this.load = true;
      this.$http
        .post(url, this.task, {
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
          this.resetForm;
        })
        .catch((error) => {
          console.log(error);
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
          this.tasks = [];
        });
    },
    update() {
      let newData = {
        nama_tugas: this.form.nama_tugas,
        status: this.form.status,
      };
      var url = this.$api + "/tugas/update/" + this.editId;
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
          this.resetForm;
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
    konfirmasi() {
      var url = this.$api + "/tugas/konfirmasi/" + this.deleteId;
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
          this.resetForm();
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
      this.form.nama_tugas = item.nama_tugas;
      this.form.status = item.status;
      this.dialogedit = true;
    },
    konfirmasiHandler(item) {
      this.deleteId = item.id;
      this.dialogDelete = true;
    },
    close() {
      this.dialog = false;
      this.dialogedit = false;
      this.dialogDelete = false;
      this.inputType = "Tambah";
      this.form = {};
    },
    cancel() {
      this.dialog = false;
      this.dialogedit = false;
      this.dialogDelete = false;
      this.resetForm = {
        nama_tugas: null,
        status: "Baru",
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