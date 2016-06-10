# [Give&Take](http://give-and-take.herokuapp.com) [![Build Status](https://travis-ci.org/midnightslackers/give-and-take.svg?branch=master)](https://travis-ci.org/midnightslackers/give-and-take)

Description about Give&Take.

## Getting Started

1. Install [Node.js](https://nodejs.org/en/).
2. Install [MongoDB](https://docs.mongodb.com/manual/installation/).
3. Install [Postman](https://www.getpostman.com).
4. Run `git clone https://github.com/DonChatelain/express-mongo-rest-api.git`.
5. Run `cd express-mongo-rest-api`.
6. Run `npm install`.
7. Run `npm start`.
8. Use Postman to make requests.

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

















#### Modify User

Description for modify user.

```
PUT /api/users/:id
PATCH /api/users/:id
```

#### Input

| Name               | Type     | Description |
| ------------------ | -------- | ----------- |
| `first_name`       | `string` | The first name of a user. |
| `last_name`        | `string` | The last name of a user.  |
| `gender`           | `string` | Either `male` or `female` for this user. |
| `email`            | `string` | An `email` will be used for this user to log into their account. |
| `password`         | `string` | A secret `password` for this user to log into their account. |
| `confirm_password` | `string` | Matches `password` for confirmation. |

#### Destroy User

Description for destroy user.

```
DELETE /api/users/:id
```

## Credits

- __Contributors__: [Yvonne Hayes](https://github.com/YvonneHayes), [Don Chatelain](https://github.com/DonChatelain), [Johnny Luangphasy](https://github.com/jluangphasy)
- __License__: [MIT](https://github.com/midnightslackers/give-and-take/blob/master/LICENSE)
