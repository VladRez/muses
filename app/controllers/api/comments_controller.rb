class Api::CommentsController < ApplicationController

    def create
        
        @comment = Comment.new(comment_params)
        @comment.answer_id = params[:answer_id]
        
        if @comment.save
            @question = Question.find_by(id: params[:question_id])
            @answers  = @question.answers
            @comments = @answers.map {|ans| ans.comments}.flatten
                question_user =  [@question.author]
                answers_users =  @answers.map {|ans| ans.answer_author}.flatten
                comments_users = @comments.map {|cmt| cmt.comment_author}.flatten
            @users    =  question_user + answers_users + comments_users
            @topics = Topic.all

            render 'api/questions/show'

        else
            render json: [@comment.errors.full_messages]
        end
    end

    def destroy
    
    end

    private

    def comment_params 
        params.require(:comment).permit(:comment_body, :comment_author_id)
    end

end
