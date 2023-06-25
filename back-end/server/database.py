from sqlalchemy.sql import func
from sqlalchemy import or_
from werkzeug.security import generate_password_hash, check_password_hash
from collections import defaultdict
from flask_sqlalchemy import SQLAlchemy
from utils.logger import Logger

db = SQLAlchemy()
STRING_LENGTH = 1000
 
# Creates a database model and archetecture for consistency 
class Pokemon(db.Model):
    poke_name = db.Column(db.String(STRING_LENGTH), unique=True, primary_key=True)
    poke_id = db.Column(db.String(STRING_LENGTH), unique=True, nullable=False)
    id = db.Column(db.Integer, unique=True, nullable=False)
    poke_description = db.Column(db.String(STRING_LENGTH), nullable=False)

class Type(db.Model):
    type_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    poke_name = db.Column(db.String(STRING_LENGTH), db.ForeignKey('pokemon.poke_name'), nullable=False)
    attr_name =  db.Column(db.String(STRING_LENGTH), nullable=False)
    
    pokemon_rel = db.relationship("Pokemon", foreign_keys=[poke_name])

class Weakness(db.Model):
    weakness_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    poke_name = db.Column(db.String(STRING_LENGTH), db.ForeignKey('pokemon.poke_name'), nullable=False)
    attr_name =  db.Column(db.String(STRING_LENGTH), nullable=False)
    
    pokemon_rel = db.relationship("Pokemon", foreign_keys=[poke_name])

class User(db.Model):
    username = db.Column(db.String(STRING_LENGTH), primary_key=True)
    password = db.Column(db.String(STRING_LENGTH), nullable=False)

class Evolution(db.Model):
    evolution_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    poke_name = db.Column(db.String(STRING_LENGTH), db.ForeignKey('pokemon.poke_name'), nullable=False)
    poke_name_evolution = db.Column(db.String(STRING_LENGTH), db.ForeignKey('pokemon.poke_name'), nullable=False)
    
    pokemon_rel = db.relationship("Pokemon", foreign_keys=[poke_name])

class Favorites(db.Model): 
    favorite_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(STRING_LENGTH), db.ForeignKey('user.username'), nullable=False)
    poke_name = db.Column(db.String(STRING_LENGTH), db.ForeignKey('pokemon.poke_name'), nullable=False)
    
    user_rel = db.relationship("User", foreign_keys=[username])
    pokemon_rel = db.relationship("Pokemon", foreign_keys=[poke_name])

def getFavoritesByUsername(username):
    # user is signed in, we want to collect the favorites! 
    favorites = set()
    if not username:
        return favorites
    favorites_query = db.session.query(Favorites.poke_name).filter(Favorites.username == username)
    favorites = {fav[0] for fav in favorites_query.all()}
    Logger.info("Favorites for ", username, " ", favorites, db.session.query(Favorites).count(), favorites_query.all())
    return favorites

def getFavoriteByUsernameAndPokeName(username, poke_name):
    if not username:
        return None
    favorite = Favorites.query.filter_by(username=username, poke_name=poke_name).first()  
    return favorite 

def getAllPokemons(username):
    Logger.info("Getting all pokemons, username is ", username)
    query = db.session.query(Pokemon.poke_name, Pokemon.poke_id, Pokemon.id, func.group_concat(Type.attr_name)).join(Type, Pokemon.poke_name == Type.poke_name).order_by(Pokemon.id.asc()).group_by(Pokemon.poke_name)
    results = query.all()  # Execute the query and fetch all the results
    poke_dict = defaultdict(list)
    poke_dict["pokemons"] = []
    
    favorites = getFavoritesByUsername(username)
        
    for record in results:
        data = {
            "poke_name": record[0],
            "poke_id": record[1],
            "id": record[2],
            "types": record[3].split(","),
            "isFavorite": record[0] in favorites  # Check if the poke_name is in favorites
        }
        poke_dict["pokemons"].append(data)
    json_data = dict(poke_dict)
    Logger.info("Dictionary for all pokemons is: \n", json_data)

    return json_data

