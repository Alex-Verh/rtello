import { Controller } from "@hotwired/stimulus";

export default class HelloController extends Controller {
  static targets = ["name"];

  connect() {
    console.log("Hello controller connected");
  }
}
