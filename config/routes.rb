Rails.application.routes.draw do
  resources :chatrooms
  resources :messages
  devise_for :users

  devise_scope :user do
    get '/users/sign_out' => 'devise/sessions#destroy'
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
    
  root to: "chatrooms#index"

  resources :chatrooms, only: [:index, :show, :new, :create] do
    resources :messages, only: [:create], defaults: { format: :json }
  end

end
