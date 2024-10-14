class Building < ApplicationRecord
  belongs_to :client
  has_many :custom_field_building

  validates :address, presence: true
  validates :state, presence: true
  validates :zip, presence: true
end
