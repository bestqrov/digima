// MongoDB initialization script for production
db = db.getSiblingDB('arwa-park');

// Create application user
db.createUser({
  user: 'arwa-park-user',
  pwd: 'userpass123', // Change this in production
  roles: [
    {
      role: 'readWrite',
      db: 'arwa-park'
    }
  ]
});

// Create indexes for better performance
db.agencies.createIndex({ "email": 1 }, { unique: true });
db.agencies.createIndex({ "isActive": 1 });
db.agencies.createIndex({ "createdAt": 1 });

db.users.createIndex({ "email": 1, "agencyId": 1 }, { unique: true });
db.users.createIndex({ "agencyId": 1 });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "isActive": 1 });

db.trips.createIndex({ "agencyId": 1 });
db.trips.createIndex({ "status": 1 });
db.trips.createIndex({ "departureDate": 1 });
db.trips.createIndex({ "agencyId": 1, "status": 1 });

db.vehicles.createIndex({ "agencyId": 1 });
db.vehicles.createIndex({ "status": 1 });
db.vehicles.createIndex({ "agencyId": 1, "status": 1 });

db.invoices.createIndex({ "agencyId": 1 });
db.invoices.createIndex({ "status": 1 });
db.invoices.createIndex({ "dueDate": 1 });
db.invoices.createIndex({ "agencyId": 1, "status": 1 });

print('MongoDB production initialization completed successfully!');