def getAllFavoritePokemons(username):
    query = db.session.query(
        Pokemon.poke_name,
        Pokemon.poke_id,
        Pokemon.id,
        func.group_concat(Type.attr_name)
    ).join(Type, Pokemon.poke_name == Type.poke_name).join(
        Favorites, Pokemon.poke_name == Favorites.poke_name
    ).filter(
        Favorites.username == username
    ).order_by(
        Pokemon.id.asc()
    ).group_by(
        Pokemon.poke_name
    )    
    
    results = query.all()
    poke_dict = defaultdict(list)
    poke_dict["pokemons"] = []
    
    for record in results:
        data = {
            "poke_name": record[0],
            "poke_id": record[1],
            "id": record[2],
            "types": record[3].split(","),
            "isFavorite": True 
        }
        poke_dict["pokemons"].append(data)
        
    json_data = dict(poke_dict)
    Logger.info("Dictionary for all favorite pokemons is: \n", json_data)
    return json_data

def getPokemonByPokeName(name, username):

    def getEvolutionDetail(evo_name):
        evo_query = db.session.query(
        Pokemon.poke_name,
        Pokemon.poke_id,
        Pokemon.id,
        func.group_concat(Type.attr_name.distinct()),
        ).filter(Pokemon.poke_name == evo_name)\
        .join(Type, Pokemon.poke_name == Type.poke_name)
        
        evo_results = evo_query.all()  # Execute the query and fetch all the result
        Logger.info("Getting evolution information of: ", evo_name, " created ", evo_results)
        
        if len(evo_results) == 0:
            return
        
        result = evo_results[0]
        return {
            "poke_name": result[0],
            "poke_id": result[1],
            "id": result[2],
            "types": result[3].split(",")
        }
    
    def getPokemonById(id, max_id):
        select_id = id
        if id == max_id + 1: 
            select_id = 1
        elif id == 0:
            select_id = max_id
        
        pokemon_by_id = db.session.query(
        Pokemon.poke_name,
        Pokemon.poke_id,
        ).filter(Pokemon.id == select_id)
        
        id_poke_results = pokemon_by_id.all()
        Logger.info("Getting pokemon by id: ", select_id, " created ", id_poke_results)
        
        if len(id_poke_results) != 1:
            Logger.error("Getting pokemon by id resulted is more or less than 1: ", len(id_poke_results))
        
        selected_pokemon = id_poke_results[0]
        return {
            "poke_name": selected_pokemon[0],
            "poke_id": selected_pokemon[1]
        }

            
    Logger.info("Entered Get pokemon by name: ", name)
    print("-----------------------------")
    query = db.session.query(
    Pokemon.poke_name,
    Pokemon.poke_id,
    Pokemon.id,
    Pokemon.poke_description,
    func.group_concat(Type.attr_name.distinct()),
    func.group_concat(Weakness.attr_name.distinct()),
    func.group_concat(Evolution.poke_name_evolution.distinct())
    ).filter(Pokemon.poke_name == name)\
    .join(Type, Pokemon.poke_name == Type.poke_name)\
    .join(Weakness, Pokemon.poke_name == Weakness.poke_name)\
    .join(Evolution, Pokemon.poke_name == Evolution.poke_name)
    results = query.all()  # Execute the query and fetch all the result
    
    Logger.info("Selected Pokemon Results: :\n", results)
    
    if len(results) != 1:
        Logger.error("Getting pokemon by name resulted in no results")
    
    favorites = getFavoriteByUsernameAndPokeName(username, name)
    Logger.info("username ", username, "Favorites of ", name, " is ", favorites)
    
    result = results[0]     
    poke_dict = defaultdict(list)
    id = result[2]
    # pokemon information
    poke_dict["pokemon"] = {
        "poke_name": result[0],
        "poke_id": result[1],
        "id": id,
        "description": result[3],
        "types": result[4].split(","),
        "weaknesses": result[5].split(","),
        "isFavorite": favorites != None
    }
    
    # evolution of pokemon
    poke_dict["evolution"] = []
    evolutions = result[6].split(",")
    for evo in evolutions:
        poke_dict["evolution"].append(getEvolutionDetail(evo))
    sorted_evolution = sorted(poke_dict["evolution"], key=lambda x: x['id'])
    poke_dict["evolution"] = sorted_evolution
    
    # get the previous and next pokemon selection
    max_id = db.session.query(Pokemon).count()
    poke_dict["next_pokemon"] = getPokemonById(id + 1, max_id)
    poke_dict["previous_pokemon"] = getPokemonById(id - 1, max_id)
    
    json_data = dict(poke_dict)
    Logger.info("Returning Dictionary: \n", json_data)
    print("-----------------------------------")
    return json_data

