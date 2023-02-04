db.createUser({
    user: 'foodapp',
    pwd: 'appfood',
    roles: [
        {
            role: 'readWrite',
            db: 'fooddb'
        }
    ]
});
db.createCollection("demo");