// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!

const express = require("express")
const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require("./auth-middleware")
const Users = require("../users/users-model")
const router = express.Router()
const bcrypt = require("bcryptjs")


router.post("/register", (req, res, next) => {
  const { username, password } = req.body
  console.log("this is the username:", username, "this is the password:", password)

  Users.add({"username": username, "password": password})
  .then(id => {
    console.log("this is the id:", id)
    Users.findById(id)
    .then(newUser => {
      res.json(newUser)
    })
    .catch(error => {
      next(error)
    })
  })
  .catch(error => {
    next(error)
  })
  
})

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

 
// Don't forget to add the router to the `exports` object so it can be required in other modules

module.exports = router