def pokemonSearch(name, filter, order, username, isFavoriteOnly):
    Logger.info("Entering pokemon search")
    print("-----------------------------------------")
    order_options = {
        "Ascending PokeID": Pokemon.id.asc(),
        "Descending PokeID": Pokemon.id.desc(),
        "A-Z": Pokemon.poke_name,
        "Z-A": Pokemon.poke_name.desc(),
    };
    
    query = db.session.query(Pokemon.poke_name, Pokemon.poke_id, Pokemon.id)
    
    if isFavoriteOnly:
        query = query.join(Favorites, Pokemon.poke_name == Favorites.poke_name).filter(Favorites.username == username)
    
    if name: 
        Logger.info("Pokemon Search has Name: ", name)
        query = query.filter(Pokemon.poke_name.ilike(f"%{name}%"))
    else:
        Logger.warn("Pokemon Search has no Name Parameters: ", name)
    
    if filter:
        Logger.info("Pokemon Search has Filter: ", filter)
        filter_condition = filter.split(",")
        filter_query = []
        for filter_item in filter_condition:
            filter_query.append(
                Type.attr_name == filter_item
            )
        query = query.join(Type).filter(or_(*filter_query))
    else:
        Logger.warn("Pokemon Search has no filter: ", filter)
    
    order_option = order_options.get(order)
    if order in order_options:
        Logger.info("Pokemon Search order: ", order)
        query = query.order_by(order_option)
    else:
        Logger.error("Pokemon Search order unknown: ", order)
    
    
    
    favorites = getFavoritesByUsername(username)
        
    results = query.all()
    poke_dict = defaultdict(list)
    poke_dict["pokemons"] = []
    for record in results:
        types = db.session.query(Pokemon.poke_name, func.group_concat(Type.attr_name.distinct())).join(Type, record[0] == Type.poke_name).all()        
        data = {
            "poke_name": record[0],
            "poke_id": record[1],
            "id": record[2],
            "types": types[0][1].split(","),
            "isFavorite": record[0] in favorites

        }
        poke_dict["pokemons"].append(data)
    json_data = dict(poke_dict)    
    Logger.info("Json Data for pokemon Search: ", json_data)
    return json_data

def signIn(username, password): 
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        return user
    return None

def createAccount(username, password):
    user = User.query.filter_by(username=username).first()    
    if not user:
        new_user = User(username=username, password=generate_password_hash(password, method='scrypt'))
        db.session.add(new_user)
        db.session.commit()
        return new_user
    return None

def addFavorites(username, poke_name):
    Logger.info("ENTERED FAVORITES: username=", username, " poke_name=", poke_name)
    favorite = Favorites.query.filter_by(username=username, poke_name=poke_name).first()    
    if not favorite:
        fav = Favorites(username=username, poke_name=poke_name)
        db.session.add(fav)
        db.session.commit()
        return "add"
    else: 
        Favorites.query.filter_by(username=username, poke_name=poke_name).delete()
        db.session.commit()
        return "remove"

def getProfileData(username):
    favs_count = Favorites.query.filter_by(username=username).count()
    return  {
        "username": username,
        "favoritesCount": favs_count
    }
    

