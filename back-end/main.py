from server.server import run_server
from utils.logger import Logger
import requests
import re
from os import path
import json
import time

def loadPokemonData():
    data = []
    start_time = time.time()  # Get the current time before calling the method
    for pokemon_id in range(1, 1001):
        print(pokemon_id)
        url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_id}/"
        response = requests.get(url)
        _data = {}
        
        if response.status_code == 200:
            pokemon_data = response.json()

            # Extract name
            name = pokemon_data["name"].capitalize()
            _data["name"] = name

            # Extract types (names only)
            types = [t["type"]["name"].capitalize() for t in pokemon_data["types"]]
            _data["types"] = types

            # Extract weaknesses (names only)
            weaknesses_url = pokemon_data["types"][0]["type"]["url"]
            weaknesses_response = requests.get(weaknesses_url)
            if weaknesses_response.status_code == 200:
                weaknesses_data = weaknesses_response.json()
                weaknesses = [w["name"].capitalize() for w in weaknesses_data["damage_relations"]["double_damage_from"]]
                _data["weaknesses"] = weaknesses
            else:
                Logger.error("Error retrieving weaknesses:", weaknesses_response.status_code)

            # Extract description
            species_url = pokemon_data["species"]["url"]
            species_response = requests.get(species_url)
            if species_response.status_code == 200:
                species_data = species_response.json()
                flavor_text_entries = species_data["flavor_text_entries"]
                english_entries = [entry for entry in flavor_text_entries if entry["language"]["name"] == "en"]
                description = english_entries[0]["flavor_text"]
                cleaned_description = re.sub(r"\n|\x0c", " ", description)
                cleaned_description = re.sub(r"\bPOKéMON\b", "pokémon", cleaned_description, flags=re.IGNORECASE)
                _data["description"] = cleaned_description.capitalize()
            else:
                Logger.error("Error retrieving description:", species_response.status_code)

            # Extract evolution chain
            evolution_chain_url = species_data["evolution_chain"]["url"]
            evolution_chain_response = requests.get(evolution_chain_url)
            if evolution_chain_response.status_code == 200:
                evolution_chain_data = evolution_chain_response.json()
                evolution_chain = []
                current_evolution = evolution_chain_data["chain"]
                while True:
                    evolution_chain.append(current_evolution["species"]["name"].capitalize())
                    if not current_evolution["evolves_to"]:
                        break
                    current_evolution = current_evolution["evolves_to"][0]
                _data["evolution"] = evolution_chain
            else:
                Logger.error("Error retrieving evolution chain: ", evolution_chain_response.status_code)

            # Extract ID
            pokemon_id = pokemon_data["id"]
            _data["id"] = pokemon_id
            pokemon_id_str = str(pokemon_id)
            if len(pokemon_id_str) < 4:
              pokemon_id_str = pokemon_id_str.zfill(3)
            _data["poke_id"] = pokemon_id_str
            data.append(_data)
        else:
            Logger.error("Error:", response.status_code)
    end_time = time.time()  # Get the current time after the method has finished
    elapsed_time = end_time - start_time
    print("Time elapse for method generate pokemons: ", elapsed_time / 60)
    return data

if __name__ == '__main__':
    json_file_path = 'pokemons_data.json'
    # Check if the JSON file exists
    if path.exists(json_file_path):
        # The JSON file already exists
        with open(json_file_path, 'r') as file:
            data = json.load(file)
        print('JSON file exists. Loaded the data')
    else:
        # The JSON file doesn't exist, generate it
        data = {}
        pokemon_data = loadPokemonData()
        data["pokemons"] = pokemon_data
        with open(json_file_path, 'w') as file:
            json.dump(data, file, indent=2)
        print('Generated JSON file')
    
    run_server(data["pokemons"])
    