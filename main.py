from flask import render_template, flash, Flask, request
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import InputRequired
import csv
import requests

app = Flask(__name__)
app.config['SECRET_KEY'] = 'shhh its a secret'

accOrg_CSVFilePath = 'accCompanies.csv'
allOrg_data = {}

print('loading accCompanies.csv to DICT...')
with open(accOrg_CSVFilePath, encoding='utf-8-sig') as CSVFile:
    CSVReader = csv.DictReader(CSVFile)
    for rows in CSVReader:
        chunk = rows['name']
        allOrg_data[chunk] = rows

allOrg_data = {k.lower(): v for k, v in allOrg_data.items()}


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
    if request.method == "GET":
        return render_template('search.html', form=searchbar)


@app.route('/result', methods=['GET', 'POST'])
def result():
    URL = ['https://api.crunchbase.com/api/v4/entities/organizations/',
           allOrg_data[request.args.get('org')]['permalink'],
               '?card_ids=founders,raised_funding_rounds',
               '&field_ids=founded_on',
               '&user_key=c4564ba5932862bc86b28ae5e4397cf7']
    URL = ''.join(URL)
    print(URL)
    r = requests.get(url=URL)
    return render_template('result.html')


@app.route('/cb', methods=['GET', 'POST'])
def cb():
    form = PullData()

    return render_template('cb.html', form=form)


@app.route('/li', methods=['GET', 'POST'])
def li():
    form = PullData()

    return render_template('li.html', form=form)


if __name__ == '__main__':
    app.run(debug=True)
