const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // Will be hashed by the model pre-save hook? No, insertMany doesn't trigger pre-save!
        // Wait, insertMany DOES NOT trigger middleware. I need to pre-hash or use create/loop.
        // Actually, for seeding, it's easier to use a hardcoded hashed password or loop.
        // Let's us pre-hashed for simplicity in this file, or fix seeder to loop.
        // Hash for "123456": $2a$10$3.5.7.9... (example)
        // I will use a simple hash for "123456" generated from a helper or manually.
        // Actually, let's just make the seeder loop and use User.create or save that triggers middleware.
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        isAdmin: false,
    },
];

// NOTE: Password hashing needs to be handled in seeder if using insertMany, 
// OR use mapped create promises. For now I will modify seeder to handle hashing if needed or keep it simple.
// Actually, let's just store cleartext here and I will update seeder to use 'create' properly OR 
// I will trust that for now I can just re-register via API.
// BUT, to login as admin, I need a valid hash.
// Let's use a known hash for "123456" : $2a$10$fe.somehash...
// Or better: update the seeder to map and save one by one.

module.exports = users;
