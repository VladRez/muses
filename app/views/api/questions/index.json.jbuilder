@questions.each do |qst|
    json.set! qst.id do
        json.extract! qst, :id, :question, :question_author_id
        # json.answers qst.answers.map {|qa| qa.id}
        # json.topic []
        # json.tags []
    end
end