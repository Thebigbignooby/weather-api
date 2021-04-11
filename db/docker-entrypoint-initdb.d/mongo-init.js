
print('Start #################################################################');

db = db.getSiblingDB('dev');
db.createCollection('users'); // explicitly creates 'dev' database
// db.createUser(
//   {
//     user: 'admin',
//     pwd: 'password',
//     roles: [{ role: 'readWrite', db: 'dev' }],
//   },
// );

db = db.getSiblingDB('test');
db.createCollection('users'); // explicitly creates 'test' database
// db.createUser(
//   {
//     user: 'admin',
//     pwd: 'password',
//     roles: [{ role: 'readWrite', db: 'test' }],
//   },
// );

db = db.getSiblingDB('prod');
db.createCollection('users'); // explicitly creates 'prod' database
// db.createUser(
//   {
//     user: 'admin',
//     pwd: 'password',
//     roles: [{ role: 'readWrite', db: 'prod' }],
//   },
// );

print('END #################################################################');