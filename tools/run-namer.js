var createNamer = require('../namer');
var seedrandom = require('seedrandom');

var seed = (new Date()).toISOString();
// seed = '2015-04-12T23:47:30.741Z';
console.log('seed:', seed);

var namer = createNamer({
  random: seedrandom(seed)
});

for (var i = 0; i < 10; ++i) {
  var nameGroups = namer.name();
  console.log(nameGroups);
  console.log(namer.assembleGroupsIntoTitle(nameGroups));
}
