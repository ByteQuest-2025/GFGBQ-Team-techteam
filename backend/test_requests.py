import requests

# Create a session to maintain cookies
session = requests.Session()

def test_endpoint(url, method='GET', data=None):
    try:
        if method == 'POST':
            response = session.post(url, json=data)
        else:
            response = session.get(url)
        if response.status_code == 200:
            result = response.json()
            print(f'{method} {url}: {result}')
            return result
        else:
            print(f'Error {method} {url}: HTTP {response.status_code}')
            return None
    except Exception as e:
        print(f'Error with {method} {url}: {e}')
        return None

print("=== Testing Backend Endpoints ===\n")

# Test register
print("1. Testing registration...")
test_endpoint('http://localhost:5000/register', 'POST',
             {'username': 'testuser4', 'password': 'testpass'})

# Test login (this should establish session)
print("\n2. Testing login...")
login_result = test_endpoint('http://localhost:5000/login', 'POST',
             {'username': 'testuser4', 'password': 'testpass'})

# Test me (should work now with session)
print("\n3. Testing /me endpoint...")
test_endpoint('http://localhost:5000/me')

# Test prediction
print("\n4. Testing prediction...")
predict_data = {
    "disease": "diabetes",
    "age": "3",  # 30-34
    "bmi": "25.0",
    "physActivity": True,
    "genHlth": "2",
    "highBP": False,
    "highChol": False,
    "smoker": False
}
predict_result = test_endpoint('http://localhost:5000/predict', 'POST', predict_data)

# Test history
print("\n5. Testing history...")
test_endpoint('http://localhost:5000/history')

# Test logout
print("\n6. Testing logout...")
test_endpoint('http://localhost:5000/logout', 'POST')

# Test me after logout (should fail)
print("\n7. Testing /me after logout...")
test_endpoint('http://localhost:5000/me')

print("\n=== All tests completed ===")