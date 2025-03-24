Rails.application.routes.draw do
  mount Rswag::Ui::Engine => "/api-docs"
  mount Rswag::Api::Engine => "/api-docs"
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
  devise_for :users, controllers: {
    omniauth_callbacks: "users/omniauth_callbacks"
  }
  root "home#index"
  get "home/templates", to: "home#templates"
  get "dashboard", to: "dashboard#index"
  get "template", to: "template#index"
end
