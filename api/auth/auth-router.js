// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!

const express = require("express")
const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require("./auth-middleware")
const Users = require("../users/users-model")
const router = express.Router()
const bcrypt = require("bcryptjs")


router.post("/register", checkUsernameFree, checkPasswordLength, (req, res, next) => {
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 10)

  Users.add({"username": username, "password": hash})
  .then(id => {
    Users.findById(id)
    .then(newUser => {
      res.status(200).json({"user_id": newUser.user_id, "username": newUser.username})
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

  router.post("/login", checkUsernameExists, async (req, res, next) => {
    const { password } = req.body
  
    if (bcrypt.compareSync(password, req.user.password)) {
      req.session.user = req.user
      res.json({ message: `Welcome ${req.user.username}!`})
    } else {
      next({ status: 401, message: "Invalid credentials"})
    }
  })
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