# backend/app.py
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ======================
# DATABASE MODELS
# ======================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    disease = db.Column(db.String(20))
    risk_level = db.Column(db.String(10))
    risk_score = db.Column(db.Float)

# ======================
# MOCK PREDICTION LOGIC (Pure Python)
# ======================
def predict_diabetes(data):
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
# API ROUTES (same as before)
# ======================
# ... [keep all route definitions exactly as before] ...
# In /predict, just call predict_diabetes or predict_hypertension

# ======================
# INIT & RUN
# ======================
with app.app_context():
    db.create_all()
    if not User.query.filter_by(username="demo").first():
        demo_user = User(username="demo", password="hackathon")
        db.session.add(demo_user)
        db.session.commit()
        print("✅ Demo user ready")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)