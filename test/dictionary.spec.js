describe('Dictionary', function() {
    var result,
        expectedResult,
        testDictionary,
        ajaxSpy;

    beforeEach(function() {
        testDictionary = new Dictionary();
        testDictionary.dictionary = [
            {'word_id': 'word1_id',
             'words': [
                {'lang': 'aa',
                 'word': 'word1_aa'},
                {'lang': 'bb',
                 'word': 'word1_bb'},
                {'lang': 'cc',
                 'word': 'word1_cc'}
             ],
             'category': 'category1'},
            {'word_id': 'word2_id',
             'words': [
                {'lang': 'aa',
                 'word': 'word2_aa'},
                {'lang': 'bb',
                 'word': 'word2_bb'},
                {'lang': 'cc',
                 'word': 'word2_cc'}
             ],
             'category': 'category1'},
            {'word_id': 'word3_id',
             'words': [
                {'lang': 'aa',
                 'word': 'word3_aa'},
                {'lang': 'bb',
                 'word': 'word3_bb'},
                {'lang': 'cc',
                 'word': 'word3_cc'}
             ],
             'category': 'category2'}
        ];

        spyOn($, 'ajax').and.callFake(function(url) {
            var ajaxMock = $.Deferred();
            switch (url) {
                case '/json/aa_wordlist.json':
                    ajaxMock.resolve([
                        {
                            'category': 'category1',
                            'words': {
                                'word1_id': 'word1_aa',
                                'word2_id': 'word2_aa'
                            }
                        },
                        {
                            'category': 'category2',
                            'words': {
                                'word3_id': 'word3_aa'
                            }
                        }
                    ]);
                    break;
                case '/json/bb_wordlist.json':
                    ajaxMock.resolve([
                        {
                            'category': 'category1',
                            'words': {
                                'word1_id': 'word1_bb',
                                'word2_id': 'word2_bb'
                            }
                        },
                        {
                            'category': 'category2',
                            'words': {
                                'word3_id': 'word3_bb'
                            }
                        }
                    ]);
                    break;
                case '/json/cc_wordlist.json':
                    ajaxMock.resolve([
                        {
                            'category': 'category1',
                            'words': {
                                'word1_id': 'word1_cc',
                                'word2_id': 'word2_cc'
                            }
                        },
                        {
                            'category': 'category2',
                            'words': {
                                'word3_id': 'word3_cc'
                            }
                        }
                    ]);
                    break;
                default:
                    ajaxMock.reject();
            }
            return ajaxMock.promise();
        });
    });

    it('is created', function() {
        result = new Dictionary();

        expectedResult = [];

        expect(result.dictionary).toEqual(expectedResult);
    });

    it('is set', function() {
        var newDictionary = new Dictionary();
        result = newDictionary.set('aa', 'bb');

        expectedResult = [
            {
                'word_id': 'word1_id',
                'words': [
                    {'lang': 'aa',
                     'word': 'word1_aa'},
                    {'lang': 'bb',
                     'word': 'word1_bb'}
                ],
                'category': 'category1'
            },
            {
                'word_id': 'word2_id',
                'words': [
                    {'lang': 'aa',
                     'word': 'word2_aa'},
                    {'lang': 'bb',
                     'word': 'word2_bb'}
                ],
                'category': 'category1'
            },
            {
                'word_id': 'word3_id',
                'words': [
                    {'lang': 'aa',
                     'word': 'word3_aa'},
                    {'lang': 'bb',
                     'word': 'word3_bb'}
                ],
                'category': 'category2'
            }
        ];

        expect(result.dictionary).toEqual(expectedResult);
    });

    it('is set with many languages', function() {
        var newDictionary = new Dictionary();
        result = newDictionary.set('aa', 'bb', 'cc');

        expectedResult = testDictionary;

        expect(result.dictionary).toEqual(expectedResult.dictionary);
    });

    it('is set with non-exist language', function() {
        result = function() {
            testDictionary.set('aa', 'zz');
        };

        expect(result).toThrowError(
            'Dictionary.set(): can\'t find "zz_wordlist.json" wordlist.');
    });

    it('is set with one language', function() {
        result = function() {
            testDictionary.set('aa');
        };

        expect(result).toThrowError('Dictionary.set(): too few arguments.');
    });

    it('is set without any languages', function() {
        result = function() {
            testDictionary.set();
        };

        expect(result).toThrowError('Dictionary.set(): too few arguments.');
    });

    it('is shuffled', function() {
        spyOn(Math, 'random').and.returnValue(0);

        result = testDictionary.shuffle();

        expectedResult = [
            {'word_id': 'word2_id',
             'words': [
                {'lang': 'bb',
                 'word': 'word2_bb'},
                {'lang': 'cc',
                 'word': 'word2_cc'},
                {'lang': 'aa',
                 'word': 'word2_aa'}
             ],
             'category': 'category1'},
            {'word_id': 'word3_id',
             'words': [
                {'lang': 'bb',
                 'word': 'word3_bb'},
                {'lang': 'cc',
                 'word': 'word3_cc'},
                {'lang': 'aa',
                 'word': 'word3_aa'}
             ],
             'category': 'category2'},
            {'word_id': 'word1_id',
             'words': [
                {'lang': 'bb',
                 'word': 'word1_bb'},
                {'lang': 'cc',
                 'word': 'word1_cc'},
                {'lang': 'aa',
                 'word': 'word1_aa'}
             ],
             'category': 'category1'}
        ];

        expect(result.dictionary).toEqual(expectedResult);
    });

    it('is filtered by one category', function() {
        result = testDictionary.filter('category1');

        expectedResult = 2;

        expect(result.dictionary.length).toEqual(expectedResult);
    });

    it('is filtered by non-exist category', function() {
        result = testDictionary.filter('category999');

        expectedResult = 0;

        expect(result.dictionary.length).toEqual(expectedResult);
    });

    it('is filtered by many categories', function() {
        result = testDictionary.filter('category1', 'category2');

        expectedResult = 3;

        expect(result.dictionary.length).toEqual(expectedResult);
    });

    it('is filtered with no category', function() {
        result = testDictionary.filter();

        expectedResult = 0;

        expect(result.dictionary.length).toEqual(expectedResult);
    });

    it('is printed as html list', function() {
        result = testDictionary.toHtml();

        expectedResult = '<ul id="wordlist"><li><ul><li class="word"><span class="lang">aa</span>word1_aa</li><li class="word"><span class="lang">bb</span>word1_bb</li><li class="word"><span class="lang">cc</span>word1_cc</li></ul></li><li><ul><li class="word"><span class="lang">aa</span>word2_aa</li><li class="word"><span class="lang">bb</span>word2_bb</li><li class="word"><span class="lang">cc</span>word2_cc</li></ul></li><li><ul><li class="word"><span class="lang">aa</span>word3_aa</li><li class="word"><span class="lang">bb</span>word3_bb</li><li class="word"><span class="lang">cc</span>word3_cc</li></ul></li></ul>';

        expect(result).toEqual(expectedResult);
    });

});
