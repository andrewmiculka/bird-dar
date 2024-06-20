from flask import Flask
from flask_cors import CORS
import ebird.api as ebird_api
from dotenv import load_dotenv
import os

load_dotenv()

EBIRD_API_KEY = os.getenv('EBIRD_API_KEY')
TEXAS_REGION_CODE = 'US-TX'

app = Flask(__name__)
app.config.from_object(__name__)

CORS(app, resources={r'/*': {'origins': '*'}})

@app.get('/observations/')
@app.get('/observations/<region>')
def getObservations(region=TEXAS_REGION_CODE):
    records = ebird_api.get_observations(EBIRD_API_KEY, region, 30, category='species')
    return records

@app.get('/species/<species>/region/<region>')
def getSpeciesInRegion(species, region):
    print('inside!')
    print('species = ', species, ' || region = ', region)
    records = ebird_api.get_species_observations(EBIRD_API_KEY, species, region, 30)
    return records

@app.get('/states')
def getStates():
    states = ebird_api.get_regions(EBIRD_API_KEY, 'subnational1', 'US')
    return states
    

if __name__ == '__main__':
    app.run()
