# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Allow frontend (Vercel) to call this API

# Load model at startup
MODEL_PATH = "model.pkl"
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"❌ Model not found at {MODEL_PATH}. Did you train it?")

model = joblib.load(MODEL_PATH)
print("✅ ML model loaded successfully!")

@app.route('/')
def home():
    return {"status": "Silent Disease Detector API is running!"}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        # Validate required fields
        required = ["age", "bmi", "physActivity", "genHlth", "highBP", "highChol", "smoker"]
        for field in required:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Convert input to model-ready format (MUST match training order!)
        features = np.array([[
            int(data["age"]),           # Age group (1-13)
            float(data["bmi"]),         # BMI (e.g., 25.4)
            1 if data["physActivity"] else 0,  # Boolean → 0/1
            int(data["genHlth"]),       # General health (1-5)
            1 if data["highBP"] else 0,
            1 if data["highChol"] else 0,
            1 if data["smoker"] else 0
        ]])

        # Get prediction probability
        prob = model.predict_proba(features)[0][1]  # Probability of diabetes risk
        risk_level = "High" if prob >= 0.7 else "Medium" if prob >= 0.3 else "Low"

        return jsonify({
            "success": True,
            "riskLevel": risk_level,
            "riskScore": round(prob, 2),
            "message": f"You may be at {risk_level.lower()} risk of prediabetes or Type 2 Diabetes."
        })

    except (ValueError, TypeError) as e:
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400
    except Exception as e:
        print("🔥 Server error:", e)
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)