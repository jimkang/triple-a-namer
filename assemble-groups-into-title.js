var _ = require('lodash');
var toTitleCase = require('titlecase');

function assembleGroupsIntoTitle(groups) {
  var subtitles = groups.map(assembleGroupIntoSubtitle);
  var title = subtitles.join(' ');
  // Hack.
  title = title.replace(' : ', ': ');
  return toTitleCase(title);
}

var groupPropertiesInOrder = [
  'connector',
  'article',
  'preprefix',
  'prefix',
  'base',
  'suffix',
  'ordinal'
];

function assembleGroupIntoSubtitle(group) {
  var groupCopy = _.cloneDeep(group);
  if (groupCopy.attachedSuffix) {
    groupCopy.base += groupCopy.attachedSuffix;
  }
  var appendIfExists = _.curry(appendPropToString)(groupCopy);
  return groupPropertiesInOrder.reduce(appendIfExists, '');
}

function appendPropToString(group, s, property) {
  if (property in group) {
    if (s.length > 0) {
      s += ' ';
    }
    s += group[property];
  }
  return s;
}

module.exports = assembleGroupsIntoTitle;
