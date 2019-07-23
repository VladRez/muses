# Muses

A Quora clone where questions are asked, answered, and edited by users.

---
## MVP Checklist

### Schema

Users

|id|username|password_digest|
|---|---|---|
|int|varchar|varchar|


Questions

|id|title|body|question_author_id|
|---|---|---|---|
|int|varchar|text|int|

Answers

|id|body|answer_author_id|question_id|
|---|---|---|---|
|int|text|int|int|

Comments

|id|body|answer_id|comment_author_id|
|---|---|---|---|
|int|text|int|int|

Topics

|id|name|
|---|---|
|int|varchar|

### Models and Associations


+ User
    + id:integer
    + username:string
    + password_digest:string
+ User Association
    + has_many: questions
    + has_many: answers
    + has_many: comments
+ Question
    + id:integer
    + title:string
    + body:text 
    + author_id:integer
    + category_id:integer
+ Question Association
    + belongs_to: question_author_id
    + has_many: answers
+ Answer
    + id:integer
    + question_id:integer
    + author_id:integer
    + body:text
+ Answer Association
    + belongs_to: answer_author_id
    + belongs_to: question
    + has_many: comments
+ Comment
    + id:integer
    + body:text
    + answer_id
+ Comment Association
    + belongs_to: answer_id
    + belongs_to: 
+ topics
    + id:integer
    + name:string


## Redux Entities

```js
store = {
    entities: {
        questions: {author_id: 'string', title: 'string', body: 'string', category_id: 'string'},
        answers: {question_id: 'string', author_id: 'string', body: 'string'},
        comments: {answer_id: 'string', body: 'string', author_id: 'string'}
    },
    ui: {},
    errors: {}
}
```

### Features 

1. New account creation, login, and guest/demo login
2. A production README 
3. Hosting on Heroku
4. Questions
5. Answers/comments on answers
6. Search Questions
    + regex
7. Topics/Tags

+ **TBD**: Upvotes, order questions by popularity
+ **TBD**: Replies to comments




