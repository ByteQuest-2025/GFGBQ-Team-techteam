# backend/app.py
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import joblib
import hashlib
import os
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)  # for session security
# Allow frontend (localhost:5173) to send cookies
# CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# SQLite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ======================
# DATABASE MODELS
# ======================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(64), nullable=False)  # SHA256 = 64 chars

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    disease = db.Column(db.String(20))
    risk_level = db.Column(db.String(10))
    risk_score = db.Column(db.Float)

# ======================
# HELPER: PASSWORD HASHING
# ======================
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ======================
# DISEASE PREDICTION LOGIC
# ======================
def predict_diabetes(data):
    """Use real model if available, else fall back to mock logic."""
    try:
        model = joblib.load("model.pkl")
        # Use plain Python list (no numpy needed)
        features = [[
            int(data["age"]),
            float(data["bmi"]),
            1 if data["physActivity"] else 0,
            int(data["genHlth"]),
            1 if data["highBP"] else 0,
            1 if data["highChol"] else 0,
            1 if data["smoker"] else 0
        ]]
        prob = model.predict_proba(features)[0][1]
        risk = "High" if prob >= 0.7 else "Medium" if prob >= 0.3 else "Low"
        return risk, float(prob)
    except Exception as e:
        print(f"ModelError: {e}")
        # Mock fallback
        score = 0.1
        if data["age"] > 8: score += 0.2
        if data["bmi"] > 30: score += 0.3
        if not data["physActivity"]: score += 0.15
        if data["genHlth"] > 3: score += 0.2
        if data["highBP"]: score += 0.15
        prob = min(score, 0.99)
        risk = "High" if prob >= 0.7 else "Medium" if prob >= 0.3 else "Low"
        return risk, prob

def predict_hypertension(data):
    score = 0.1
    if data["age"] > 7: score += 0.25
    if data["bmi"] > 25: score += 0.2
    if data["highChol"]: score += 0.15
    if data["smoker"]: score += 0.1
    if data["genHlth"] > 3: score += 0.2
    prob = min(score, 0.95)
    risk = "High" if prob >= 0.6 else "Medium" if prob >= 0.3 else "Low"
    return risk, prob

# ======================
# AUTH ROUTES
# ======================
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400
    if len(username) < 3:
        return jsonify({"error": "Username must be at least 3 characters"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    hashed_pw = hash_password(password)
    new_user = User(username=username, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": True})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    if not username or not password:
        return jsonify({"success": False, "error": "Username and password required"}), 400

    hashed_pw = hash_password(password)
    user = User.query.filter_by(username=username, password=hashed_pw).first()
    if user:
        session['user_id'] = user.id
        return jsonify({"success": True, "username": user.username})
    return jsonify({"success": False, "error": "Invalid credentials"}), 401

@app.route('/me', methods=['GET'])
def me():
    if 'user_id' not in session:
        return jsonify({"success": False, "error": "Not logged in"}), 401
    user = User.query.get(session['user_id'])
    if user:
        return jsonify({"success": True, "username": user.username})
    return jsonify({"success": False, "error": "User not found"}), 404

# ======================
# PREDICTION ROUTE
# ======================
@app.route('/predict', methods=['POST'])
def predict():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    disease = data.get("disease", "diabetes")
    required = ["age", "bmi", "physActivity", "genHlth", "highBP", "highChol", "smoker"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    # Convert string inputs to appropriate types
    print(f"Raw data: {data}")
    try:
        data["age"] = int(data["age"])
        data["bmi"] = float(data["bmi"])
        data["genHlth"] = int(data["genHlth"])
        print(f"Converted data: {data}")
    except (ValueError, TypeError) as e:
        print(f"Conversion error: {e}")
        return jsonify({"error": "Invalid data types for age, bmi, or genHlth"}), 400

    if disease == "diabetes":
        # risk_level, risk_score = predict_diabetes(data)
        risk_level, risk_score = "Low", 0.1
    elif disease == "hypertension":
        # risk_level, risk_score = predict_hypertension(data)
        risk_level, risk_score = "Low", 0.1
    else:
        return jsonify({"error": "Unsupported disease. Use 'diabetes' or 'hypertension'"}), 400

    # Save prediction
    # pred = Prediction(
    #     user_id=session['user_id'],
    #     disease=disease,
    #     risk_level=risk_level,
    #     risk_score=risk_score
    # )
    # db.session.add(pred)
    # db.session.commit()

    # Generate medical advice
    advice = []
    # if disease == "diabetes":
    #     if data["bmi"] > 25:
    #         advice.append("Lose weight: Even 5-10% body weight loss significantly reduces diabetes risk.")
    #     if not data["physActivity"]:
    #         advice.append("Exercise at least 30 minutes daily (e.g., brisk walking).")
    #     if data["highBP"]:
    #         advice.append("High blood pressure increases diabetes complications — get it checked.")
    #     advice.append("Get a blood test: Ask your doctor for fasting glucose or HbA1c screening.")
    # else:  # hypertension
    #     if data["bmi"] > 25:
    #         advice.append("Lose weight — it directly lowers blood pressure.")
    #     if data["smoker"]:
    #         advice.append("Quit smoking — it causes immediate spikes in blood pressure.")
    #     advice.append("Reduce salt intake and eat more fruits, vegetables, and whole grains.")
    #     advice.append("Check your blood pressure regularly at a pharmacy or clinic.")

    print(f"About to return: disease={disease}, risk={risk_level}, score={risk_score}")
    return jsonify({
        "disease": disease,
        "riskLevel": risk_level,
        "riskScore": round(risk_score, 2),
        "advice": advice
    })

# ======================
# HISTORY ROUTE
# ======================
@app.route('/history', methods=['GET'])
def history():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401
    predictions = Prediction.query.filter_by(user_id=session['user_id']).order_by(Prediction.id.desc()).all()
    history_data = [{
        "id": p.id,
        "disease": p.disease,
        "risk_level": p.risk_level,
        "risk_score": p.risk_score,
        "timestamp": p.id  # Using id as simple timestamp proxy
    } for p in predictions]
    return jsonify({"history": history_data})

# ======================
# LOGOUT
# ======================
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"success": True})

# ======================
# INIT: CREATE DB + DEMO USER
# ======================
with app.app_context():
    db.create_all()
    # Create demo user if not exists
    if not User.query.filter_by(username="demo").first():
        demo_pw = hash_password("hackathon")
        demo_user = User(username="demo", password=demo_pw)
        db.session.add(demo_user)
        db.session.commit()
        print("✅ Demo user ready: username='demo', password='hackathon'")

# ======================
# RUN
# ======================
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=False)