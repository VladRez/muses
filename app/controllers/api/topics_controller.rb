class Api::TopicsController < ApplicationController

    def index
        @topics = Topic.all
    end

    def create
    end

    private

    def topic_params
    end
end
