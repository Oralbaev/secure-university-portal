const fs = require('fs')
const path = require('path')

const modulesDirectory = path.join(__dirname, '../modules')
const moduleFiles = fs.readdirSync(modulesDirectory)

module.exports = (app) => {
  moduleFiles.forEach((file) => {
    const filePath = path.join(modulesDirectory, file, `${file}.routes.js`)
    if (fs.existsSync(filePath)) {
      const routes = require(filePath)
      if (routes) {
        app.use(`/api/${routes.name}`, routes.router)
      }
    }
  })
}
