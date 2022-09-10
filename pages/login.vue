<template>
  <div class="row justify-center align-content-center">

    <div style="width: 500px">
      <h1>Login</h1>
      <v-card
        elevation="2"
      >
        <v-form
          ref="form"
          lazy-validation
        >


          <v-text-field
            v-model="email"
            label="E-mail"
            outlined
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            outlined
            required
          ></v-text-field>


          <v-btn
            color="success"
            class="mr-4"
            v-on:click="userLogin"
          >
            Login
          </v-btn>

        </v-form>
      </v-card>

    </div>
  </div>

</template>

<script>

export default {
  layout: 'auth',
  name: "login",
  data() {
    return {
      email: '',
      password: ''
    }
  },
  created() {
    let token = this.$auth.$storage.getLocalStorage('api_token')
    console.log("token @@  " + token)
  },
  methods: {
    test() {
      this.$router.push({path: '/'});
    },

    async userLogin() {
      try {
        let response = await this.$auth.loginWith('laravelJWT', {
          data: {
            email: this.email,
            password: this.password
          }
        })
        console.log(response)
        this.$auth.$storage.setLocalStorage('api_token', response.data.access_token)
      } catch (err) {
        console.log(err)
      }

    },

    login() {
      let self = this;
      self.$axios.$post('https://pub-backend.dreamitdevlopment.com/public/api/login', {
        email: self.email,
        password: self.password,
      }).then(function (response) {
        console.log(response)
        self.email = '';
        self.password = '';

        this.$auth.$storage.setLocalStorage('api_token', "hello@@@")

        //self.$router.push({ path: '/' });
      })
        .catch(function (error) {
          self.message = 'Incorrect E-mail or password';
          self.showMessage = true;
          console.log(error);
        });

    }
  },
  async asyncData({$axios}) {
    const ip = await $axios.$get('http://icanhazip.com')
    return {ip}
  }
}
</script>

<style scoped>

</style>
