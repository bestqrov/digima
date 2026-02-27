// MongoDB initialization script for development
db = db.getSiblingDB('arwa-park-dev');

// Create application user
db.createUser({
  user: 'arwa-park-dev-user',
  pwd: 'devpass123',
  roles: [
    {
      role: 'readWrite',
      db: 'arwa-park-dev'
    }
  ]
});

// Create indexes for better performance (same as production)
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

// Insert sample data for development
db.agencies.insertOne({
  name: "Sample Travel Agency",
  email: "admin@sampleagency.com",
  subscriptionPlan: "PREMIUM",
  isActive: true,
  address: "123 Travel Street, City, Country",
  phone: "+1234567890",
  website: "https://sampleagency.com",
  createdAt: new Date(),
  updatedAt: new Date()
});

print('MongoDB development initialization completed successfully!');