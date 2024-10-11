class CustomFieldsController < ApplicationController
  def new
    @client = Client.new
  end

  def index
    client = Client.find(params[:client_id])
    custom_fields = client.custom_fields.all
    render json: {
      status: "success",
      custom_fields: custom_fields
    }
  end
end
