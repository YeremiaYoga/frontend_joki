<template>
    <v-container>
      <v-btn @click="$router.back()"
        ><v-icon>mdi-arrow-left-thick</v-icon>Back</v-btn
      >
      <v-card class="justify-center">
        <v-card>
          <v-card-title class="justify-center">
            <h2>Tugas</h2>
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
                <v-btn small color="success" :disabled="item.status === 'Selesai'" @click="selesaiHandler(item)">
                  Selesai
                </v-btn>
              </v-row>
            </template>
          </v-data-table>
        </v-card>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-container>
              <v-card-title>
                <span> Tugas selesai</span>
              </v-card-title>
              <v-card-text>
                <p>yakin untuk konfirmasi</p>
              </v-card-text>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="cancel">Cancel</v-btn>
              <v-btn color="primary" text @click="selesai">konfirmasi</v-btn>
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
        var id = localStorage.getItem("id")
        console.log(id);
        console.log(this.$route.params);
        var url = this.$api + "/tugas/tampiltugas/" + id;
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
      selesai() {
        var url = this.$api + "/tugas/selesai/" + this.deleteId;
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
      selesaiHandler(item) {
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