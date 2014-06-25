/***
Dictionary object.

Example:
    dict.dictionary = [
        {'word_id': 'word1_key',
         'words': ['word1_src', 'word1_dest1', 'word1_dest2'],
         'category': 'category_name'},
        {'word_key': 'word2_key',
         'words': ['word2_src', 'word2_dest1', 'word2_dest2'],
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
        if (jQuery.inArray(this.dictionary[i].category, arguments) > -1) {
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
        throw new Error('Dictionary.set(): too few arguments.');
    } else {
        // create Dictionary object
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
    var htmlWordlist = '';

    for (var word in this.source) {
        htmlWordlist += '<li class="src_word">' +
                    this.source.word +
                    '</li>';
        htmlWordlist += '<li class="dest_word">' +
                    this.destination.word +
                    '</li>';
    }

    return '<ul id="wordlist">' + htmlWordlist + '</ul>';
};
