# Muses

A Quora clone where questions are asked, answered, and edited by users.

### Features:

+ Auth account creation, guest access
+ Logged in user:
    + has (CRUD) access to Questions
    + Create an answer to a question
    + Add a comment to an answer
    + Navigate questions by topics
    + Update topics to any question
    + Search:
        + regular input will search by question
        + `field:value` will search questions by:
            + `user:kari`
            + `topic:art`
            + `question:flying` 

## Technology

### Backend

+ Postgresql
+ Rails 5
    + Active Records
    + BCrypt
+ jbuilder

### Frontend

+ Nodejs
+ React
+ Redux
+ jQuery



## Project Design

### MVP Checklist

+ [Backend Routes and API][1]
+ [Frontend Routes][2]
+ [MVP list][3]
+ [Sample State][4]
+ [Schema][5]

[1]: https://github.com/VladRez/muses/wiki/backend-routes
[2]: https://github.com/VladRez/muses/wiki/frontend-routes
[3]: https://github.com/VladRez/muses/wiki/MVP-list
[4]: https://github.com/VladRez/muses/wiki/sample-state
[5]: https://github.com/VladRez/muses/wiki/schema



### Implementation

#### User Account Authentification

Passwords are secured using `BCrypt` rails gem to generate a *password digest*. A user's *session token* is generated, stored in the database, and stored on the client-side as a browser cookie to keep track of user's login session.

![](docs/images/login.png)

#### Feed

![](docs/images/mainpage.png)

#### Filter Question feed by Topic

![](docs/images/feedfilter.png)

#### Question Search

![](docs/images/regularsearch.png)

### Filter Search

![](docs/images/wildcardsearch.png)

### Question Page

![](docs/images/questionpage.png)


