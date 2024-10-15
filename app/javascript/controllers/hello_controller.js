import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="hello"
export default class extends Controller {
  greet() {
    console.log("HELLO---");
  }
}
