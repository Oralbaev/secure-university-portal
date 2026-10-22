// Keep route modules explicit so request data or filesystem entries can never
// influence which server code is loaded.
const routeModules = [
  require('../modules/products/products.routes'),
  require('../modules/users/users.routes'),
]

module.exports = (app) => {
  routeModules.forEach((routes) => {
    if (routes) {
      app.use(`/api/${routes.name}`, routes.router)
    }
  })
}
