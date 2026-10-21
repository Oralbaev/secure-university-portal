const passport = require('passport')

const requireUser = [
  passport.authenticate('user-jwt', { session: false }),
  (req, res, next) => {
    if (!req.user || req.user.isDeleted) {
      return res.status(401).send('Unauthorized request')
    }
    return next()
  }
]

module.exports = requireUser
