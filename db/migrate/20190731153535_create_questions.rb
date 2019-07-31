class CreateQuestions < ActiveRecord::Migration[5.2]
  def change
    create_table :questions do |t|
      t.string  :question, null: false
      t.integer :question_author_id, null: false

      t.timestamps
    end

    add_index :questions, :question, unique: true
  end
end
