json.extract! client, :id, :name
client.custom_fields.each do |custom_field|
  json.set! custom_field.name, custom_field.custom_type
end
