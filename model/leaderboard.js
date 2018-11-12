let pool = require('../scripts/db_connection.js').connection_pool; //for db connection

class Leaderboard {
    constructor() {

    }

    getScores(callback) {
        let sql = "SELECT @row := @row + 1 AS place, username, score FROM (SELECT username, (3 * SUM(completed) + experience) AS score \
            FROM user NATURAL JOIN planet_user \
            GROUP BY user_id \
            ORDER BY score DESC \
            LIMIT 5) u, (select @row := 0) r;";

        // let sql = "SELECT username, (3 * SUM(completed) + experience) AS score \
        //             FROM user NATURAL JOIN planet_user \
        //             GROUP BY user_id \
        //             ORDER BY score DESC \
        //             LIMIT 5;";

        pool.getConnection(function(con_err, con) {
            if(con_err) {
                console.log("Error - " + Date() + "\nUnable to connect to database.");
                callback(con_err);
                return;
            }
            
            con.query(sql, function(err, result) {
                if(err) {
                    console.log('Error encountered on ' + Date());
                    console.log(err);
                    callback(err);
                    con.release();
                    return;
                }
                
                console.log(result);
                callback(null, result);
                con.release();
            });
        });
    }
}

module.exports = Leaderboard;