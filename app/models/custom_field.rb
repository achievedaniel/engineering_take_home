class CustomField < ApplicationRecord
  belongs_to :client
  has_many :custom_field_buildings
  enum custom_type: { number: 0, text: 1, enum: 2 },  _suffix: true

  validate :is_field_enum?

  def is_field_enum?
    is_enum_in_array?
    if custom_type == "enum" && options.blank?
      errors.add(:options, "can't be empty")
    elsif custom_type != "enum" && !options.blank?
      errors.add(:options, "can only be set with enum type")
    end
  end

  def is_enum_in_array?
    unless options.kind_of?(Array)
      errors.add(:options, "must be passed inside an array")
    end
  end
end
