json.status "success"
json.message "All buildings loaded loaded successfully"
json.buildings @buildings do |building|
  json.partial! partial: "buildings/building", building: building
end
