# [Give&Take](http://give-and-take.herokuapp.com) [![Build Status](https://travis-ci.org/midnightslackers/give-and-take.svg?branch=master)](https://travis-ci.org/midnightslackers/give-and-take)

G&T has a simple goal: to learn from each other. We believe that learning should be fun and free as well as bring people together. G&T is all about community and teaching each other. You get to learn as much as you want - as long as you also teach others.

## Getting Started for Development

1. Install [Node.js](https://nodejs.org/en/).
2. Install [MongoDB](https://docs.mongodb.com/manual/installation/)
3. Install [npm](https://www.npmjs.com/)
4. Run `git clone https://github.com/midnightslackers/give-and-take.git`
5. Run `cd give-and-take`.
6. Run `npm install`.
7. Start your local instance of MongoDB
8. Create a .env file in the project directory and set up the following variables:
  - `JWT_SECRET=[your secret variable here]`
  - `MONGODB_URI=[the url of your instance of mongodb]`
  - `PORT=[your chosen port]`
  - `SENGRID_API_KEY=[your sengrid api key]`
9. Run `npm run dev`.



## API

### Users

#### Retrieve All Users

```
GET /api/users
```

#### Retrieve One User by ID

```
GET /api/users/:userId
```

#### Retrieve Users by Subtopic

```
GET /api/users/bysubtopic/:subTopicId
```

#### Retrieve Users by Gender
Options: male, female, other
```
GET /api/users/bygender/:gender
```

#### Registering a new User
In order to properly create a new User the below fields are required.
```
POST /api/auth/register
```


| Name                | Type     | Description |
| ------------------- | -------- | ----------- |
| `first_name`        | `string` | The first name of a user. |
| `last_name`         | `string` | The last name of a user.  |
| `gender`            | `string` | Either `male` or `female` for this user. |
| `email`             | `string` | An `email` will be used for this user to log into their account. |
| `password`          | `string` | A secret `password` for this user to log into their account. |
| `zip`               | `number` | The location of the User by zip code. |
| `subtopic`          | `string` | The specific skill the User wants to teach. |
| `topic`             | `string` | The category of the skill the User wants to teach |


### Topics

#### Retrieve All Topics

```
GET /api/topics
```

#### Retrieve One Topic by Id

```
GET /api/topics/:topicId
```

#### Retrieve All Subtopics

```
GET /api/subtopics
```

#### Retrieve One Subtopic by Id

```
GET /api/subtopics/:subtopicId
```

#### Retrieve All Subtopics by Topic

```
GET /api/topics/
```

## Credits

- __Contributors__: [Yvonne Hayes](https://github.com/YvonneHayes), [Don Chatelain](https://github.com/DonChatelain), [Johnny Luangphasy](https://github.com/jluangphasy)
- __License__: [MIT](https://github.com/midnightslackers/give-and-take/blob/master/LICENSE)
