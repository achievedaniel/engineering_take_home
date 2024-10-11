class BuildingsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_building, only: %i[ show edit update destroy ]

  # GET /buildings or /buildings.json
  def index
    buildings = Building.all

    render json: {
      status: "success",
      buildings: buildings
    }
  end

  # GET /buildings/1 or /buildings/1.json
  def show
    building = Building.find(params[:id])
    render json: { status: :ok, building: building }
  end

  # POST /buildings or /buildings.json
  def create
    puts params
    client = Client.find(params[:client_id])
    building = client.buildings.new(building_params)
    if params.include?(:custom_field)
        custom_field_params[:custom_fields].each do |id, value|
          puts "+++++++++++++++++++"
          custom_field = client.custom_fields.find(id)
          building.custom_field_building.new(custom_field: custom_field, value: value, value_type: custom_field_params[:custom_types][id])
        end
    end

    if building.save
      render json: { status: "success",\
                    building: building, \
                    custom_fields: building.custom_field_building.each do |fields|
                      fields
                    end
                    }
    else
      render json: { status: "error", message: building.errors.full_messages  }
    end
  end

  # PATCH/PUT /buildings/1 or /buildings/1.json
  def update
    building = Building.find(params[:id])
    if params.include?(:custom_field_building)
      custom_field_params[:custom_field_buildings_ids].each_with_index do |id, idx|
        custom_field = building.custom_field_building.find(id)
        custom_field.update(value: custom_field_buildings_params[:custom_value][idx], value_type: custom_field.custom_type)
      end
    end
    if building.update(building_params)
      render json: { status: :ok, building: building }
    else
      render json: { status: "error", message: building.errors.full_messages  }
    end
  end

  # DELETE /buildings/1 or /buildings/1.json
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
      params.require(:custom_field_buildings).permit(custom_value: [], custom_field_building_ids: [])
    end
end
