class ClientsController < ApplicationController
  before_action :set_client, only: %i[ show ]
  def new
    @client = Client.new
  end

  def show
  end

  private

  def set_client
    @client = Client.find(params[:id])
  end
end
