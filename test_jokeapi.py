import requests
import json

url = 'https://sv443.net/jokeapi/v2/joke/Programming'

try:
    r = requests.get(url, timeout=5)
    print(f'Status Code: {r.status_code}')
    
    if r.status_code == 200:
        data = r.json()
        print('\n' + '='*60)
        print('Programming Joke')
        print('='*60)
        print(json.dumps(data, indent=2))
    else:
        print(f'Error: Status {r.status_code}')
        print(f'Response: {r.text}')
except Exception as e:
    print(f'Error: {type(e).__name__}: {e}')
