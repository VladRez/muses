class Api::QuestionsController < ApplicationController

    def index
        
        case params[:field]
            when nil
                @questions = Question.all
            when 'topic'
                str_search = Topic.all.select {|topic| topic.name.downcase.match?(params[:value])}.map {|topic| topic.id.to_s}
                if str_search.empty?
                    @questions = Question.all.select {|question| question.topics.include?(params[:value])}
                else
                    @questions = Question.all.select  do |question|
                        merged = str_search.concat(question.topics)
                        merged.any? {|topic| merged.count(topic) > 1}
                    end
                end
            when 'user'
                users = User.all.select {|user| user.first_name.include?(params[:value]) || user.last_name.include?(params[:value])}
                @questions = users.map {|user| user.questions}.flatten
            when 'question'
                @questions = Question.all.select {|question| question.question.include?(params[:value])}       
        end
            render :index
    end

    def create

        @question = Question.new(question_params)
     
        if @question.save
            @answers  = @question.answers
            @comments = @answers.map {|ans| ans.comments}.flatten
                question_user =  [@question.author]
                answers_users =  @answers.map {|ans| ans.answer_author}.flatten
                comments_users = @comments.map {|cmt| cmt.comment_author}.flatten
            @users    =  question_user + answers_users + comments_users
            @topics = Topic.all
            render :show
        else
            
            render json: @question.errors.full_messages, status: 422
        end
    end

    def show
        @question = Question.find_by(id: params[:id])
        @answers  = @question.answers
        @comments = @answers.map {|ans| ans.comments}.flatten
            question_user =  [@question.author]
            answers_users =  @answers.map {|ans| ans.answer_author}.flatten
            comments_users = @comments.map {|cmt| cmt.comment_author}.flatten
        @users    =  question_user + answers_users + comments_users
        @topics = Topic.all
    end

    def update
        
        @question = Question.find_by(id: params[:id])
        if @question.update(question_params)
            @answers  = @question.answers
            @comments = @answers.map {|ans| ans.comments}.flatten
                question_user =  [@question.author]
                answers_users =  @answers.map {|ans| ans.answer_author}.flatten
                comments_users = @comments.map {|cmt| cmt.comment_author}.flatten
            @users    =  question_user + answers_users + comments_users
            @topics = Topic.all
            render :show
        else
            render json: @question.errors.full_messages, status: 401
        end

    end

    def destroy
        Question.find_by(id: params[:id]).destroy
    end

    def question_params
        params.require(:question).permit(:question, :question_author_id, :topics => [])
    end

end
