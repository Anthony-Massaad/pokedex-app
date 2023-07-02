from flask import request, Flask, jsonify
from server.database import initializeDatabase, getAllPokemons, getPokemonByPokeName, \
    pokemonSearch, signIn, db, createAccount, addFavorites, getAllFavoritePokemons, getProfileData
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               jwt_required, JWTManager, unset_jwt_cookies
from utils.logger import Logger
import json

app = Flask(__name__)

DB_NAME = "database.db"

app.config['SECRET_KEY'] = 'Very Secret Key'
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me-super-secret"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)

db.init_app(app)
jwt = JWTManager(app)
CORS(app, supports_credentials=True)

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        Logger.info("RESPONDING TO REQUEST: ", response.data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

@app.route("/")
def welcome():
    return "Welcome to Pokedex API"

@app.route("/check", methods=['GET'])
@jwt_required()
def check():
    username = get_jwt_identity()
    Logger.info("USERNAME FROM JWT TOKEN: ", username)
    return {
        "response": True,
        "username": username
    }

@app.route("/getPokemonByName", methods=['GET'])
def getPokemonByName():
    pokemon_name = request.args.get('pokemonName')
    username = request.args.get('username')
    return getPokemonByPokeName(pokemon_name, username)

@app.route("/getPokemons", methods=['GET'])
def getPokemons():
    username = request.args.get("username")
    return getAllPokemons(username)

@app.route("/getFavoritePokemons", methods=['GET'])
def getFavoritePokemons():
    username = request.args.get('username')
    return getAllFavoritePokemons(username)

@app.route("/searchPokemons", methods=["GET"])
def searchPokemons():
    filters = request.args.get("filters")
    name = request.args.get("pokeName")
    order = request.args.get("order")
    username = request.args.get("username")
    isFavoriteOnly = request.args.get('isFavoriteOnly')
    return pokemonSearch(name, filters, order, username, isFavoriteOnly)

@app.route("/login", methods=["GET"])
def login():
    username = request.args.get("username")
    password = request.args.get("password")
    user = signIn(username, password)
    if user:
        access_token = create_access_token(identity=username)
        return {
            "response": True,
            "username": username,
            "access_token": access_token
        }
    return {
        "response": False
    }

@app.route("/signUp", methods=['POST'])
def signUp():
    username = request.args.get("username")
    password = request.args.get("password")
    user = createAccount(username, password)
    Logger.info("CREATE USER: ", None)
    if user:
        access_token = create_access_token(identity=username)
        return {
            "response": True,
            "username": username,
            "access_token": access_token
        }
    return {
        "response": False
    }

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@app.route("/addFavorite", methods=['POST'])
def addFavourite():
    poke_name = request.args.get("poke_name")
    username = request.args.get("username")
    commit = addFavorites(username, poke_name)
    return jsonify({
        "action": commit
    })
    

@app.route('/profile')
@jwt_required() #new line
def myProfile():
    response_body = {
        "name": "Nagato",
        "about" :"Hello! I'm a full stack developer that loves python and javascript"
    }
    username = get_jwt_identity()
    data = getProfileData(username)
    return jsonify(data)

def create_app(data):
    with app.app_context():
        db.create_all()
        initializeDatabase(data)

def run_server(data):
    create_app(data)
    host = '0.0.0.0'
    port = 8080
    app.run(host, port, debug=True, threaded=False)