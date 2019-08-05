class Api::AnswersController < ApplicationController

    def index
        question_id = params[:question_id]
        @question = Question.find_by(id: question_id)
        @answers = @question.answers
        # render :index
        render 'api/questions/show'
    end

    def create
        
        @answer = Answer.new(answer_params)
        @answer[:question_id] = params[:question_id]
        
        if @answer.save
            @question = Question.find_by(id: params[:question_id])
            @answers  = @question.answers
            @comments = @answers.map {|ans| ans.comments}.flatten
                question_user =  [@question.author]
                answers_users =  @answers.map {|ans| ans.answer_author}.flatten
                comments_users = @comments.map {|cmt| cmt.comment_author}.flatten
            @users    =  question_user + answers_users + comments_users
            render 'api/questions/show'
           
        else
            render json: @answer.errors.full_messages, status: 401
        end
    end

    def show
        question = Question.find_by(id: params[:question_id])
        
        if question.answers.find_by(id: params[:id])
            @answer = question.answers.find_by(id: params[:id])
            render :show
        else
            render json: ['bad question or answer id']
        end
            
    end

    def destroy
    
    end

    private

    def answer_params
        
        params.require(:answer).permit(:answer_body, :answer_author_id)
    end


end
