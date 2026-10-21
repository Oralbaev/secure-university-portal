const passport = require('passport')
const ROLES = require('../../modules/users/helpers/roles')

const requireAdmin = [
  passport.authenticate('user-jwt', { session: false }),
  (req, res, next) => {
    if (!req.user || req.user.isDeleted) {
      return res.status(401).send('Unauthorized request')
    } else if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).send('Forbidden request')
    }
    return next()
  }
]

module.exports = requireAdmin
