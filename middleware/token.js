export default async function ({$auth}) {
  console.log('middleare working')
  let token = $auth.$storage.getLocalStorage('api_token')
  console.log('middleare token  ' + token)
  //   if (token == null){
  //
  //     context.redirect('/login')
  //   }
}
