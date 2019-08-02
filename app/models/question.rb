class Question < ApplicationRecord
    validates :question, :question_author_id, presence: true

    belongs_to :author,
    foreign_key: :question_author_id,
            class_name: 'User'

    has_many :answers,
    foreign_key: :question_id,
        class_name: 'Answer',
                dependent: :destroy

end

