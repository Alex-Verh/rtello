require 'rails_helper'

RSpec.describe "Templates", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/template/index"
      expect(response).to have_http_status(:success)
    end
  end
end
