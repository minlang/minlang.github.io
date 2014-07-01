/***
Dictionary object.

Example:
    dict.dictionary = [
        {'word_id': 'word1_id',
         'words': [
            {'lang': 'aa',
             'word': 'word1_aa'},
            {'lang': 'bb',
             'word': 'word1_bb'},
            {'lang': 'cc',
             'word': 'word1_cc'}
          ],
         'category': 'category_name'},
        {'word_id': 'word2_id',
         'words': [
            {'lang': 'aa',
             'word': 'word2_aa'},
            {'lang': 'bb',
             'word': 'word2_bb'},
            {'lang': 'cc',
             'word': 'word2_cc'}
          ],
         'category': 'category_name'}
    ]

***/


function Dictionary() {
    /***
    Create dictionary object.

    ***/
    this.dictionary = [];
}


Dictionary.prototype.filter = function() {
    /***
    Filter dictionary with specified categories.

    Arguments:
        category1, ..., categoryN (string): Category name.

    Returns:
        A dictionary object.

    ***/
    var filteredDictionary = [];

    for (var i = 0; i < this.dictionary.length; i++) {
        // check if current element category is in function arguments
        if ($.inArray(this.dictionary[i].category, arguments) > -1) {
            filteredDictionary.push(this.dictionary[i]);
        }
    }

    this.dictionary = filteredDictionary;

    return this;
};


Dictionary.prototype.set = function(srcLang, destLang) {
    /***
    Create dictionary from specified language.

    Arguments:
        srcLang (str): Source language code (ISO 639-1).
        destLang1, ..., destLangN (str): Destination language code (ISO 639-1).

    ***/
    if (destLang === undefined) {
        throw new ArgumentError('Dictionary.set(): too few arguments.');
    } else {
        // create Dictionary object
        var filename,
            language,
            newDictionary = [];

        /* jshint loopfunc:true */
        for (var i = 0; i < arguments.length; i++) {
            language = arguments[i];
            filename = language + '_wordlist.json';

            $.ajax('/json/' + filename)
                .done(function(wordlist) {
                    var category,
                        words;

                    for (var i = 0; i < wordlist.length; i++) {
                        category = wordlist[i].category;
                        words = wordlist[i].words;

                        for (var word_id in words) {
                            var wordIndex = (function() {
                                // find object with word_id
                                var i = newDictionary.length;
                                while (i--) {
                                    if (newDictionary[i].word_id === word_id) {
                                        return i;
                                    }
                                }
                                return -1;
                            })();

                            if (wordIndex > -1) {
                                // word with word_id exist, add word
                                newDictionary[wordIndex].words.push({
                                    'lang': language,
                                    'word': words[word_id]
                                });
                            } else {
                                // no word in newDictionary, create word object
                                newDictionary.push({
                                    'word_id': word_id,
                                    'words': [{
                                        'lang': language,
                                        'word': words[word_id]
                                    }],
                                    'category': category
                                });
                            }
                        }
                    }
                })
                .fail(function() {
                    throw new Error('Dictionary.set(): can\'t find "' +
                                    filename +
                                    '" wordlist.');
                });
        }

        this.dictionary = newDictionary;
    }

    return this;
};


Dictionary.prototype.shuffle = function() {
    /***
    Shuffle words in dictionary (Fisher-Yates shuffle).

    Returns:
        A dictionary object.

    ***/
    var shuffledDict = this.dictionary,
        FY_shuffle = function(list) {
            var counter = list.length,
                temp,
                index;

            // While there are elements in the list
            while (counter > 0) {
                // Pick a random index
                index = Math.floor(Math.random() * counter);

                // Decrease counter by 1
                counter--;

                // And swap the last element with it
                temp = list[counter];
                list[counter] = list[index];
                list[index] = temp;
            }
            return list;
        };

    // shuffle definitions order
    shuffledDict = FY_shuffle(shuffledDict);

    // shuffle translation order
    for (var i = 0; i < shuffledDict.length; i++) {
        shuffledDict[i].words = FY_shuffle(shuffledDict[i].words);
    }

    this.dictionary = shuffledDict;

    return this;
};

Dictionary.prototype.toHtml = function() {
    /***
    Convert dictionary to html.

    Arguments:
        None.

    Returns:
        A dictionary in html (unordered list, id="wordlist").

    ***/
    var htmlWordlist = '',
        word;

    for (var i = 0; i < this.dictionary.length; i++) {
        word = this.dictionary[i];

        htmlWordlist += '<li><ul>';

        for (var j = 0; j < word.words.length; j++) {
            htmlWordlist += '<li class="word">';
            htmlWordlist += '<span class="lang">';
            htmlWordlist += word.words[j].lang;
            htmlWordlist += '</span>';
            htmlWordlist += word.words[j].word;
            htmlWordlist += '</li>';
        }

        htmlWordlist += '</ul></li>';
    }

    return '<ul id="wordlist">' + htmlWordlist + '</ul>';
};
