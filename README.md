# Pokedex App

## Description

Pokedex application using Flask as the backend and React as the front end. It also uses [PokeApi](https://pokeapi.co/docs/v2) to fetch the necessary data to add to the custom database created. 

## Features
- Can create an account (has to be unique)
- Can Sign in
- Can add favorites (Has to be signed in)
- Can access a page to view all the favorites to an account (Has to be signed in)
- Can view you profiles page for information about your account (shows profile picture, username and favorites count)
- Filter by name, ascending, descending, Z-A, A-Z, and by attributes on the main page
- Can view individual pokemons for more information

## Setup Instructions 
Node.js is a major requirement to run this application, and it can be installed [here](https://nodejs.org/en/download/). Make sure you have python installed as well. Download and go into the project. 

### Back-end
```
cd back-end
pip install -r /path/to/requirements.txt
python main.py
```

### Client-end
```
cd client-side
npm install
npm start
```

## Improvements that can be made
- Add Session storage implementation for:
  - home page pokemons data to reduce the amount of calls to the backend everytime entering the home page
  - the filtering feature to persist the filters. This helps retain the filters throughout the session of the page.
- Add a page number feature for the home page. Limits to say 10 rows. This helps reduce the size of the page. right now all 1000 pokemons loads on one page which can slow down the page.
- Change the layout of the filtering to make it nicer
- Client side hard coded strings, remove them and add them to the common.js file under data folder

## Author
Anthony Massaad
Copyright © 2023. All rights reserved
