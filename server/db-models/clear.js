const DB_NAME = process.argv[2];

const MongoClient = require('mongodb').MongoClient
// const conn = mongoose.connect();


MongoClient.connect(process.env.DB + DB_NAME).then((client) => {
  const db = client.db(DB_NAME);

  db.dropDatabase().then(() => {
    console.log('database dropped');
    process.exit();
  });
})
