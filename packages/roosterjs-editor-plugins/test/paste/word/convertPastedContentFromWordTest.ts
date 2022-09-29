import convertPastedContentFromWord from '../../../lib/plugins/Paste/wordConverter/convertPastedContentFromWord';
import { HtmlSanitizer, moveChildNodes } from 'roosterjs-editor-dom';
import {
    BeforePasteEvent,
    SanitizeHtmlOptions,
    PluginEventType,
    ClipboardData,
} from 'roosterjs-editor-types';

describe('convertPastedContentFromWord', () => {
    function callSanitizer(fragment: DocumentFragment, sanitizingOption: SanitizeHtmlOptions) {
        const sanitizer = new HtmlSanitizer(sanitizingOption);

        sanitizer.convertGlobalCssToInlineCss(fragment);
        sanitizer.sanitize(fragment);
    }

    function runTest(source: string, expected: string) {
        //Arrange
        const div = document.createElement('div');

        //Act
        div.innerHTML = source;
        const fragment = document.createDocumentFragment();
        moveChildNodes(fragment, div);
        const event = createBeforePasteEventMock(fragment);
        convertPastedContentFromWord(event);
        callSanitizer(fragment, event.sanitizingOption);
        moveChildNodes(div, fragment);
        document.body.append(div);

        //Assert
        expect(div.innerHTML).toBe(expected);
        div.parentElement?.removeChild(div);
    }

    it('Remove Comment | mso-element:comment-list', () => {
        let source =
            '<div style="mso-element:comment-list"><div style="mso-element:comment"></div></div>';
        runTest(source, '<div style="mso-element:comment-list"></div>');
    });

    it('Remove Comment | #_msocom_', () => {
        let source =
            '<p class="MsoNormal"><a name="_msoanchor_11" href="#_msocom_11" id="_anchor_11" class="msocomanchor">[BV11]</a></p>';
        runTest(source, '<p></p>');
    });

    it('Remove Comment | mso-comment-reference', () => {
        let source =
            '<p class="MsoNormal"><a style="mso-comment-reference:BV_4;mso-comment-date:20220420T1711;mso-comment-parent:1"></a><a style="mso-comment-reference:BV_3;mso-comment-date:20220420T1711;mso-comment-parent:1"></a></p>';

        runTest(source, '<p><a></a><a></a></p>');
    });

    it('Remove Comment | mso-comment-continuation, remove style 1', () => {
        let source = '<span><span style="mso-comment-continuation:3"></span></span>';
        runTest(source, '<span><span></span></span>');
    });

    it('Remove Comment | mso-comment-continuation, remove style 2', () => {
        let source = '<span style="mso-comment-continuation:3"></span>';
        runTest(source, '<span></span>');
    });

    it('Remove Comment | mso-special-character:comment', () => {
        let source = '<span><span style="mso-special-character:comment">&nbsp;</span></span>';
        runTest(source, '<span></span>');
    });

    it('Remove Bottom Margin = 0in | UL', () => {
        let source = '<UL style="margin-bottom: 0in"><li></li><li></li></UL>';
        runTest(source, '<ul><li></li><li></li></ul>');
    });

    it('Do Not Remove Bottom Margin = 1in | UL', () => {
        let source = '<UL style="margin-bottom: 1in"><li></li><li></li></UL>';
        runTest(source, '<ul style="margin-bottom:1in"><li></li><li></li></ul>');
    });

    it('Remove Bottom Margin = 0in | OL', () => {
        let source = '<OL style="margin-bottom: 0in"><li></li><li></li></OL>';
        runTest(source, '<ol><li></li><li></li></ol>');
    });

    it('Remove Margin bottom from List', () => {
        let source =
            '<div></div><ol style="margin-bottom:0in"><li>1</li><ol><li>2</li></ol></ol><p>123</p><div><br></div>';
        runTest(
            source,
            '<div></div><ol><li>1</li><ol><li>2</li></ol></ol><p>123</p><div><br></div>'
        );
    });

    it('Remove Line height less than default', () => {
        let source = '<p style="line-height:102%"></p>';
        runTest(source, '<p></p>');
    });

    it('Remove Line height, not percentage', () => {
        let source = '<p style="line-height:1"></p>';
        runTest(source, source);
    });

    it('Remove Line height, not percentage 2', () => {
        let source = '<p style="line-height:initial"></p>';
        runTest(source, source);
    });
    it('Remove Line height, percentage greater than default', () => {
        let source = '<p style="line-height:122%"></p>';
        runTest(source, source);
    });
});

function createBeforePasteEventMock(fragment: DocumentFragment) {
    return ({
        eventType: PluginEventType.BeforePaste,
        clipboardData: <ClipboardData>{},
        fragment: fragment,
        sanitizingOption: {
            elementCallbacks: {},
            attributeCallbacks: {},
            cssStyleCallbacks: {},
            additionalTagReplacements: {},
            additionalAllowedAttributes: [],
            additionalAllowedCssClasses: [],
            additionalDefaultStyleValues: {},
            additionalGlobalStyleNodes: [],
            additionalPredefinedCssForElement: {},
            preserveHtmlComments: false,
            unknownTagReplacement: null,
        },
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
    } as unknown) as BeforePasteEvent;
}
