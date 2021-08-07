var MongoClient = require('mongodb').MongoClient;
const uri = "";//mongodburi
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(function(err, db){
    if (err) throw err;
    console.log("Database connect");
});

function insert(x){
    var myobj = {access_token: x};
    client.db('line_notify').collection('token').insertOne(myobj, function(err, res){
        if (err) throw err;
        console.log("inserted");
    });
}

function gettoken(callback){
    client.db('line_notify').collection('token').find({},{projection: {_id: 0}}).toArray(function(err, result){
        if (err) throw err;
        console.log(result.length);
        callback(result);
    });
}


module.exports = {gettoken , insert};
