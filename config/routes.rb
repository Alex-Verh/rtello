Rails.application.routes.draw do
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
  devise_for :users, controllers: {
    omniauth_callbacks: "users/omniauth_callbacks"
  }
  root "home#index"
  get "home/templates", to: "home#templates"
  get "dashboard/:id", to: "dashboard#index", as: :dashboard
  get "template/:id", to: "template#index", as: :template

  # API
  namespace :api do
    # TASKS
    resources :tasks, only: [ :create, :update, :destroy ] do
      collection do
        post :reorder # reorder the lists
      end
      # specify id in the path query
      member do
        patch :update_state # update complete <-> incomplete
      end
    end

    # LISTS
    resources :lists, only: [ :create, :update, :destroy ] do
      collection do
        post :reorder # reorder the tasks or change the list_id they belong to
      end
    end

    # DASHBOARDS
    resources :dashboards, only: [ :create, :update, :destroy ] do
      collection do
        post "template/:template_id", action: :create_from_template # create dashboard from other template
      end
      member do
        post "members", action: :add_member # add member
        delete "members/:member_id", action: :delete_member # delete member
      end
    end

    # TEMPLATES
    resources :templates, only: [  :create, :update, :destroy ] do
      collection do
        get "search"
      end
    end
  end
end
