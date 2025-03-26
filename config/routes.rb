Rails.application.routes.draw do
  mount Rswag::Ui::Engine => "/api-docs"
  mount Rswag::Api::Engine => "/api-docs"
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
      member do
        post "template/:template_id", action: :create_from_template # create dashboard from other template
        delete "members/:member_id", action: :delete_member # delete member
      end
    end

    # TEMPLATES
    resources :templates, only: [  :create, :update, :destroy ] do
      collection do
        get "search"
      end
    end

    # written manually :(
    #
    # # getting single
    # get "tasks/:id", to: "tasks#get"
    # get "lists/:id", to: "lists#get"
    # get "dashboards/:id", to: "dashboards#get"
    # get "templates/:id", to: "templates#get"
    # get "templates/search", to: "templates#search" # get templates from search query

    # # changing info
    # patch "tasks/:id", to: "tasks#change"
    # patch "lists/:id", to: "lists#change"
    # patch "dashboards/:id", to: "dashboards#change"
    # patch "templates/:id", to: "templates#change"

    # # deleting
    # delete "tasks/:id", to: "tasks#delete"
    # delete "lists/:id", to: "lists#delete"
    # delete "dashboards/:id", to: "dashboards#delete"
    # delete "templates/:id", to: "templates#delete"
    # delete "dashboards/:id/members/:member_id", to: "dashboards#deleteMember" # delete a member of the dashboard (if the user deletes himself, or if the creator deletes the member)

    # # creating
    # post "tasks", to: "tasks#post"
    # post "lists", to: "lists#post"
    # post "dashboards", to: "dashboards#post"
    # post "templates", to: "templates#post"

    # # reordering lists/tasks
    # post "tasks/reorder", to: "tasks#reorder"
    # post "lists/reorder", to: "lists#reorder"
  end
end
