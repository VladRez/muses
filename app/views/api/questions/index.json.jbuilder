@questions.each do |qst|
    json.set! qst.id do
        json.extract! qst, :id, :question, :question_author_id
        # json.answers qst.answers.map {|qa| qa.id}
        # json.topic []
        # json.tags []
        json.question_author_first_name qst.author.first_name
        json.question_author_last_name qst.author.last_name
        json.question_time_stamp qst.created_at.to_formatted_s(:iso8601)
    end
end