var faker = require('faker');

var makeRandomStatus = function makeRandomStatus() {
  var fakeStatus = {};
  fakeStatus.id = faker.finance.mask();
  fakeStatus.owner = faker.finance.mask();
  fakeStatus.loc = faker.address.longitude() + " " + faker.address.latitude();
  fakeStatus.time = faker.random.number(60);
  return fakeStatus;
}

var makeRandomUser = function makeRandomUser() {
  var fakeUser = {};
  fakeUser.id = faker.finance.mask();
  fakeUser.name = faker.name.firstName();
  fakeUser.email = faker.internet.email();
  return fakeUser;
}

module.exports.makeRandomUser = makeRandomUser;
module.exports.makeRandomStatus = makeRandomStatus;