def queries():
    # Delete all rows from the tables
    db.session.query(Weakness).delete()
    db.session.query(Evolution).delete()
    db.session.query(Type).delete()
    db.session.query(User).delete()
    db.session.query(Pokemon).delete()
    # db.session.query(Favorites).delete()

    db.session.commit()
        
    # TODO Automate this from a json!

    db.session.add(Pokemon(poke_name="Bulbasaur", poke_id="001", id=1, poke_description="There is a plant seed on its back right from the day this Pokémon is born. The seed slowly grows larger."))
    db.session.add(Pokemon(poke_name="Ivysaur", poke_id="002", id=2, poke_description="When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs."))
    db.session.add(Pokemon(poke_name="Venusaur", poke_id="003", id=3, poke_description="Its plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight."))
    db.session.add(Pokemon(poke_name="Charmander", poke_id="004", id=4, poke_description="It has a preference for hot things. When it rains, steam is said to spout from the tip of its tail."))
    db.session.add(Pokemon(poke_name="Charmeleon", poke_id="005", id=5, poke_description="It has a barbaric nature. In battle, it whips its fiery tail around and slashes away with sharp claws."))
    db.session.add(Pokemon(poke_name="Charizard", poke_id="006", id=6, poke_description="It spits fire that is hot enough to melt boulders. It may cause forest fires by blowing flames."))
    
    db.session.add(Type(poke_name="Bulbasaur", attr_name="Grass"))
    db.session.add(Type(poke_name="Bulbasaur", attr_name="Poison"))
    db.session.add(Type(poke_name="Ivysaur", attr_name="Grass"))
    db.session.add(Type(poke_name="Ivysaur", attr_name="Poison"))
    db.session.add(Type(poke_name="Venusaur", attr_name="Grass"))
    db.session.add(Type(poke_name="Venusaur", attr_name="Poison"))
    
    db.session.add(Type(poke_name="Charmander", attr_name="Fire"))
    db.session.add(Type(poke_name="Charmeleon", attr_name="Fire"))
    db.session.add(Type(poke_name="Charizard", attr_name="Fire"))
    db.session.add(Type(poke_name="Charizard", attr_name="Flying"))

    db.session.add(Weakness(poke_name="Bulbasaur", attr_name="Fire"))
    db.session.add(Weakness(poke_name="Bulbasaur", attr_name="Psychic"))
    db.session.add(Weakness(poke_name="Bulbasaur", attr_name="Flying"))
    db.session.add(Weakness(poke_name="Bulbasaur", attr_name="Ice"))
    
    db.session.add(Weakness(poke_name="Ivysaur", attr_name="Fire"))
    db.session.add(Weakness(poke_name="Ivysaur", attr_name="Psychic"))
    db.session.add(Weakness(poke_name="Ivysaur", attr_name="Flying"))
    db.session.add(Weakness(poke_name="Ivysaur", attr_name="Ice"))
    
    db.session.add(Weakness(poke_name="Venusaur", attr_name="Fire"))
    db.session.add(Weakness(poke_name="Venusaur", attr_name="Psychic"))
    db.session.add(Weakness(poke_name="Venusaur", attr_name="Flying"))
    db.session.add(Weakness(poke_name="Venusaur", attr_name="Ice"))
    
    db.session.add(Weakness(poke_name="Charmander", attr_name="Water"))
    db.session.add(Weakness(poke_name="Charmander", attr_name="Ground"))
    db.session.add(Weakness(poke_name="Charmander", attr_name="Rock"))
    
    db.session.add(Weakness(poke_name="Charmeleon", attr_name="Water"))
    db.session.add(Weakness(poke_name="Charmeleon", attr_name="Ground"))
    db.session.add(Weakness(poke_name="Charmeleon", attr_name="Rock"))
    
    db.session.add(Weakness(poke_name="Charizard", attr_name="Water"))
    db.session.add(Weakness(poke_name="Charizard", attr_name="Ground"))
    db.session.add(Weakness(poke_name="Charizard", attr_name="Rock"))
    
    db.session.add(Evolution(poke_name="Bulbasaur", poke_name_evolution="Bulbasaur"))
    db.session.add(Evolution(poke_name="Bulbasaur", poke_name_evolution="Ivysaur"))
    db.session.add(Evolution(poke_name="Bulbasaur", poke_name_evolution="Venusaur"))
    
    db.session.add(Evolution(poke_name="Ivysaur", poke_name_evolution="Bulbasaur"))
    db.session.add(Evolution(poke_name="Ivysaur", poke_name_evolution="Ivysaur"))
    db.session.add(Evolution(poke_name="Ivysaur", poke_name_evolution="Venusaur"))
    
    db.session.add(Evolution(poke_name="Venusaur", poke_name_evolution="Bulbasaur"))
    db.session.add(Evolution(poke_name="Venusaur", poke_name_evolution="Ivysaur"))
    db.session.add(Evolution(poke_name="Venusaur", poke_name_evolution="Venusaur"))
    
    db.session.add(Evolution(poke_name="Charmander", poke_name_evolution="Charmander"))
    db.session.add(Evolution(poke_name="Charmander", poke_name_evolution="Charmeleon"))
    db.session.add(Evolution(poke_name="Charmander", poke_name_evolution="Charizard"))
    
    db.session.add(Evolution(poke_name="Charmeleon", poke_name_evolution="Charmander"))
    db.session.add(Evolution(poke_name="Charmeleon", poke_name_evolution="Charmeleon"))
    db.session.add(Evolution(poke_name="Charmeleon", poke_name_evolution="Charizard"))
    
    db.session.add(Evolution(poke_name="Charizard", poke_name_evolution="Charmander"))
    db.session.add(Evolution(poke_name="Charizard", poke_name_evolution="Charmeleon"))
    db.session.add(Evolution(poke_name="Charizard", poke_name_evolution="Charizard"))
    
    db.session.add(User(username="tony1bally", password=generate_password_hash("tony", method='scrypt')))
    
    db.session.commit()
    # getAllPokemons()
    # getPokemonByName("Charizard")