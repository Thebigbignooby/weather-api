# Api project 42

- Getting started
- Why: motivation
- What: requirements
- How
- Dev Log
- Thoughts

## Getting started

Instructions to install and run the project.

This project requires Docker

### Initialise

```
./scripts/init.sh
```

### Development

```
./scripts/up.sh
```

### Testing

```
npm run test:with-docker
```

### Stop containers

```
./scripts/down.sh
```

These scripts are simple but could potentially evolve over time.

### VS Code Extensions

- REST Client
  - used for the `./requests/` folder
  - allows you to execute queries against your running api, good replacement for postman

## Why: motivation

This is a technical test for some company

## What: requirements

Requirements are to create a node.js API with typescript, Express.js and mongoDB, using Docker.

1. One API endpoint which allows a user to authenticate following Oauth2 standard.
2. One API endpoint which takes an address and checks it against Google Maps Geolocoding API, caching each address for 12 hours.
3. One API endpoint which takes an address and checks the weather using the Open Weather API, based on latitude and longitude.

## How: planning implementation

### Project setup

- Hello world with node.js, typescript, docker
- add mongodb with docker
- add hello world tests with jest

### Designing the app

For task n°3, we need latitude and longitude, so if the address isn't stored in the cache, we must do a first call to Google's API to get them.

So my first thoughts for a folder tree look something like this:

```
src/
├── index.js
├── routes/
│   ├── auth
│   ├── check-address
│   └── get-weather
├── services/
│   ├── google/
│   │   └── check-address
│   └── open-weather/
│       └── get-weather
```

Or maybe group routes pertaining to addresses

```
src/
├── index.js
├── routes/
│   ├── auth
│   └── address/
│       ├── check-existance
│       └── get-weather
├── services/
│   ├── google/
│   │   └── check-address
│   └── open-weather/
│       └── get-weather
```

### Questions concerning tests

What to test, what not to test?
Which are need to have, which are nice to have?

#### It works

- authentication
  - create user
  - delete user
  - update user
  - user exists
  - user doesn't exist
- check address
  - mock google api ?
  - address exists
  - address doesn't exist
  - unit test the service function
  - int test the route
  - address is cached
  - address is not cached
- get weather
  - mock open weather api ?
  - unit test the service function
  - int test the route
  - do we test that address is cached/ not cached again here?
  - do we test that address exists/ doesn't exist again here?
  - since we're getting the lat, lng from google, I can't imagine we would have eroneous input here, so do we need to test the case when lat, lng don't make sense?
  - we do need to test whether the user is authorised to use this feature.
    - are we testing authentication or authorisation?

#### It doesn't work

I probably won't do them, but there should be some tests checking errors if user inputs are BS, like malformed email, missing parameters, wrong formats, etc...

#### Environments

One Db image for dev & tests?
Or one db image for dev, and another for tests?

update: silly me. It's one MongoDB image in which we create a test db and a dev db.

## Dev Log

### Log: 1

First issue that made me lose some time, was a seemingly infinite restart of nodemon. The culprit was this line in the `nodemon.json` file:

```
    "ts": "nodemon --inspect=0.0.0.0:9229 --nolazy -r ts-node/register"
```

I typed `nodemon` instead of `node` ...

### Log: 2

