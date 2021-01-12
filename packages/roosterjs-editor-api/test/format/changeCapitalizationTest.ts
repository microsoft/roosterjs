import * as TestHelper from '../TestHelper';
import changeCapitalization from '../../lib/format/changeCapitalization';
import { Capitalization } from 'roosterjs-editor-types';
import { IEditor } from 'roosterjs-editor-types';

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
    it('UPPERCASE', () => {
        runTest(
            '<div id="divToTest">text</div>',
            '<div id="divToTest"><span>TEXT</span></div>',
            Capitalization.Uppercase
        );
    });

    it('lowercase', () => {
        runTest(
            '<div id="divToTest">TEXT</div>',
            '<div id="divToTest"><span>text</span></div>',
            Capitalization.Lowercase
        );
    });

    it('Capitalize Each Word', () => {
        runTest(
            '<div id="divToTest">text</div>',
            '<div id="divToTest"><span>Text</span></div>',
            Capitalization.CapitalizeEachWord
        );
    });

    it('Capitalize Each Word from lowercase', () => {
        runTest(
            '<div id="divToTest">first second third</div>',
            '<div id="divToTest"><span>First Second Third</span></div>',
            Capitalization.CapitalizeEachWord
        );
    });

    it('Capitalize Each Word from UPPERCASE', () => {
        runTest(
            '<div id="divToTest">FIRST SECOND THIRD</div>',
            '<div id="divToTest"><span>First Second Third</span></div>',
            Capitalization.CapitalizeEachWord
        );
    });

    // Style and markup tests
    it('styled content will retain styling after changing capitalization', () => {
        runTest(
            '<div id="divToTest" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><b>Text</b></div>',
            '<div id="divToTest" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><span><b>TEXT</b></span></div>',
            Capitalization.Uppercase
        );
    });

    it('will retain list format when changing capitalization', () => {
        runTest(
            '<div id="divToTest"><ul><li><span>coffee</span></li><li><span>tea<span></li></ul></div>',
            '<div id="divToTest"><ul><li><span>COFFEE</span></li><li><span>TEA</span><span><span></span></span></li></ul></div>',
            Capitalization.Uppercase
        );
    });

    it('Multi line is respected', () => {
        runTest(
            '<div id="divToTest">This is<br>a test</div>',
            '<div id="divToTest"><span>THIS IS</span><br><span>A TEST</span></div>',
            Capitalization.Uppercase
        );
    });

    it('Hyperlink is not affected', () => {
        runTest(
            '<div id="divToTest">This is a <a href="http://contoso.com" title="http://contoso.com">test</a></div>',
            '<div id="divToTest"><span>THIS IS A </span><a href="http://contoso.com" title="http://contoso.com"><span>TEST</span></a></div>',
            Capitalization.Uppercase
        );
    });

    it('<IMG> is not affected', () => {
        runTest(
            '<div id="divToTest"><img src="test" width="100%">see the image above</div>',
            '<div id="divToTest"><img src="test" width="100%"><span>See The Image Above</span></div>',
            Capitalization.CapitalizeEachWord
        );
    });

    // Internationalization tests
    it('works without a language passed when the character mapping is clear', () => {
        runTest(
            '<div id="divToTest">ılık ısırgan ışık</div>',
            '<div id="divToTest"><span>ILIK ISIRGAN IŞIK</span></div>',
            Capitalization.Uppercase
        );
    });

    it('does not affect uncased languages even when a cased language is passed', () => {
        runTest(
            '<div id="divToTest">לשון הקודש</div>',
            '<div id="divToTest"><span>לשון הקודש</span></div>',
            Capitalization.Uppercase,
            'es'
        );
    });

    it('Turkish undotted lowercase undotted to uppercase I', () => {
        runTest(
            '<div id="divToTest">ılık ısırgan ışık</div>',
            '<div id="divToTest"><span>ILIK ISIRGAN IŞIK</span></div>',
            Capitalization.Uppercase,
            'tr'
        );
    });

    it('Turkish undotted uppercase dotted to lowercase ı', () => {
        runTest(
            '<div id="divToTest">ILIK ISIRGAN IŞIK</div>',
            '<div id="divToTest"><span>ılık ısırgan ışık</span></div>',
            Capitalization.Lowercase,
            'tr'
        );
    });

    it('Greek Σ to lowercase: σ OR ς if terminating a word', () => {
        runTest(
            '<div id="divToTest">Σ IS A GREEK LETTER AND APPEARS IN ΟΔΥΣΣΕΥΣ.</div>',
            '<div id="divToTest"><span>σ is a greek letter and appears in οδυσσευς.</span></div>',
            Capitalization.Lowercase,
            'el'
        );
    });

    it('German ß to uppercase', () => {
        runTest(
            '<div id="divToTest">grüßen</div>',
            '<div id="divToTest"><span>GRÜSSEN</span></div>',
            Capitalization.Uppercase,
            'de'
        );
    });

    it('Spanish special characters', () => {
        runTest(
            '<div id="divToTest">A sus órdenes señora</div>',
            '<div id="divToTest"><span>A SUS ÓRDENES SEÑORA</span></div>',
            Capitalization.Uppercase,
            'es'
        );
    });
});
