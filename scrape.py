



import pandas as pd
import numpy as np
import requests
import bs4
from bs4 import BeautifulSoup
import sqlite3

wiki = 'https://medium.com/search?q=how%20to%20write%20a%20good%20article'
page = requests.get(wiki)
soup = BeautifulSoup(page.content, 'html.parser')

container_link = soup.findAll("div",{"class":"postArticle-content"})
container_title = soup.findAll("div",{"class":"section-inner"})
container_author = soup.findAll("div",{"class":"postMetaInline-authorLockup"})

link_1 = (container_link[0].a)['href']
link_2 = (container_link[1].a)['href']
link_3 = (container_link[2].a)['href']

title_1 = container_title[0].h3.text
title_2 = container_title[1].h3.text
title_3 = container_title[2].h3.text

author_1 = container_author[0].a.text
author_2 = container_author[1].a.text
author_3 = container_author[2].a.text

d = {'title': [title_1,title_2,title_3], 'author': [author_1, author_2, author_3],'link':[link_1,link_2,link_3]}
df = pd.DataFrame(data=d)

# df.to_json('TestNPM/scrap.json', orient='records')
# print("RUN python finished!")

conn = sqlite3.connect('writing_article.db')
df.to_sql("new_article", conn, if_exists="replace")
print("RUN python finished!")
