class Answer < ApplicationRecord
    validates :answer_body, :question_id, presence: true

    belongs_to :question,
    foreign_key: :question_id,
            class_name: 'Question'

    belongs_to :answer_author,
    foreign_key: :answer_author_id,
            class_name: 'User'

end
