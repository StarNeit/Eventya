// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
// import "stylesheets/application"
import { Turbo } from "@hotwired/turbo-rails"
import { Application } from "stimulus"
import { definitionsFromContext } from "stimulus/webpack-helpers"

const application = Application.start()
const context = require.context("controllers", true, /\.js$/)
application.load(definitionsFromContext(context))

import "channels"
import "controllers"
// import * as bootstrap from "bootstrap"