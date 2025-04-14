from typing import Literal
import requests
from bs4 import BeautifulSoup
import csv
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
  def __init__(self, stratagem: str, code: list[str]) -> None:
    self.stratagem = stratagem
    self.code = code

  def __str__(self) -> str:
    s = "{"
    s += f"'stratagem': '{self.stratagem}',"
    s += f"'code': {self.code}"
    s += "}"
    return s

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
        data.append(Stratagem(title, code))
      except:
        pass
        # t = article['title'].text.strip() if article['title'] else None
        # if t == None:
        #   continue
        # scraped_data.append({'title': t})

        # title = article.find('h2').text.strip() if article.find('h2') else 'No title'
        # link = article.find('a')['href'] if article.find('a') else 'No link'

    # Save to CSV
    with open('scraped_data.csv', 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['title']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(scraped_data)

    print("Scraping completed successfully!")

except requests.exceptions.RequestException as e:
    print(f"Error fetching the URL: {e}")
except Exception as e:
    print(f"An error occurred: {e}")

for d in data:
  print(d)






