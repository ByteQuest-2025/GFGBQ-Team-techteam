import requests
import json

# Test prediction without login first
url = 'http://localhost:5000/predict'
data = {
    'disease': 'diabetes',
    'age': 3,
    'bmi': 25.0,
    'physActivity': True,
    'genHlth': 2,
    'highBP': False,
    'highChol': False,
    'smoker': False
}
try:
    response = requests.post(url, json=data)
    print('Status:', response.status_code)
    print('Response:', response.json())
except Exception as e:
    print('Error:', e)