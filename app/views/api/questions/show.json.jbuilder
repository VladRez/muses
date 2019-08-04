json.question do
    json.extract! @question, :id, :question, :question_author_id
end

json.answers do
    @answers.each do |ans|
        json.set! ans.id do
            json.extract! ans, :id, :answer_body, :answer_author_id
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

