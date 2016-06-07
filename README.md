# Give and Take [![Build Status](https://travis-ci.org/midnightslackers/give-and-take.svg?branch=master)](https://travis-ci.org/midnightslackers/give-and-take) [![Stories in Ready](https://badge.waffle.io/midnightslackers/give-and-take.svg?label=ready&title=Ready)](http://waffle.io/midnightslackers/give-and-take)

Description about Give and Take.

## API

### Topics

#### Retrieve All Users by Topic Category

```
GET /api/topics/:category
```

#### Retrieve All Users by Topic Category and Subcategory

```
GET /api/topics/:category/:subcategory
```

#### Create Topic Subcategory

```
POST /api/topics/:category/:subcategory
```

### Users

#### Retrieve All Users

Description for retrieve all users.

```
GET /api/users
```

#### Retrieve Single User

Description for retrieve single user.

```
GET /api/users/:id
```

#### Create User

Description for create user.

```
POST /api/users
```

##### Input

| Name                | Type     | Description |
| ------------------- | -------- | ----------- |
| `first_name`        | `string` | The first name of a user. |
| `last_name`         | `string` | The last name of a user.  |
| `gender`            | `string` | Either `male` or `female` for this user. |
| `email`             | `string` | An `email` will be used for this user to log into their account. |
| `password`          | `string` | A secret `password` for this user to log into their account. |
| `confirm_password`  | `string` | Matches `password` for confirmation. |

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
