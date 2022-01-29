const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_CONNECTION_STRING;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
var _db;
 
module.exports = {
    connectToServer: function (callback) {
        client.connect(function (err, db) {
            if (db)
            {
                _db = db.db("CustomerDatabase");
                console.log("Connected to MongoDB!");
            }
            return callback(err);
        });
    },
    getDb: function () {
        return _db;
    },
};