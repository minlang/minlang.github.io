describe('Dictionary', function() {
    var result,
        expectedResult,
        testDictionary;

    beforeEach(function() {
        testDictionary = new Dictionary();
        testDictionary.dictionary = [
            {'word1_definition': ['word1_src', 'word1_dest'],
             'category': 'category1'},
            {'word2_definition': ['word2_src', 'word2_dest'],
             'category': 'category2'},
            {'word3_definition': ['word3_src', 'word3_dest'],
             'category': 'category1'}
        ];
    });

    it('is created', function() {
        result = new Dictionary();

        expectedResult = [];

        expect(result.dictionary).toEqual(expectedResult);
    });

    it('shuffle', function() {
        spyOn(Math, 'random').and.returnValue(0);

        testDictionary.dictionary = [1, 2, 3];
        result = testDictionary.shuffle();

        expectedResult = [2, 3, 1];

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


});
