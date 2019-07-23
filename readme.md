# MVP Checklist Format

1. New account creation, login, and guest/demo login

+ Models
    + User
        + id:integer
        + username:string
        + password:string
        + password_digest:string
    + User Association
        + has_many: questions
        + has_many: answers
    + Question
        + id:integer
        + title:string
        + body:text 
        + author_id:integer
        + category_id:integer
    + Question Association
        + belongs_to: question_author
        + has_many: answers
    + Answer
        + id:integer
        + question_id:integer
        + author_id:integer
        + body:text
    + Answer Association
        + belongs_to: answer_author
        + belongs_to: question
    + topics
        + id:integer
        + name:string
2. A production README 
3. Hosting on Heroku
4. Questions
5. Answers/comments on answers
6. Search Questions
    + regex search
7. Topics/Tags

**Bonus**: Upvotes, order questions by popularity
**Bonus**: Replies to comments

## Entities

```js
store = {
    entities: {
        questions: {author_id: 'string', title: 'string', body: 'string', category_id: 'string'},
        answers: {question_id: 'string', author_id: 'string', body: 'string'}
    },
    ui: {},
    errors: {}
}
```