class Api::QuestionsController < ApplicationController

    def index
        @questions = Question.all
        render :index
    end

    def create
        @question = Question.new(question_params)
        if @question.save
            render :show
        else
            render json: [@question.errors.full_messanges], status: 401
        end
    end

    def show
        @question = Question.find_by(id: params[:id])
    end

    def destroy
        Question.find_by(id: params[:id]).destroy
    end

    def question_params
        params.require(:question).permit(:question, :question_author_id)
    end

end
