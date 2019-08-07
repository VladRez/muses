class AddTopicsToQuestion < ActiveRecord::Migration[5.2]
  def change
    add_column :questions, :topics, :string, array: true, default: []
  end
end
