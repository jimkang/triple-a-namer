var _ = require('lodash');
var exportMethods = require('export-methods');
var jsonfile = require('jsonfile');
var defaultProbable = require('probable');
var assembleGroupsIntoTitle = require('./assemble-groups-into-title');

var wordPool = jsonfile.readFileSync(__dirname + '/data/wordpool.json');

var wordsForTypes = {};

for (var word in wordPool) {
  var types = wordPool[word];
  for (var i = 0; i < types.length; ++i) {
    var type = types[i];
    addWordToTypeList(word, type);
  }
}

function addWordToTypeList(word, type) {
  var list = wordsForTypes[type];
  if (!list) {
    list = [];
    wordsForTypes[type] = list;
  }
  list.push(word);
}

function createNamer(opts) {
  var probable;
  var random;

  if (opts) {
    probable = opts.probable;
    random = opts.random;
  }

  if (!probable) {
    if (random) {
      probable = defaultProbable.createProbable({
        random: random
      });
    }
    else {
      probable = defaultProbable;
    }
  }

  function name() {
    var group1 = addArticlesToGroup(makeGroup(wordsForTypes.base));
    var groups = [group1];

    if (probable.roll(3) === 0) {
      var group2 = addConnectorToGroup(makeGroup(wordsForTypes.base));

      groups.push(group2);
    }

    var group2ConnectedByOf = (group2 && group2.connector === 'of');
    if (!group2ConnectedByOf && probable.roll(3) !== 0) {
      addOrdinalToGroup(group1);
    }

    if (group2 && probable.roll(group1.ordinal ? 10 : 5) === 0) {
      addOrdinalToGroup(group2);
    }

    return groups;
  }

  function makeGroup(bases) {
    var group = {
      base: probable.pickFromArray(bases)
    };

    if (wordPool[group.base].indexOf('cannotbeprefixed') == -1) {
      group.prefix =
        probable.pickFromArray(_.without(wordsForTypes.prefix, group.base));

      if (wordPool[group.prefix].indexOf('cannotbeprefixed') === -1 &&
        probable.roll(5) == 0) {

        group.preprefix = probable.pickFromArray(
          _.without(wordsForTypes.prefix, group.base, group.prefix)
        );
      }
    }

    if (wordPool[group.base].indexOf('cannotattachsuffix') === -1 &&
      probable.roll(10) === 0) {
      
      group.attachedSuffix = probable.pickFromArray(
        _.without(wordsForTypes['attached-suffix'], group.base)
      );
    }

    var suffixChanceBar = 0;

    if (group.prefix) {
      suffixChanceBar += 2;
    }
    if (group.preprefix) {
      suffixChanceBar += 1;
    }

    if (group.attachedSuffix &&
      wordPool[group.attachedSuffix].indexOf('cannotbesuffixed') !== -1) {

      suffixChanceBar = 100;
    }

    if (wordPool[group.base].indexOf('cannotbesuffixed') !== -1) {
      suffixChanceBar = 100;
    }

    if (probable.rollDie(3) > suffixChanceBar) {
      group.suffix = probable.pickFromArray(
        _.without(wordsForTypes.suffix, group.attachedSuffix, group.base)
      );
    }

    return group;    
  }

  function addArticlesToGroup(group) {
    if (wordPool[group.base].indexOf('article-object') !== -1) {
      if (probable.roll(4) === 0) {
        // group.article = (probable.roll(10) === 0 ? 'a' : 'the');
        group.article = 'the';
      }
    }

    return group;
  }

  function addConnectorToGroup(group) {
    if (wordPool[group.base].indexOf('of-object') !== -1 && !group.prefix) {
      if (probable.roll(2) === 0) {
        group.connector = 'of';
      }
    }
    if (!group.connector) {
      group.connector = ':';
    }

    return group;
  }

  function addOrdinalToGroup(group) {
    if (probable.roll(5) === 0) {
      group.ordinal = probable.pickFromArray(wordsForTypes.ordinal);
    }
    else {
      group.ordinal = probable.pickFromArray(wordsForTypes['numeric-ordinal']);
    }

    if (probable.roll(8) === 0) {
      group.ordinal += ' ' + probable.pickFromArray(wordsForTypes.ordinal);
    }
    return group;
  }

  return exportMethods(name, assembleGroupsIntoTitle);
}

module.exports = createNamer;
