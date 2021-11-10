import document as document
from flask import request, render_template, flash, Markup, jsonify, Flask
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import InputRequired

app = Flask(__name__)
app.config['SECRET_KEY'] = 'shhh its a secret'


class SearchForm(FlaskForm):
    value = StringField('Type in ', validators=[InputRequired()])
    submit = SubmitField('Submit')


class CBExecute(FlaskForm):
    update = SubmitField('Update')


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
    update = CBExecute()

    return render_template('cb.html', form=update)


@app.route('/li', methods=['GET', 'POST'])
def li():
    update = CBExecute()

    return render_template('li.html', form=update)


if __name__ == '__main__':
    app.debug = True
    app.run()
