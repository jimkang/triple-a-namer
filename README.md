triple-a-namer
===============

Creates AAA game titles.

Installation
------------

    npm install triple-a-namer

Usage
-----

    var createTripleANamer = require('triple-a-namer');
    var namer = createTripleANamer()
    var nameGroups = namer.name();
    console.log(nameGroups);

Output:

    [ { base: 'sith',
        prefix: 'final',
        suffix: 'evolution',
        ordinal: 'EX remastered' },
      { base: 'squadron',
        prefix: 'stalker',
        preprefix: 'black',
        article: 'the',
        connector: ':' } ]

You can format groups into readable titles like so:

    console.log(namer.assembleGroupsIntoTitle(nameGroups));

Output:

    Final Sith Evolution EX Remastered: The Black Stalker Squadron

If you want to create a namer that uses a random function that creates reproducible outcomes, you can use something like [seedrandom](https://www.npmjs.com/package/seedrandom) and pass it to `create`:

    var seedrandom = require('seedrandom');
    var seed = (new Date()).toISOString();
    var namer = createNamer({
      random: seedrandom(seed)
    });

To try it from the command line rather than as part of a program:

    node node_modules/triple-a-namertools/run-namer.js

Structure
---------

**data/wordpool.json** is a dictionary of words. The value for each word is a list of roles that the word can play in the title. e.g.

    [
      "base",
      "suffix",
      "article-object"
    ]

**namer.js** Loads `wordpool.json` and creates a reverse-indexed dictionary of it, `wordsForTypes` so that it can find words of a type, such as `prefix`. Then, it creates 1-2 word groups, each of which starts with a base, then may add one or two prefixes and a suffix. Then, it sprinkles in "the" or "of" and maybe an ordinal, like "2".

**assemble-groups-into-title** converts an array of groups into a title string.

License
-------

The MIT License (MIT)

Copyright (c) 2015 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
