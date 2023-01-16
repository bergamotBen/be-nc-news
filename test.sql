SELECT * FROM articles;
q

SELECT  article_id, COUNT(*) AS "number_of_comments"
FROM comments
GROUP BY article_id
RIGHT JOIN articles ON comments.article_id = articles.article_id;

SELECT * FROM articles
LEFT JOIN article_id COUNT(*) AS "Number of Comments"
FROM comments
GROUP BY article_id

SELECT * FROM articles
JOIN article_id COUNT(*) AS "Number of Comments"
FROM comments
GROUP BY article_id