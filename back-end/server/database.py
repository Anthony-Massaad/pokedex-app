from sqlalchemy.sql import func
from collections import defaultdict
from . import db

STRING_LENGTH = 1000
 
# Creates a database model and archetecture for consistency 
class Pokemon(db.Model):
    poke_name = db.Column(db.String(STRING_LENGTH), unique=True, primary_key=True)
    poke_id = db.Column(db.String(STRING_LENGTH), unique=True)
    id = db.Column(db.Integer, unique=True)
    poke_description = db.Column(db.String(STRING_LENGTH))

class Attribute(db.Model): 
    attr_name = db.Column(db.String(STRING_LENGTH), primary_key=True)

class Type(db.Model):
    type_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    poke_name = db.Column(db.String(STRING_LENGTH), db.ForeignKey('pokemon.poke_name'))
    attr_name =  db.Column(db.String(STRING_LENGTH), db.ForeignKey('attribute.attr_name'))
    
    attribute_rel = db.relationship("Attribute", foreign_keys=[attr_name])
    pokemon_rel = db.relationship("Pokemon", foreign_keys=[poke_name])

class Weakness(db.Model):
    weakness_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    poke_name = db.Column(db.String(STRING_LENGTH), db.ForeignKey('pokemon.poke_name'))
    attr_name =  db.Column(db.String(STRING_LENGTH), db.ForeignKey('attribute.attr_name'))
    
    attribute_rel = db.relationship("Attribute", foreign_keys=[attr_name])
    pokemon_rel = db.relationship("Pokemon", foreign_keys=[poke_name])

class User(db.Model):
    username = db.Column(db.String(STRING_LENGTH), primary_key=True)
    password = db.Column(db.String(STRING_LENGTH))

# class Favorites(db.Model): 
#     favorite_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     username = db.Column(db.String(STRING_LENGTH), db.ForeignKey('User.username'))
#     poke_name = db.Column(db.String(STRING_LENGTH), db.ForeignKey('pokemon.poke_name'))
    
#     user_rel = db.relationship("User", foreign_keys=[username])
#     pokemon_rel = db.relationship("Pokemon", foreign_keys=[poke_name])

def getAllPokemons():
    query = db.session.query(Pokemon.poke_name, Pokemon.poke_id, Pokemon.id, func.group_concat(Type.attr_name)).join(Type, Pokemon.poke_name == Type.poke_name).group_by(Pokemon.poke_name)
    results = query.all()  # Execute the query and fetch all the results
    poke_dict = defaultdict(list)
    poke_dict["pokemons"] = []
    print("Query:\n", query, "\n", results)
    for record in results:
        data = {
            "poke_name": record[0],
            "poke_id": record[1],
            "id": record[2],
            "types": record[3].split(","),
        }
        poke_dict["pokemons"].append(data)
        
    json_data = dict(poke_dict)
    return json_data

def queries():
    # Delete all rows from the tables
    db.session.query(Attribute).delete()
    db.session.query(Weakness).delete()
    db.session.query(Type).delete()
    db.session.query(User).delete()
    db.session.query(Pokemon).delete()
    # db.session.query(Favorites).delete()

    db.session.commit()
    
    
    pokemonTypes = ["Bug", "Dragon", "Fairy", "Fire", "Ghost", "Ground", "Normal", "Psychic", "Steel", "Dark", "Electric", "Fighting", "Flying", "Grass", "Ice", "Poison", "Rock", "Water"]
    for type_name in pokemonTypes:
        attribute = Attribute(attr_name=type_name)
        db.session.add(attribute)
        
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
    
    db.session.commit()
    # getAllPokemons()