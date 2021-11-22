from flask import render_template, flash, Flask
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import InputRequired
import csv
import json
import requests


# org_CSVFilePath = 'organizations.csv'
# allOrg_CSVFilePath = 'allCompanies.csv'
accOrg_CSVFilePath = 'accCompanies.csv'
# org_JsonFilePath = 'json_org.json'
# allOrg_JsonFilePath = 'json_accOrg.json'

# read csv to JSON file
# org_data = {}
allOrg_data = {}
# print('Reload organizations.csv to JSON?')
# yesOrNo = input()
# if yesOrNo == 'y':


# print('loading organizations.csv to DICT...')
# with open(org_CSVFilePath) as CSVFile:
#     CSVReader = csv.DictReader(CSVFile)
#     for rows in CSVReader:
#         chunk = rows['name']
#         org_data[chunk] = rows

print('loading accCompanies.csv to DICT...')
with open(accOrg_CSVFilePath, encoding='utf-8-sig') as CSVFile:
    CSVReader = csv.DictReader(CSVFile)
    for rows in CSVReader:
        chunk = rows['name']
        allOrg_data[chunk] = rows

allOrg_data = {k.lower(): v for k, v in allOrg_data.items()}

# with open(orgJsonFilePath, 'w') as jsonFile:
#     jsonFile.write(json.dumps(org_data, indent=4))

# print('finding all the blank permalinks in allCompanies.csv...')
# for rows in allOrg_data:
#     if allOrg_data[rows]['permalink'] == '#N/A':
#         print(allOrg_data[rows]['name'])


while 1:
    print('Search an org off Crunchbase:')
    orgName = input()
    if orgName in allOrg_data:
        print('Found!')
        URL = ['https://api.crunchbase.com/api/v4/entities/organizations/',
               allOrg_data[orgName]['permalink'],
               '?card_ids=founders,raised_funding_rounds',
               '&field_ids=founded_on',
               '&user_key=c4564ba5932862bc86b28ae5e4397cf7']
        URL = ''.join(URL)
        print(URL)
        r = requests.get(url=URL)
        print(r.json())

    else:
        print('Nope!')

print('done')

# else:
#     print('loading JSON to dict...')
#     with open(orgJsonFilePath) as jsonFile:
#         org_data = json.load(jsonFile)

# print('Reload accCompanies.csv to JSON?')
# yesOrNo = input()
# accOrg_data = {}
# if yesOrNo == 'y':
#     print('loading CSV to JSON...')
#     with open(accOrgCSVFilePath, encoding='utf-8-sig') as CSVFile:
#         CSVReader = csv.DictReader(CSVFile)
#         for rows in CSVReader:
#             chunk = rows['name']
#             accOrg_data[chunk] = rows
#
#     with open(accOrgJsonFilePath, 'w') as jsonFile:
#         jsonFile.write(json.dumps(accOrg_data, indent=4))
#
#     print('done')
#
# else:
#     print('loading JSON to dict...')
#     with open(accOrgJsonFilePath) as jsonFile:
#         accOrg_data = json.load(jsonFile)


app = Flask(__name__)
app.config['SECRET_KEY'] = 'shhh its a secret'


class SearchForm(FlaskForm):
    value = StringField('Type in ', validators=[InputRequired()])
    submit = SubmitField('Submit')


class PullData(FlaskForm):
    update = SubmitField('Update')
    download = SubmitField('Download')


@app.route('/', methods=['GET', 'POST'])
def start():
    searchbar = SearchForm()

    if not searchbar.validate_on_submit():
        flash('Please enter a value')
        return render_template('search.html', form=searchbar)
    else:
        if searchbar.submit.data:
            flash('User Info Updated!')
            return render_template('results.html', form=searchbar)

    return render_template('search.html', form=searchbar)


@app.route('/cb', methods=['GET', 'POST'])
def cb():
    form = PullData()

    return render_template('cb.html', form=form)


@app.route('/li', methods=['GET', 'POST'])
def li():
    form = PullData()

    return render_template('li.html', form=form)


if __name__ == '__main__':
    app.debug = True
    app.run()
