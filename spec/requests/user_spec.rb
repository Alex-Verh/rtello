require 'swagger_helper'

RSpec.describe 'Users API', type: :request do
  path '/users' do
    get 'Retrieves all users' do
      tags 'Users'
      produces 'application/json'

      response '200', 'users found' do
        run_test!
      end
    end
  end
end
