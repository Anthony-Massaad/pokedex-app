from flask import request, session, Flask
from server.database import queries, getAllPokemons, getPokemonByPokeName, pokemonSearch, signIn, db
from flask_cors import CORS

app = Flask(__name__)

DB_NAME = "database.db"

app.config['SECRET_KEY'] = 'Very Secret Key'
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
db.init_app(app)
CORS(app, supports_credentials=True)

@app.route("/")
def welcome():
    return "Welcome to Pokedex API"

@app.route("/check", methods=['GET'])
def check():
    print(session)
    username = session.get("username")
    if username:
        return {
            "response": True,
            "username": username
        }
    
    return {
        "response": False
    }

@app.route("/getPokemonByName", methods=['GET'])
def getPokemonByName():
    pokemon_name = request.args.get('pokemonName')
    return getPokemonByPokeName(pokemon_name)

@app.route("/getPokemons", methods=['GET'])
def getPokemons():
    return getAllPokemons()

@app.route("/searchPokemons", methods=["GET"])
def searchPokemons():
    print(session)
    filters = request.args.get("filters")
    name = request.args.get("pokeName")
    order = request.args.get("order")
    return pokemonSearch(name, filters, order)

@app.route("/login", methods=["GET"])
def login():
    username = request.args.get("username")
    password = request.args.get("password")
    user = signIn(username, password)
    if user:
        session['username'] = username
        print(session)
        return {
            "response": True,
            "username": username
        }
    return {
        "response": False
    }

def create_app():
    with app.app_context():
        db.create_all()
        queries()

def run_server():
    create_app()
    host = '0.0.0.0'
    port = 8080
    app.run(host, port, debug=True, threaded=False)