Running `docker-compose up` gave me an error instead of a running api :(

```sh
$ docker-compose up
Creating network "wefox_default" with the default driver
Creating api ... error

ERROR: for api  Cannot create container for service api: invalid volume specification: '/run/desktop/mnt/host/c/Users/Rory/dev/TECHNICAL-TESTS/wefox/src:wefox/api/src:rw': invalid mount config for type "bind": invalid mount path: 'wefox/api/src' mount path must be absolute                     op/mnt/host/c/Users/Rory/dev/TECHNICAL-TESTS/wefox/src:wefox/api/src:rw': invalid mount config for ty

ERROR: for api  Cannot create container for service api: invalid volume specification: '/run/desktop/mnt/host/c/Users/Rory/dev/TECHNICAL-TESTS/wefox/src:wefox/api/src:rw': invalid mount config forop/mnt/host/c/Users/Rory/dev/TECHNICAL-TESTS/wefox/src:wefox/api/src:rw': invalid mount config for ty type "bind": invalid mount path: 'wefox/api/src' mount path must be absolute
ERROR: Encountered errors while bringing up the project.
```

My initial search lead me to believe that this was maybe related to the fact that I was on Windows.
However, I went through my `docker-compose.yml` file slowly and tried adding a `/` to a path for the volumes:

From this

```yml
    volumes:
      - ./src:wefox/api/src
```

To this

```yml
    volumes:
      - ./src:/wefox/api/src
```

time lost: approx 20-30 minutes

### Log: 3

I noticed my server wasn't restarting when I edited files.

After much digging around, it looks like it's an issue related to the fact that docker containers run in wsl on windows, so I had to add the `-L` flag tot he nodemon command.

My `package.json` file now looks like this:

```
    "dev": "nodemon src/index.ts",
    "dev-with-docker": "nodemon -L src/index.ts",
```

### Log: 4

I was going to use Mongoose, but I just discovered Typegoose, so I think I will give that a try.

Installing Typegoose errored out because it uses a different version of Mongoose as a peer depency from the one I had already installed.
So I locked the correct version in place and continued.

Then, while trying to initiate the connection to mongodb in the node.js app, I first got a first message about some deprecated connection options, and once those were addressed I get an `Error connecting to database: MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017` :'(

As I had managed to launch a mongo-express container which could connect to the MongoDB container, I was quite puzzled.

After a little hunting around, I found a blog post which pointed out to replace `localhost` with `mongo` in the dbConnectionString in my `db.ts` file.

from 

```
const DB_CONNECTION_STRING = `mongodb://localhost:27017/${DB_ENV}` 
```
to
```
const DB_CONNECTION_STRING = `mongodb://mongo:27017/${DB_ENV}` 
```

### Log: 5

Scratching my head about how to handle the test environment, especially relating to my setup with Docker.

As I'm still new to using docker, I decided, perhaps wrongly, to initialise mongodb with 3 databases on image creation using a setup script.
To do this, I created a `mongo-init.js` script inside a folder named `docker-entrypoint-initdb.d`.

Upon relaunching my containers to try this out, TypeScript was insulting me because of `req.user = user` and it turns out one has to extend the Express types explicitly to do this kind of stuff.

I managed to fix this because intellisense in VSCode was no longer yelling at me, but my nodemon server inside docker was still crashing.
While searching for a solution, I discovered `ts-node-dev` and decided to use that instead of nodemon.

Environnment variables:

Obviously, they should be managed properly.

I wonder if there's a way to swap them without restarting the containers...

Usually, I use a .env file and then manage environnment variables manually on a managed hosting service like heroku.
I'm not certain of the best way to do this when using containers. I have come accross the notion of Docker Secrets but would need more time to explore this solution.
Right now, I'm eager to get on with actual development, so i'll pause the project setup for now and make do with just using "dev".

### Log: 6

I gave another crack at setting up a test env with docker and eventually succeeded, using a combination of an extra target in my `Dockerfile`, a `docker-compose.test.yml` file and an extra script in my `/scripts` folder.

I then lost quite a bit of time fighting with mongodb typescript typings in my test file, only to realise I was importing the types from `@types/mongodb` instead of `mongodb`... hashtag facepalm!

Finally, I fell upon this supertest library which looks promising but makes me question my docker testing setup. 

### Log: 7

I was pulling my hair out for a little over an hour because I was not getting my user from the database in my test file despite clearly seeing it being created in mongo-express.

I initially thought it had something to do with the connection string which was wrong since the database was in a container, but I was able to connect to it without any problem from MongoDB Compass.

Eventually, on a hunch, I inspected the running processes on my PC, and lo and behold: I had a MongoDB process running in the background.

So, somehow, both that process and the mongodb docker container were exposed on `localhost:27017`. MongoDB Compass was connecting to the database running inside the container, whereas the MongoClient in my test file was connecting to the database running outside my container.

Killing the running process solved the problem: I now had access to my user from my test file!

### Log: 8

I now have my environnment up and running:

- development server with live reload inside docker
- access to containerised mongodb with script for first-time setup (usefull when doing a fresh install for new contributors for example)
- tests work with typescript

The fun part can begin, actual development! However, by challenging myself to using docker beyond the requirements, in addition to using TypeScript for the first time, I spent much more time than expected just to get things off the ground.

I simply don't have the time to do more, even though I think the hardest is behind me.

The rest looks pretty straightforward, though I think a credit card is required to enable usage of the GoogleMapsGeocoding API, so maybe I wouldn't have been able to go beyond that in practical terms. (I have only a debit card at the moment).

## Closing thoughts

These are things I have done for the first time while doing this test:

- Docker
  - setting up an environment
  - server restart on file change in dev mode
  - linking multiple images together in the same network
- Mongodb
  - using a setup script
- TypeScript
  - using TypeScript
  - extending library types
  - using Typegoose as ORM and Model Types generator
- Swagger
  - using Stoplight
  - endpoint definition file
- Authentication
  - in the past I have used services like AuthO, and in a different life I had used sessions with PHP. I realised in doing this exercise this was the first time I implemented auth myself in Node.js.

In the time it took me to wire all this together, I would probably have finished implementing all endpoints and tests had I decided not to use Docker nor TypeScript. Except perhaps for the cache functionnality: I have never done this, but my first reflex would be to link into Reddis.

I'm a little disappointed I'm handing this in unfinished, but glad I chose to challenge myself with Docker and TypeScript, as this will certainly serve me in the future.

I haven't taken the time to clean things up