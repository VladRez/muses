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
