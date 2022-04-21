import convertPastedContentFromWord from '../../../lib/plugins/Paste/wordConverter/convertPastedContentFromWord';
import { BeforePasteEvent, SanitizeHtmlOptions } from 'roosterjs-editor-types';
import { HtmlSanitizer, moveChildNodes } from 'roosterjs-editor-dom';
import {
    ClipboardData,
    createDefaultHtmlSanitizerOptions,
    PluginEventType,
} from '../../../../roosterjs/lib';

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

        runTest(
            source,
            '<p><span style="mso-comment-reference:BV_4;mso-comment-date:20220420T1711;mso-comment-parent:1"></span><span style="mso-comment-reference:BV_3;mso-comment-date:20220420T1711;mso-comment-parent:1"></span></p>'
        );
    });

    it('Remove Comment | mso-comment-continuation', () => {
        let source = '<span><span style="mso-comment-continuation:3"></span></span>';
        runTest(source, '<span></span>');
    });

    it('Remove Comment | mso-comment-continuation, no parent so no remove', () => {
        let source = '<span style="mso-comment-continuation:3"></span>';
        runTest(source, '<span style="mso-comment-continuation:3"></span>');
    });

    it('Remove Comment | mso-special-character:comment', () => {
        let source = '<span><span style="mso-special-character:comment">&nbsp;</span></span>';
        runTest(source, '<span></span>');
    });

    it('Remove Bottom Margin = 0in | UL', () => {
        let source = '<UL style="margin-bottom: 0in"><li></li><li></li></UL>';
        runTest(source, '<ul><li></li><li></li></ul>');
    });

    it('Do Remove Bottom Margin = 1in | UL', () => {
        let source = '<UL style="margin-bottom: 1in"><li></li><li></li></UL>';
        runTest(source, '<ul style="margin-bottom:1in"><li></li><li></li></ul>');
    });

    it('Remove Bottom Margin = 0in | OL', () => {
        let source = '<OL style="margin-bottom: 0in"><li></li><li></li></OL>';
        runTest(source, '<ol><li></li><li></li></ol>');
    });
});

function createBeforePasteEventMock(fragment: DocumentFragment) {
    return ({
        eventType: PluginEventType.BeforePaste,
        clipboardData: <ClipboardData>{},
        fragment: fragment,
        sanitizingOption: createDefaultHtmlSanitizerOptions(),
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
    } as unknown) as BeforePasteEvent;
}
