# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

client_names = [
  "Evergreen Developments",
  "Summit Real Estate Group",
  "Urban Vista Properties",
  "Pioneer Building Solutions",
  "Harborfront Construction Co."
]
custom_values = [ '2.5', 'Blue' ]

client_names.each do |client_name|
  client = Client.create!(name: client_name)
  puts client
  CustomField.create!(client: client, name: 'Number of bathrooms', custom_type: :number)
  CustomField.create!(client: client, name: 'Living room color', custom_type: :text)
  CustomField.create!(client: client, name: 'Type of walkway', options: [ "bad", "good", "worse" ], custom_type: :enum)

  3.times do |i|
    building = Building.create!(
      client: client,
      address: "#{i+1} Main St",
      state: 'NY',
      zip: '10001'
    )
      client.custom_fields.each do |field|
        if field.custom_type == "number"
          value = '2.5'
          field_type = 'integer'
        elsif field.custom_type == "text"
          value = 'blue'
          field_type = "text"
        elsif field.custom_type == "enum"
          value = field.options.sample
          field_type = "array"
        end
          CustomFieldBuilding.create!(building: building, custom_field: field, value: value, value_type: field_type)
      end
  end
end

puts "Database successfully seeded!"
