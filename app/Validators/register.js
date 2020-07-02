'use strict'

class register {

  get validateAll() {
    return true;
  }

  get rules () {
    return {
      'username': 'required|unique:users',
      'email': 'required|email|unique:users',
      'password': 'required|min:8',
      'confirm_password': 'required|same:password'
    }
  }

  get messages() {
    return {
      'username.required': 'You must provide a username',
      'username.unique': 'That username is already taken',
      'email.required': 'You must provide a valid email address',
      'email.email': 'You must provide a valid email address',
      'email.unique': 'That email has already been taken',
      'password.required': 'You must choose password at least 8 characters long',
      'password.min': 'You must choose password at least 8 characters long',
      'confirm_password.required': 'You must confirm your password',
      'confirm_password.same': 'The passwords do not match'
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json(errorMessages)
  }
}

module.exports = register
