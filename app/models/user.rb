class User < ApplicationRecord

    attr_reader :password

    validates :first_name, :last_name, :password_digest, :session_token, presence: true
    validates :email, uniqueness: true
    validates :password, length: {minimum: 6}, allow_nil: true

    after_initialize :ensure_session_token

    has_many :questions,
        foreign_key: :question_author_id,
            class_name: 'Question',
            dependent: :destroy
            
    has_many :answers,
        foreign_key: :answer_author_id,
            class_name: 'Answer',
            dependent: :destroy

    def self.find_by_credentials(email, password)
        user = User.find_by(email: email)
        user && user.is_password?(password) ? user : nil
    end

    def password=(password)
        @password = password
        self.password_digest = BCrypt::Password.create(password)
    end

    def is_password?(password)
        BCrypt::Password.new(self.password_digest).is_password?(password)
    end

    def reset_session_token!
        self.session_token = new_session_token
        self.save!
        self.session_token
    end

    def ensure_session_token
        self.session_token ||= new_session_token
    end
    private

    def new_session_token
        SecureRandom.urlsafe_base64(16)
    end

end
