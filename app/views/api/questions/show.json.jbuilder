json.question do
    json.extract! @question, :id, :question, :question_author_id
    json.created_at @question.created_at.to_formatted_s(:iso8601)
end

json.answers do
    @answers.each do |ans|
        json.set! ans.id do
            json.extract! ans, :id, :answer_body, :answer_author_id
            json.created_at ans.created_at.to_formatted_s(:iso8601)
        end
    end
end

json.comments do
    @comments.each do |cmnt|
        json.set! cmnt.id do 
            json.extract! cmnt, :id, :comment_body, :comment_author_id
            json.created_at cmnt.created_at.to_formatted_s(:iso8601)
        end
    end
end

json.users do
    @users.each do |user|
        json.set! user.id do
            json.extract! user, :id, :first_name, :last_name
        end
    end
end



