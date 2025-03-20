import { Application } from "@hotwired/stimulus"
import { application } from "./application"

// Manually load all controllers from the "controllers" directory
const controllers = require.context("../controllers", true, /_controller\.ts$/)
controllers.keys().forEach((key) => {
  const controllerModule = controllers(key)
  const controllerName = key
    .replace(/^\.\//, "") // Remove leading "./"
    .replace(/_controller\.ts$/, "") // Remove "_controller.ts" suffix
    .replace(/\//g, "--") // Replace slashes with double dashes
  application.register(controllerName, controllerModule.default)
})