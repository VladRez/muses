class Api::AnswersController < ApplicationController

    def index
        question_id = params[:question_id]
        question = Question.find_by(id: question_id)
        @answers = question.answers
        render :index
    end

    def create
        @answer = Answer.new(answer_params)
        @answer[:question_id] = params[:question_id]
        
        if @answer.save
            render :show
        else
            render json: @answer.errors.full_messages, status: 401
        end
    end

    def show
        #todo write this
        # question_id = params[:question_id]
        # question = Question.find_by(id: question_id)
        # @answer = question.answers.find_by(id: params[:id])
    end

    def destroy
    
    end

    private

    def answer_params
        params.permit(:answer).require(:answer_body, :question_author_id)
    end


end
