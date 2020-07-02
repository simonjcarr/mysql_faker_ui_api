'use strict'
const User = use('App/Models/User')

class UserController {

  async register({ request, response, auth }) {
    let user = new User()
    user.username = request.input('username')
    user.email = request.input('email')
    user.password = request.input('password')
    await user.save()
    if(user) {
      var token = await auth.attempt(request.input('email'), request.input('password'))
    }else{
      return response.status(400).send("Unable to register a new account.")
    }
    return response.json(token)
  }

  async login({ request, response, auth }) {
    var token = await auth.attempt(request.input('email'), request.input('password'))
    var user = await User.query().where('email', request.input('email')).first()
    return response.json({ user, token})
  }
}

module.exports = UserController
