# assignment
This code contains 3 APIs:
1. Endpoint: /stats: POST API which will return database stats
2. Endpoint: /getHaiku: GET API which returns unfinished haiku from data randomly
3. Endpoint: /updateHaiku: POST API which updates a line in haiku by giving haikuId, userId, line

MongoDB database for database is created by name : HaikuDB,
Collection name is : Haikus
Sample data is provided in "sampledata.json"

Installation:
1. Download the project
2. In root folder run npm install command
3. Run the file using command : "node index"
4. You can pass mongoDB server url by passing environment variable : "node index MONGO_DB_HOST="your_mongodb_endpoint"
5. This will create a server at localhost:3000 and database will be connected to the specified URL on hitting APIs.
6. For updateHaiku API should be hit by providing haikuId, userId and line in request body.
