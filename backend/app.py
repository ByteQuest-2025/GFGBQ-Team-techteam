# backend/app.py
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import joblib
import numpy as np
import os
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)  # for sessions
# Allow frontend (localhost:5173) to send credentials (cookies)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

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
    password = db.Column(db.String(50), nullable=False)  # plain text (hackathon only)

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    disease = db.Column(db.String(20))  # 'diabetes' or 'hypertension'
    risk_level = db.Column(db.String(10))
    risk_score = db.Column(db.Float)

# ======================
# ML MODEL LOADING
# ======================
diabetes_model = None
if os.path.exists("model.pkl"):
    try:
        diabetes_model = joblib.load("model.pkl")
        print("✅ Diabetes model loaded successfully!")
    except Exception as e:
        print(f"⚠️  Failed to load model.pkl: {e}")

# ======================
# DISEASE PREDICTION LOGIC
# ======================
def predict_diabetes(data):
    """Use trained model if available, else fallback to mock logic."""
    if diabetes_model is not None:
        try:
            features = np.array([[
                int(data["age"]),
                float(data["bmi"]),
                1 if data["physActivity"] else 0,
                int(data["genHlth"]),
                1 if data["highBP"] else 0,
                1 if data["highChol"] else 0,
                1 if data["smoker"] else 0
            ]])
            prob = diabetes_model.predict_proba(features)[0][1]
            risk = "High" if prob >= 0.7 else "Medium" if prob >= 0.3 else "Low"
            return risk, float(prob)
        except Exception as e:
            print(f"ModelError: {e}")
    
    # Fallback mock logic
    score = 0.1
    if data["age"] > 8: score += 0.2      # >60 years
    if data["bmi"] > 30: score += 0.3
    if not data["physActivity"]: score += 0.15
    if data["genHlth"] > 3: score += 0.2
    if data["highBP"]: score += 0.15
    prob = min(score, 0.99)
    risk = "High" if prob >= 0.7 else "Medium" if prob >= 0.3 else "Low"
    return risk, prob

def predict_hypertension(data):
    score = 0.1
    if data["age"] > 7: score += 0.25     # >55 years
    if data["bmi"] > 25: score += 0.2
    if data["highChol"]: score += 0.15
    if data["smoker"]: score += 0.1
    if data["genHlth"] > 3: score += 0.2
    prob = min(score, 0.95)
    risk = "High" if prob >= 0.6 else "Medium" if prob >= 0.3 else "Low"
    return risk, prob

# ======================
# API ROUTES
# ======================
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"success": False, "error": "Missing username or password"}), 400

    user = User.query.filter_by(username=data['username'], password=data['password']).first()
    if user:
        session['user_id'] = user.id
        return jsonify({"success": True, "username": user.username})
    return jsonify({"success": False, "error": "Invalid credentials"}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password required"}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 400

    new_user = User(username=data['username'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": True})

@app.route('/predict', methods=['POST'])
def predict():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

    data = request.get_json()
    if not 
        return jsonify({"error": "No data provided"}), 400

    disease = data.get("disease", "diabetes")
    required_fields = ["age", "bmi", "physActivity", "genHlth", "highBP", "highChol", "smoker"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    # Predict
    if disease == "diabetes":
        risk_level, risk_score = predict_diabetes(data)
    elif disease == "hypertension":
        risk_level, risk_score = predict_hypertension(data)
    else:
        return jsonify({"error": "Unsupported disease"}), 400

    # Save to DB
    pred = Prediction(
        user_id=session['user_id'],
        disease=disease,
        risk_level=risk_level,
        risk_score=risk_score
    )
    db.session.add(pred)
    db.session.commit()

    # Generate advice
    advice = []
    if disease == "diabetes":
        if data["bmi"] > 25:
            advice.append("Lose weight: Even 5-10% body weight loss significantly reduces diabetes risk.")
        if not data["physActivity"]:
            advice.append("Exercise at least 30 minutes daily (e.g., brisk walking).")
        if data["highBP"]:
            advice.append("High blood pressure increases diabetes complications — get it checked.")
        advice.append("Get a blood test: Ask your doctor for fasting glucose or HbA1c screening.")
    else:  # hypertension
        if data["bmi"] > 25:
            advice.append("Lose weight — it directly lowers blood pressure.")
        if data["smoker"]:
            advice.append("Quit smoking — it causes immediate spikes in blood pressure.")
        advice.append("Reduce salt intake and eat more fruits, vegetables, and whole grains.")
        advice.append("Check your blood pressure regularly at a pharmacy or clinic.")

    return jsonify({
        "disease": disease,
        "riskLevel": risk_level,
        "riskScore": round(risk_score, 2),
        "advice": advice
    })

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"success": True})

# ======================
# INITIALIZATION
# ======================
with app.app_context():
    db.create_all()
    # Create demo user
    if not User.query.filter_by(username="demo").first():
        demo_user = User(username="demo", password="hackathon")
        db.session.add(demo_user)
        db.session.commit()
        print("✅ Demo user created: username='demo', password='hackathon'")

# ======================
# RUN
# ======================
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)