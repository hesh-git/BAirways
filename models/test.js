const test = function(con, callback) {
    let sql = `INSERT INTO State(ID, NAME) VALUES (2, 'past')`;
    con.query(sql, callback);
}

module.exports = {
    test
}