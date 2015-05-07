var faker = require('faker');

var makeRandomStatus = function makeRandomStatus() {
  var fakeStatus = {};
  fakeStatus.owner_id = faker.finance.mask();
  fakeStatus.latitude = faker.address.latitude();
  fakeStatus.longitude = faker.address.longitude();
  fakeStatus.duration = getRandomInt(5, 1000);
  return fakeStatus;
}

var makeRandomUser = function makeRandomUser() {
  var fakeUser = {};
  fakeUser.first_name = faker.name.firstName();
  fakeUser.last_name = faker.name.lastName();
  fakeUser.phone =   getRandomInt(100000000000000, 999999999999999).toString();
  return fakeUser;
}

var makeRandomStatusView = function makeRandomStatusView() {
  var sv = {};
  sv.user = faker.random.number(1000);
  sv.status = faker.random.number(1000);
  return sv;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.makeRandomUser = makeRandomUser;
module.exports.makeRandomStatus = makeRandomStatus;
module.exports.makeRandomStatusView = makeRandomStatusView;