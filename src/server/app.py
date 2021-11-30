from flask import Flask, jsonify

from sklearn.linear_model import LinearRegression
import pickle

app = Flask(__name__)
model: LinearRegression = pickle.load(open('model.pickle', 'rb'))


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


@app.route('/<int:age>/<int:gender>/<string:bmi>/<int:children>/<int:is_smoker>', methods=['GET'])
def get(age: int, gender: int, bmi: str, children: int, is_smoker: int):
    return jsonify({'charges': model.predict([[age, gender, float(bmi), children, is_smoker]])[0]})


if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port='5000')
