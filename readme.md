# MVP Checklist Format

1. New account creation, login, and guest/demo login

+ Models
    + User
        + username:string
        + password:string
        + password_digest:string
2. A production README 
3. Hosting on Heroku
4. Questions
5. Answers/comments on answers
6. Search Questions
7. Topics/Tags

**Bonus**: Upvotes, order questions by popularity
**Bonus**: Replies to comments

## Entities

```js
store = {
    entities: {
        questions: {}
    }
}
```