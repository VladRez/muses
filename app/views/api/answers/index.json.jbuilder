json.array! @answers do |ans|
    json.extract! ans, :id, :answer_body, :question_id, :answer_author_id
end
