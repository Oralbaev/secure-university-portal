const passport = require('passport')

/**
 * Restricts a route to the given roles.
 *
 * @param {...string} roles roles that are allowed to access the route
 */
const requireRole = (...roles) => [
  passport.authenticate('user-jwt', { session: false }),
  (req, res, next) => {
    if (!req.user || req.user.isDeleted) {
      return res.status(401).send('Unauthorized request')
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Forbidden request')
    }

    return next()
  }
]

module.exports = requireRole
