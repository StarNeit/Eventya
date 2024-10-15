//app/javascript/controllers/application.js
import "stylesheets/application"

// import { Turbo } from "@hotwired/turbo-rails"
// import { Application } from "stimulus"
// import { definitionsFromContext } from "stimulus/webpack-helpers"

// const application = Application.start()
// const context = require.context("controllers", true, /\.js$/)
// application.load(definitionsFromContext(context))

import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

export { application }



//hello_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.element.textContent = "Hello World!"
    console.log("ACTIVE");
    
  }
}



