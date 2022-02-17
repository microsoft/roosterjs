import * as TestHelper from '../TestHelper';
import changeCapitalization from '../../lib/format/changeCapitalization';
import { Browser } from 'roosterjs-editor-dom';
import { Capitalization, IEditor } from 'roosterjs-editor-types';
describe('changeCapitalization()', () => {
    let testID = 'changeCapitalization';
    let editor: IEditor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    function runTest(
        source: string,
        expected: string,
        capitalization: Capitalization,
        language?: string
    ) {
        editor.setContent(source);
        TestHelper.selectNode(document.getElementById('divToTest'));
        changeCapitalization(editor, capitalization, language);
        let result = editor.getContent();
        expect(result).toBe(expected);
    }

    // Basic functionality tests
    TestHelper.itFirefoxOnly('UPPERCASE', () => {
        runTest(
            '<div id="divToTest">text</div>',
            '<div id="divToTest"><span>TEXT</span></div>',
            Capitalization.Uppercase
        );
    });

    TestHelper.itFirefoxOnly('lowercase', () => {
        runTest(
            '<div id="divToTest">TEXT</div>',
            '<div id="divToTest"><span>text</span></div>',
            Capitalization.Lowercase
        );
    });

    TestHelper.itFirefoxOnly('Capitalize Each Word', () => {
        runTest(
            '<div id="divToTest">text</div>',
            '<div id="divToTest"><span>Text</span></div>',
            Capitalization.CapitalizeEachWord
        );
    });

    TestHelper.itFirefoxOnly('Capitalize Each Word from lowercase', () => {
        runTest(
            '<div id="divToTest">first second third</div>',
            '<div id="divToTest"><span>First Second Third</span></div>',
            Capitalization.CapitalizeEachWord
        );
    });

    TestHelper.itFirefoxOnly('Capitalize Each Word from UPPERCASE', () => {
        runTest(
            '<div id="divToTest">FIRST SECOND THIRD</div>',
            '<div id="divToTest"><span>First Second Third</span></div>',
            Capitalization.CapitalizeEachWord
        );
    });

    TestHelper.itFirefoxOnly('Sentence case from UPPERCASE', () => {
        runTest(
            '<div id="divToTest">WHAT IS IT? PLEASE. I NEED TO KNOW! ANOTHER SENTENCE.</div>',
            '<div id="divToTest"><span>What is it? Please. I need to know! Another sentence.</span></div>',
            Capitalization.Sentence
        );
    });

    TestHelper.itFirefoxOnly('Sentence case does not capitalize URLS', () => {
        runTest(
            '<div id="divToTest">example: www.contoso.com is not capitalized but. aww is.</div>',
            '<div id="divToTest"><span>Example: www.contoso.com is not capitalized but. Aww is.</span></div>',
            Capitalization.Sentence
        );
    });

    // Style and markup tests
    TestHelper.itFirefoxOnly(
        'styled content will retain styling after changing capitalization',
        () => {
            runTest(
                '<div id="divToTest" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><b>Text</b></div>',
                '<div id="divToTest" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><span><b>TEXT</b></span></div>',
                Capitalization.Uppercase
            );
        }
    );

    TestHelper.itFirefoxOnly('will retain list format when changing capitalization', () => {
        runTest(
            '<div id="divToTest"><ul><li><span>coffee</span></li><li><span>tea<span></li></ul></div>',
            '<div id="divToTest"><ul><li><span>COFFEE</span></li><li><span>TEA</span><span><span></span></span></li></ul></div>',
            Capitalization.Uppercase
        );
    });

    TestHelper.itFirefoxOnly('Multi line is respected', () => {
        runTest(
            '<div id="divToTest">This is<br>a test</div>',
            '<div id="divToTest"><span>THIS IS</span><br><span>A TEST</span></div>',
            Capitalization.Uppercase
        );
    });

    TestHelper.itFirefoxOnly('Hyperlink is not affected', () => {
        runTest(
            '<div id="divToTest">This is a <a href="http://contoso.com" title="http://contoso.com">test</a></div>',
            '<div id="divToTest"><span>THIS IS A </span><a href="http://contoso.com" title="http://contoso.com"><span>TEST</span></a></div>',
            Capitalization.Uppercase
        );
    });

    TestHelper.itFirefoxOnly('<IMG> is not affected', () => {
        runTest(
            '<div id="divToTest"><img src="test" width="100%">see the image above</div>',
            '<div id="divToTest"><img src="test" width="100%"><span>See The Image Above</span></div>',
            Capitalization.CapitalizeEachWord
        );
    });

    // Internationalization tests
    TestHelper.itFirefoxOnly(
        'works without a language passed when the character mapping is clear',
        () => {
            runTest(
                '<div id="divToTest">ılık ısırgan ışık</div>',
                '<div id="divToTest"><span>ILIK ISIRGAN IŞIK</span></div>',
                Capitalization.Uppercase
            );
        }
    );

    TestHelper.itFirefoxOnly('works with an invalid string passed for language', () => {
        runTest(
            '<div id="divToTest">first second third</div>',
            '<div id="divToTest"><span>First Second Third</span></div>',
            Capitalization.CapitalizeEachWord,
            '2y3'
        );
    });

    TestHelper.itFirefoxOnly(
        'does not affect uncased languages even when a cased language is passed',
        () => {
            runTest(
                '<div id="divToTest">לשון הקודש</div>',
                '<div id="divToTest"><span>לשון הקודש</span></div>',
                Capitalization.Uppercase,
                'es'
            );
        }
    );

    TestHelper.itFirefoxOnly('Turkish undotted lowercase undotted to uppercase I', () => {
        runTest(
            '<div id="divToTest">ılık ısırgan ışık</div>',
            '<div id="divToTest"><span>ILIK ISIRGAN IŞIK</span></div>',
            Capitalization.Uppercase,
            'tr'
        );
    });

    TestHelper.itFirefoxOnly('Turkish undotted uppercase dotted to lowercase ı', () => {
        runTest(
            '<div id="divToTest">ILIK ISIRGAN IŞIK</div>',
            '<div id="divToTest"><span>ılık ısırgan ışık</span></div>',
            Capitalization.Lowercase,
            'tr'
        );
    });

    TestHelper.itFirefoxOnly('Greek Σ to lowercase: σ OR ς if terminating a word', () => {
        runTest(
            '<div id="divToTest">Σ IS A GREEK LETTER AND APPEARS IN ΟΔΥΣΣΕΥΣ.</div>',
            '<div id="divToTest"><span>σ is a greek letter and appears in οδυσσευς.</span></div>',
            Capitalization.Lowercase,
            'el'
        );
    });

    TestHelper.itFirefoxOnly('German ß to uppercase', () => {
        runTest(
            '<div id="divToTest">grüßen</div>',
            '<div id="divToTest"><span>GRÜSSEN</span></div>',
            Capitalization.Uppercase,
            'de'
        );
    });

    TestHelper.itFirefoxOnly('Spanish special characters', () => {
        runTest(
            '<div id="divToTest">A sus órdenes señora</div>',
            '<div id="divToTest"><span>A SUS ÓRDENES SEÑORA</span></div>',
            Capitalization.Uppercase,
            'es'
        );
    });

    xit('CapitalizeEachWord in table selection', () => {
        runTest(
            '<div id="divToTest">' + TestHelper.tableSelectionContents[0] + '</div>',
            Browser.isFirefox
                ? '<div id="divToTest"><table style="border-collapse: collapse;" class="_tableSelected" cellspacing="0" cellpadding="1"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table></div>'
                : '<div id="divToTest"><table cellspacing="0" cellpadding="1" style="border-collapse: collapse;" class="_tableSelected"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table></div>',
            Capitalization.CapitalizeEachWord
        );
    });

    xit('Lowercase in table selection', () => {
        runTest(
            '<div id="divToTest">' + TestHelper.tableSelectionContents[0] + '</div>',
            Browser.isFirefox
                ? '<div id="divToTest"><table style="border-collapse: collapse;" class="_tableSelected" cellspacing="0" cellpadding="1"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table></div>'
                : '<div id="divToTest"><table cellspacing="0" cellpadding="1" style="border-collapse: collapse;" class="_tableSelected"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table></div>',
            Capitalization.Lowercase
        );
    });

    xit('Sentence in table selection', () => {
        runTest(
            '<div id="divToTest">' + TestHelper.tableSelectionContents[0] + '</div>',
            Browser.isFirefox
                ? '<div id="divToTest"><table style="border-collapse: collapse;" class="_tableSelected" cellspacing="0" cellpadding="1"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table></div>'
                : '<div id="divToTest"><table cellspacing="0" cellpadding="1" style="border-collapse: collapse;" class="_tableSelected"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table></div>',
            Capitalization.Sentence
        );
    });

    xit('Uppercase in table selection', () => {
        runTest(
            '<div id="divToTest">' + TestHelper.tableSelectionContents[0] + '</div>',
            Browser.isFirefox
                ? '<div id="divToTest"><table style="border-collapse: collapse;" class="_tableSelected" cellspacing="0" cellpadding="1"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>TEST</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>TEST</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>TEST</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>TEST</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>TEST</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>TEST</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table></div>'
                : '<div id="divToTest"><table cellspacing="0" cellpadding="1" style="border-collapse: collapse;" class="_tableSelected"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>TEST</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>TEST</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>TEST</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>TEST</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>TEST</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span>TEST</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table></div>',
            Capitalization.Uppercase
        );
    });
});
