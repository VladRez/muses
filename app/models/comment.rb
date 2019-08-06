class Comment < ApplicationRecord
    validates :comment_body, :answer_id, :comment_author_id, presence: true

    belongs_to :answer,
        foreign_key: :answer_id,
            class_name: 'Answer'
    
    belongs_to :comment_author,
        foreign_key: :comment_author_id,
            class_name: 'User'
end
