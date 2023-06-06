from flask import request
import json
from . import db, DB_NAME, app
from os import path
from server.database import queries, getAllPokemons, getPokemonByPokeName
from utils.logger import Logger

@app.route("/", methods=['GET'])
def welcome():
    return "Welcome to the pokedex API!"

@app.route("/getPokemonByName", methods=['GET'])
def getPokemonByName():
    pokemonName = request.args.get('pokemonName')
    Logger.info("Pokemon name is ", pokemonName)
    return getPokemonByPokeName(pokemonName)

@app.route("/getPokemons", methods=['GET'])
def getPokemons():
    return getAllPokemons()

def create_app():
    app.config['SECRET_KEY'] = 'secret_key' # Secure the cookie or session data
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}' # STORING THE DATABSE INSIDE THE WEBSITE DIRECOTRY Just tells flask

    db.init_app(app) # takes the databse and applies the app to it
    # if not path.exists(f"instance/{DB_NAME}"):
    with app.app_context():
        
        db.create_all()
        queries()


def run_server():
    create_app()
    host = '0.0.0.0'
    port = 8080
    app.run(host, port, debug=True, threaded=False)
