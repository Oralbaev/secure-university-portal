const passportJWT = require('passport-jwt')

const config = require('./index')
const { Users } = require('../models')

const { Strategy: JWTStrategy, ExtractJwt } = passportJWT

module.exports = (passport) => {
  passport.use(
    'user-jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.SECRET_KEY
      },
      (jwtPayload, cb) =>
        Users.findById(jwtPayload.id)
          .then((user) => {
            // tokenVersion is bumped on logout, which revokes older tokens
            if (
              user &&
              !user.isDeleted &&
              jwtPayload.tokenVersion === user.tokenVersion
            ) {
              return cb(null, user)
            }

            return cb(null, null)
          })
          .catch((err) => cb(err, false))
    )
  )
}
