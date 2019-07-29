# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

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