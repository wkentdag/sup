var faker = require('faker');

var makeRandomStatus = function makeRandomStatus() {
  var fakeStatus = {};
  fakeStatus.id = faker.finance.mask();
  // fakeStatus.owner = faker.finance.mask();
  fakeStatus.latitude = faker.address.latitude();
  fakeStatus.longitude = faker.address.longitude();
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

var makeRandomStatusView = function makeRandomStatusView() {
  var sv = {};
  sv.user = faker.random.number(1000);
  sv.status = faker.random.number(1000);

  return sv;
}

module.exports.makeRandomUser = makeRandomUser;
module.exports.makeRandomStatus = makeRandomStatus;
module.exports.makeRandomStatusView = makeRandomStatusView;