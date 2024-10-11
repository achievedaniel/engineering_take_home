class CustomFieldBuildingsController < ApplicationController
  def index
    puts params[:building_id]
    # client = Client.find(params[:client_id])
    building = Building.find(params[:building_id])
    custom_field_buildings = building.custom_field_building.all
    render json: {
      status: "success",
      custom_fields: custom_field_buildings
    }
  end
end
