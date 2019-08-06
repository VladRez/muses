Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api, defaults: {format: :json} do
    resource :user, only: [:create]
    resource :session, only: [:create, :destroy, :show]
    resources :topics, only: [:index, :create]
    resources :questions, only: [:create, :destroy, :show, :index] do
      resources :answers,  only: [:create, :destroy, :show, :index] do
        resources :comments, only: [:create, :destroy, :show]
      end
    end
    
  end

  root "static_pages#root"

end
