class BuildingsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [ :update ]
  before_action :set_building, only: %i[ show update destroy ]


  def new
    render partial: "form"
  end

  def index
    if params.include?("client_id")
      @client = Client.find(params[:client_id])
      @buildings = @client.buildings
    else
      @buildings = Building.all
    end
  end


  def show
  end

  def create
    client = Client.find(1)
    building = client.buildings.new(building_params)
    if params.include?(:custom_field)
        custom_field_params[:custom_fields].each do |id, value|
          custom_field = client.custom_fields.find(id)
          building.custom_field_building.new(custom_field: custom_field, value: value, value_type: custom_field_params[:custom_types][id])
        end
    end

    if building.save
      render json: { status: "success" }
    else
      render json: { status: "error", message: building.errors.full_messages  }
    end
  end

  def update
    building = Building.find(params[:id])
    building.custom_field_building.each do |custom|
      custom_id = custom.custom_field_id
      custom_name = CustomField.find(custom_id).name
      params[:building].delete(custom_name)
    end
    params[:building].delete(:client)
    params[:building].delete(:id)

    if params.include?(:custom_field)
      custom_params = params[:custom_field][:custom_fields]
      custom_field = building.custom_field_building.each do |field|
        puts field.value
        puts field.custom_field_id
        puts custom_params[field.custom_field_id.to_s]
        field.value = custom_params[field.custom_field_id.to_s]
        field.save
      end
    end
    if building.update(building_params)
      render json: { status: :ok, building: building }
    else
      render json: { status: "error", message: building.errors.full_messages  }
    end
  end

  def destroy
    building = Building.find(params[:id])
    if building.destroy
      render json: { status: :ok, building: building }
    else
      render json: { status: "error", message: building.errors.full_messages  }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_building
      @building = Building.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def building_params
      params.require(:building).permit(:address, :state, :zip, :client_id)
    end

    def custom_field_params
      params.require(:custom_field).permit(custom_fields: {}, custom_types: {})
    end

    def custom_field_buildings_params
      params.require(:custom_field_buildings).permit!
    end
end
