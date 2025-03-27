// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import { Application } from "@hotwired/stimulus";
import "../assets/stylesheets/application.scss";

// Initialize the Stimulus application
const application = Application.start();

// Set debugging options if needed
application.debug = false;

// Export the application instance so it can be used elsewhere
window.Stimulus = application;
export default application;
