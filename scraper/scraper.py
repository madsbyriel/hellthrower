from typing import Counter
import requests
import json
from bs4 import BeautifulSoup
# Target URL
url = "http://helldivers.wiki.gg/wiki/Stratagems"

# Send HTTP request
headers = {
    'Host': 'helldivers.wiki.gg',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://www.google.com/',
    'Connection': 'keep-alive',
    'Cookie': 'cf_clearance=OspEPccJBKC8ecTp2guO4g14t4Svt_hemUAvv8XKw.8-1744576822-1.2.1.1-fmhczIiJhqsIWRX03Gl7wlKdLwp19yxJNqzpHKvwYlx04y91QjvrcTIbBKWnMY3bz28siyIQ1JsDaMhv5_v8v0yjHMw7R_J88nxkRm7U.cyIRDVRdaKFEgutHcMS_aEnUqeLYNTp_s5JYCMnYo9rXWhsfCeBiICWSw5fsQpIdlfrCaBH1UCY22UbLhLHVRSPSxg4lTTn2FEJpd6dUvQC2v2oqUUUsWwDG7M43cy2F1VE4UXVzYkuuvISD4Pkru0T3twDCzlS96nFIZB09mgSRaShFTDTpnBTLVEKSrpgBJJrjSxv2Pv2rFwFndPCZdnZnRS.UeTSLloYPNBWfyQ8ugaV6o9pZSDSMVerr9CornU; consentUUID=279fcd78-1b67-4d5f-a8c1-1595969f9214_42; consentDate=2025-04-13T19:04:30.494Z',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'cross-site',
    'Priority': 'u=0, i',
}

class Stratagem:
    counter = 0
    def __init__(self, stratagem: str, code: list[str], link: str) -> None:
        self.stratagem = stratagem
        self.code = code
        self.link = 'https://helldivers.wiki.gg' + link
        self.id = Stratagem.counter
        Stratagem.counter += 1

    def to_dict(self):
        return {'stratagem': self.stratagem, 'code': self.code, 'link': self.link, 'id': self.id}

data = []

try:
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # Raises an HTTPError for bad responses

    # Parse HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Example: Extract all article titles and links
    rows = soup.find_all('tr')  # Adjust selector based on target site

    # Store results
    scraped_data = []

    for row in rows:
      try:
        title = row.find_all('td')[1].find('a')['title']
        src = row.find_all('td')[0].find('img')['src']
        images = row.find_all('td')[2].find_all('img')
        code = []
        for image in images:
          inp = None
          if image['alt'] == 'Up Arrow.png':
            inp = 'U'
          elif image['alt'] == 'Down Arrow.png':
            inp = 'D'
          elif image['alt'] == 'Left Arrow.png':
            inp = 'L'
          elif image['alt'] == 'Right Arrow.png':
            inp = 'L'
          code.append(inp)
        data.append(Stratagem(title, code, src))
      except:
        pass

except requests.exceptions.RequestException as e:
    print(f"Error fetching the URL: {e}")
except Exception as e:
    print(f"An error occurred: {e}")


with open("stratagems.json", "w+") as f:
    json.dump([d.to_dict() for d in data], f)

with open("download_links.sh", "w+") as f:
    f.write("#!/usr/bin/env bash\n")
    f.writelines([f"curl {d.link} -o {d.id}.png\n" for d in data])
