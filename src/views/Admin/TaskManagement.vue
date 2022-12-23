<template>
  <v-container>
    <v-btn @click="$router.back()"
      ><v-icon>mdi-arrow-left-thick</v-icon>Back</v-btn
    >
    <v-card class="justify-center">
      <v-card>
        <v-card-title class="justify-center">
          <h2>Task Management</h2>
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
            Tambah Tugas
          </v-btn>
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
              <v-btn small color="error" @click="deleteHandler(item)">
                Delete
              </v-btn>
            </v-row>
          </template>
        </v-data-table>
      </v-card>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span>Tambah Tugas</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <div class="mx-1"></div>
                <v-text-field
                  v-model="form.nama_tugas"
                  label="Nama Tugas"
                  required
                >
                </v-text-field>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="cancel">Cancel</v-btn>
            <v-btn color="primary" text @click="setForm" :disabled="!form.nama_tugas">Tambah</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogedit" max-width="500px">
        <v-card>
          <v-card-title>
            <span>Update Tugas</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <div class="mx-1"></div>
                <v-text-field
                  v-model="form.nama_tugas"
                  label="Nama Tugas"
                  required
                >
                </v-text-field>
              </v-row>
              <v-row>
                <div class="mx-1"></div>
                <v-text-field v-model="form.status" label="Status" disabled>
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
              <span>Hapus Tugas</span>
            </v-card-title>
            <v-card-text>
              <p>Yakin ingin menghapus tugas ini?</p>
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
          text: "Tanggal",
          align: "start",
          sortable: true,
          value: "created_at",
        },
        {
          text: "Nama Tugas",

          value: "nama_tugas",
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
      var id_user = this.$route.query.id_user;
      console.log(this.$route.params);
      var url = this.$api + "/tugas/tampiltugas/" + id_user;
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
    deleteData() {
      var url = this.$api + "/tugas/hapus/" + this.deleteId;
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
    deleteHandler(item) {
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