from app import predict_diabetes, predict_hypertension

# Test data
data = {
    "age": 3,
    "bmi": 25.0,
    "physActivity": True,
    "genHlth": 2,
    "highBP": False,
    "highChol": False,
    "smoker": False
}

print("Testing diabetes prediction...")
risk, score = predict_diabetes(data)
print(f"Diabetes: Risk={risk}, Score={score}")

print("Testing hypertension prediction...")
risk, score = predict_hypertension(data)
print(f"Hypertension: Risk={risk}, Score={score}")