from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/test', methods=['POST'])
def test():
    data = request.get_json()
    print(f"Received: {data}")
    return jsonify({"message": "Hello", "data": data})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=False)