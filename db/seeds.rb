# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
User.destroy_all

dummy_users = [
{first_name: 'Appolonia', last_name: 'Jakubczyk', email: 'ajakubczyk0@tiny.cc', password: 'OgUq8GUitk'},
{first_name: 'Wit', last_name: 'Bradbrook', email: 'wbradbrook1@squidoo.com', password: '02OKuZg7G'},
{first_name: 'Kari', last_name: 'Woolward', email: 'kwoolward2@cnbc.com', password: 'IcLlbImTvZp'},
{first_name: 'Drusie', last_name: 'Chezier', email: 'dchezier3@icq.com', password: '2JVHMNF1'},
{first_name: 'Shirley', last_name: 'Freen', email: 'sfreen4@ask.com', password: 's7MIXHC'},
{first_name: 'Susana', last_name: 'Sheard', email: 'ssheard5@sourceforge.net', password: 'CNBo6MMud'},
{first_name: 'Betteann', last_name: 'Neubigging', email: 'bneubigging6@is.gd', password: 'Jt1IOPiI3WrU'},
{first_name: 'Paige', last_name: 'Furmedge', email: 'pfurmedge7@mayoclinic.com', password: 'GVZgdrgP'},
{first_name: 'Moses', last_name: 'Shallcroff', email: 'mshallcroff8@house.gov', password: 'Bg28QViEe'},
{first_name: 'Bucky', last_name: 'Pedri', email: 'bpedri9@utexas.edu', password: 'C1Q0JK'},
{first_name: 'Mata', last_name: 'Flemmich', email: 'mflemmicha@salon.com', password: 'KABIUfeVJ5m'},
{first_name: 'Inglis', last_name: 'Zannelli', email: 'izannellib@github.com', password: 'tgM7Q71'},
{first_name: 'Gnni', last_name: 'Lyle', email: 'glylec@ning.com', password: 'FVCtKO3ZZf'},
{first_name: 'Claudine', last_name: 'Eye', email: 'ceyed@patch.com', password: '8IfOwVI7'},
{first_name: 'Nydia', last_name: 'Garci', email: 'ngarcie@naver.com', password: 'IEj0wKP'}
]




dummy_users.each {|user| User.create(user)}

dummy_questions = [
{question: 'What one tip changed your writing forever?', question_author_id: User.all[1].id},
{question: 'How do top students study?', question_author_id: User.all[1].id},
{question: 'What is the biggest fear that programmers and data scientists have?', question_author_id: User.all[2].id},
{question: 'How do data scientists use statistics?', question_author_id: User.all[3].id},
{question: 'Why do economists look at descriptive statistics and plot data before running regressions?', question_author_id: User.all[3].id},
{question: 'What is your side hustle and how do you do it?', question_author_id: User.all[4].id},
{question: 'What are the things that no one tells you about beginning a startup?', question_author_id: User.all[4].id},
{question: 'What are the most interesting facts about human behavior?', question_author_id: User.all[5].id},
{question: 'Is there one secret about luxury cars that people should know?', question_author_id: User.all[6].id}
]
dummy_questions.each {|question| Question.create(question)}

dummy_answers = [
    {answer_body: 'Don’t use dialogue tags. Seriously, try writing a fictional story with 2 or more characters and zero dialogue tags.', 
        question_id: Question.all.first.id, answer_author_id: User.all.last.id},
        {answer_body: 'A fellow author told me this trick, and it improved my writing more than any other single piece of advice. When you stop using dialogue tags, not only does it read smoother, but suddenly you have to do two things with every bit of dialogue ', 
            question_id: Question.all.first.id, answer_author_id: User.all.last.id}
]


dummy_answers.each {|answer| Answer.create(answer)}