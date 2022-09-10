<template>
  <v-data-table
    :loading="loadingTable"
    :headers="headers"
    :items="courses"
    :search="search"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Students</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          class="mb-2"
          v-on:click="createItem()"
        >
          New Teacher
        </v-btn>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <!--            <v-btn-->
            <!--              color="primary"-->
            <!--              dark-->
            <!--              class="mb-2"-->
            <!--              v-bind="attrs"-->
            <!--              v-on="on"-->
            <!--            >-->
            <!--              New Student-->
            <!--            </v-btn>-->
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.semester"
                      label="Semester"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.course_code"
                      label="Course code"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.course_title"
                      label="Course title"
                    ></v-text-field>
                  </v-col>

                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                :loading="loading"
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>


<script>
export default {
  name: "teachersList",
  data: () => ({
    loading: false,
    loadingTable: false,
    search: '',
    dialog: false,
    create: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Semester',
        align: 'start',
        sortable: false,
        value: 'semester',
      },
      {text: 'Course code', value: 'course_code'},
      {text: 'Course title', value: 'course_title'},
      {text: 'Actions', value: 'actions', sortable: false},
    ],
    courses: [],
    editedIndex: -1,
    editedItem: {
      department_id: '',
      semester: '',
      course_code: '',
      course_title: ''
    },
    defaultItem: {
      department_id: '',
      semester: '',
      course_code: '',
      course_title: ''
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.fetchStudentData()
    this.editedItem.department_id = this.$route.params.department_id
  },

  methods: {
    async fetchStudentData() {
      this.loadingTable = true
      this.courses = await this.$axios.$get('api/course/all/'+this.$route.params.department_id)
      this.loadingTable = false
    },
    editItem(item) {
      this.editedIndex = this.courses.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      this.create = false
    },

    createItem() {
      this.dialog = true
      this.create = true
    },

    deleteItem(item) {
      this.editedIndex = this.courses.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.courses.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      this.loading = true
      let url;
      if (this.create === true){
         url = 'api/student/create'
      }else{
         url = 'api/student/update'
      }
      await this.$axios.$post(url, this.editedItem)
        .then(function (response) {
          console.log(response)
        })
      await this.fetchStudentData()
      this.close()
      this.loading = false
    },
  },
}
</script>

<style scoped>

</style>
