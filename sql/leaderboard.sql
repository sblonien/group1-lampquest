--Combine number of planets completed and experience into score for leaderboard
SELECT username, (3 * SUM(completed) + experience) AS score
FROM user NATURAL JOIN planet_user
GROUP BY user_id
ORDER BY score DESC
LIMIT 5;