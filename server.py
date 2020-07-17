from flask import Flask, render_template, url_for, redirect, session, request
import util
import data_manager
import os

app = Flask(__name__)
secret_key = os.urandom(16)
app.secret_key = b'secret_key'


@app.route('/')
def index():
    session['NAME'] = "test"
    user = session['NAME']
    print(session['NAME'])
    return render_template('index.html', user=user)


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        plain_password = request.form['password']  
        data = data_manager.get_user_info(email)
        hashed_password = data[0]['password']
        if util.verify_password(plain_password, hashed_password):
            session['NAME'] = data[0]['username']
            return render_template('index.html', user=session['NAME'])
    return render_template('login.html')


@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = util.hash_password(request.form['password'])
        data_manager.register_user(email, password)
        session['NAME'] = email
        return redirect(url_for('index'))
    return render_template('register.html')


@app.route('/logout')
def logout():
    session.pop('NAME', None)
    return redirect(url_for('login'))


if __name__ == "__main__":
    app.run(debug=True)