json.extract! building, :id
json.client(building.client.name)
json.client_id(building.client.id)
json.extract! building, :address, :state, :zip
building.custom_field_building.each do |custom_field_building|
  json.set! custom_field_building.custom_field.name, custom_field_building.value
end
