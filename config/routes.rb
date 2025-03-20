Rails.application.routes.draw do
  root "home#index"
  get "dashboard", to: "dashboard#index"
end
