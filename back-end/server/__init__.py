from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_cors import CORS

app = Flask(__name__) # Represents the name of the file 
CORS(app)

db = SQLAlchemy()
DB_NAME = "database.db"