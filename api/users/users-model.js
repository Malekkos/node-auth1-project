const db = require("../../data/db-config")


/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
async function find() {
  const data = await db("users")
  .select("user_id", "username")
  return data
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  const data = db("users")
  .where(filter)
  .first()

  return data
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
async function findById(user_id) {
  const data = await db("users")
  .where(user_id)
  .first()

  return data
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  await db("users")
  .insert(user)
  const newUser = await findById(user)
  return newUser
}

// Don't forget to add these to the `exports` object so they can be required in other modules


module.exports = { find, findBy, findById, add }