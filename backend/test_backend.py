import urllib.request
import json
import http.cookiejar

# Create a cookie jar to maintain session
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def test_endpoint(url, method='GET', data=None, headers=None):
    try:
        if data:
            data = json.dumps(data).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
        with opener.open(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print(f'{method} {url}: {result}')
            return result
    except Exception as e:
        print(f'Error with {method} {url}: {e}')
        return None

print("=== Testing Backend Endpoints ===\n")

# Test register
print("1. Testing registration...")
test_endpoint('http://localhost:5000/register', 'POST',
             {'username': 'testuser2', 'password': 'testpass'},
             {'Content-Type': 'application/json'})

# Test login (this should establish session)
print("\n2. Testing login...")
login_result = test_endpoint('http://localhost:5000/login', 'POST',
             {'username': 'testuser2', 'password': 'testpass'},
             {'Content-Type': 'application/json'})

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
predict_result = test_endpoint('http://localhost:5000/predict', 'POST',
                              predict_data,
                              {'Content-Type': 'application/json'})

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