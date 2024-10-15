# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
pin "@rails/actioncable", to: "actioncable.esm.js", preload: true
pin_all_from "app/javascript/channels", under: "channels"
pin_all_from "app/assets/stylesheets", under: "stylesheets"
pin "choices.js", to: "https://ga.jspm.io/npm:choices.js@10.1.0/public/assets/scripts/choices.js"
