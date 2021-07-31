import requests
import bs4

# get the page
url = "https://www.wikidoc.org/index.php/List_of_surgical_procedures"
page = requests.get(url)

# get the ul element containing the surgeries
soup = bs4.BeautifulSoup(page.content, 'html.parser')
divElement = soup.find("div", attrs={"class":"mw-parser-output"})

aElements = divElement.select_one("ul:nth-of-type(3)").findAll("a")

typesOfSurgeries = []

for aElement in aElements:
    typesOfSurgeries.append(aElement.get_text())

print(typesOfSurgeries)
