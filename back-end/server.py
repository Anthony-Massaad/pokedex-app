from flask import Flask, request, abort
import json

app = Flask(__name__)

@app.route("/", method=['GET'])
def welcome():
    return "Welcome to the pokedex API!"

@app.route("/getPokemon", method=['GET'])
def getPokemon():
    pokemonName = request.args.get('pokemonName')

if __name__ == '__main__':
    host = '0.0.0.0'
    port = 8080
    app.run(host, port, debug=True, threaded=False)
