import requests
import urllib3
import json

urllib3.disable_warnings()

headers = {
    'x-rapidapi-key': '464904a577msh876ead2022a9329p17b5e8jsnaba58acf56e6',
    'x-rapidapi-host': 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com'
}

url = 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random'

try:
    r = requests.get(url, headers=headers, timeout=5, verify=False)
    print(f'Status Code: {r.status_code}')
    print(f'\nResponse Text Length: {len(r.text)}')
    print(f'Response Text: {r.text[:1000]}')
    
    if r.status_code == 200:
        try:
            data = r.json()
            print('\n' + '='*60)
            print('Chuck Norris Joke')
            print('='*60)
            print(json.dumps(data, indent=2))
        except:
            print('Response is not valid JSON')
except Exception as e:
    print(f'Error: {type(e).__name__}: {e}')
