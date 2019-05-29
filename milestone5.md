Storyboards: Our target uesr population is self media who just get started or already have some experience. For self media, attracting as many viewers as possible is one of an important standards for measuring their success. For a novice self media, they might not know how to write an article that attract people's attention, they can thus go to our "article" section to see those popular examples and learn from them. For anyone who seek to see how other people think about writing good we media articles, they can go to "daily push" section to see the most updated share post about writing. In addition, if it's difficult for them to capture hot topic and find good material to write about, they can go to our "trend" section to see current day's hot topic and read about relevant news.

Improvement:
1. In article section, We enabled "expand" button that user could click on "expand" to view more or all articles from our database.
2. We added a new section called "Daily skill push", which shows you the latest article post about "how to write a good article", this section will be updated once a day.
3. We added a new section called "Daily hit", which uses the data from our database to do some calculation and show statistics about top
popular articles. The statistics is derived from the database, thus once database is updated, the statistics will be updated.

Data visualization: We used Handlebars as our templating engine and Express as our backend. For the API we used, we call the API in backend and directly render template using res.render. For sqlite database, we call ajax call in the front-end and return generating HTML using string concat. when the ajax call completes successfully.

Next step:
1. For our next step, we will not only display current day's trends, but also save the trends in the past three days and display them. In the bookmark page, we will split their bookmarks into 2 sections: trends and articles so that they can find what they want more easily.
2. We hope to change the UI layout and color scheme to be more consistent and pretty.
3. We may enable users to upload their articles into another section called "Training articles", and enable others to comment on it. But This step might need to use other cloud database, for example, firebase.

More ambitious data display or visualization ideas:
1. We need better datasets for our database. Now, our dataset comes from Kaggle open source which collects articles from Medium website. We hope we could also get datasets from more than five websites, for example, Quora, Reddit. By doing this, our database will be more inclusive
and representative.

2. We hope our dataset contains not only the columns we have now, but also have other columns like "article_category","article_trend","share_number","article_layout","title_structure". Then, we could make use those columns to get more statistics for "Daily hit" section, to make it more powerful and inclusive, and informative. And give user a better feeling of "catching up
with the latest information".

User Action1: Bookmark article/news that you like; Delete bookmarked article.
User Action2: Sort articles on home page based on different criteria.
User Action3: Expand to see more articles.

General UI screenshots:
![homepage](https://github.com/Hannahh1425/cogs121/blob/master/M5/home1.jpg)
![homepage](https://github.com/Hannahh1425/cogs121/blob/master/M5/home2.jpg)
![news page](https://github.com/Hannahh1425/cogs121/blob/master/M5/news.jpg)
![bookmark page](https://github.com/Hannahh1425/cogs121/blob/master/M5/bookmark.jpg)

Visualizatino of data:
![homepage](https://github.com/Hannahh1425/cogs121/blob/master/M5/home1.jpg)
![homepage](https://github.com/Hannahh1425/cogs121/blob/master/M5/home1.jpg)
![homepage](https://github.com/Hannahh1425/cogs121/blob/master/M5/home1.jpg)
