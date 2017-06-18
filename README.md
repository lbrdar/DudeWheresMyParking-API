# Dude, where's my parking API

Simple REST API server for my Dude, where's my parking mobile app.

You can find live version of this server at http://dude-wheres-my-parking-api.herokuapp.com/


## Development stack

Main technologies and packages used in development:
* [**Node JS**](https://nodejs.org/en/ "Documentation")
* [**Knex JS**](http://knexjs.org/ "Documentation")
* [**Eslint**](http://eslint.org/ "Documentation")

For other packages used, check out package.json in project files.


## Available API endpoints

* **/register** (POST)
* **/login** (POST)
* **/users/:id** (GET, PUT)
* **/users_address/:userId** (GET, POST)
* **/parking_types** (GET)
* **/parking_taken_for_slots** (GET)
* **/parking_spots** (GET, POST)
* **/parking_spots/near** (GET)
* **/parking_spots/:id** (GET, PUT)
