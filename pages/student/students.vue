<template>
  <v-container fluid>
    <v-data-iterator
      :loading="loading"
      loading-text="Loading... Please wait"
      :items="batches"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar
          dark
          color="blue darken-3"
          class="mb-1"
        >
          <v-select
            v-model="selectedDepartment"
            flat
            solo-inverted
            hide-details
            :items="departments"
            item-text="name"
            v-on:change="fetchAllBatch($event)"
            label="Select Department"
          ></v-select>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
          <v-spacer></v-spacer>

        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card v-on:click="studentsPage(item.id)" class="pa-5">
              <v-card-title class="subheading font-weight-bold">
                {{ item.name }}
              </v-card-title>

              <v-divider></v-divider>

            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row
          class="mt-2"
          align="center"
          justify="center"
        >
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span
            class="mr-4
            grey--text"
          >
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="ml-1"
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
export default {
  name: 'StudentPage',
  data() {
    return {
      itemsPerPageArray: [4, 8, 12],
      search: '',
      filter: {},
      page: 1,
      itemsPerPage: 4,
      selectedDepartment: '',
      departmentId: '',
      departments: [],
      batches: [],
      loading: false
    }

  },
  created() {
    this.fetchAllDepartments()
    this.fetchAllBatch()
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.batches.length / this.itemsPerPage)
    },
    filteredKeys() {
      return this.departments.filter(key => key !== 'Name')
    },
  },
  methods: {
    studentsPage(id) {
      this.$router.push({name: 'student-studentList', params: {batch_id: id}})
      console.log("batch id    " + id)
    },
    async fetchAllBatch($name) {
      this.batches = []
      this.loading = true
      let id;
      if ($name !== undefined){
        let id1 = this.departments.find(function (dep,index){
          return dep.name === $name
        })
        id = id1.id
      }else {
        id = localStorage.getItem("department_id")
      }

      this.batches = await this.$axios.$get('api/batch/all/' + id)
      this.loading = false
      localStorage.setItem("department",this.selectedDepartment)
      localStorage.setItem("department_id",id)
    },

    async fetchAllDepartments() {
      if (this.selectedDepartment === ''){
        this.selectedDepartment = localStorage.getItem("department")
      }
      this.departments = await this.$axios.$get('api/department/all')
    },

    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number
    },
  }
}
</script>
