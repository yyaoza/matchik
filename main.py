from flask import render_template, flash, Flask
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import InputRequired

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
