import application from "../application"; // Import the application instance

// Import the controllers manually
import ApplicationController from "./application_controller";
import DashboardController from "./dashboard_controller";
import HomeController from "./home_controller";

// Register each controller with Stimulus
application.register("application", ApplicationController);
application.register("dashboard", DashboardController);
application.register("home", HomeController);
