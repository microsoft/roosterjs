import convertPastedContentFromWord from '../../../lib/plugins/Paste/wordConverter/convertPastedContentFromWord';
import { BeforePasteEvent } from 'roosterjs-editor-types';
import { callSanitizer } from '../../TestHelper';
import { moveChildNodes } from '../../../../roosterjs-editor-dom';
import {
    ClipboardData,
    createDefaultHtmlSanitizerOptions,
    PluginEventType,
} from '../../../../roosterjs/lib';

describe('convertPastedContentFromWord', () => {
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
        expect(div.outerHTML).toBe(expected);
    }

    it('Remove Comments mso-element:comment-list', () => {
        let source =
            '<div style="mso-element:comment-list"><hr width="33%" size="1" align="left" class="msocomoff"><div style="mso-element:comment"></div><div style="mso-element:comment"></div><div style="mso-element:comment"></div><div style="mso-element:comment"></div><div style="mso-element:comment"></div><div style="mso-element:comment"></div><div style="mso-element:comment"></div></div>';
        runTest(source, '<div><div></div></div>');
    });

    it('MultipleComments', () => {
        debugger;
        let source =
            '<p class="MsoNormal"><a style="mso-comment-reference:BV_4;mso-comment-date:20220420T1711;mso-comment-parent:1"></a><a style="mso-comment-reference:BV_3;mso-comment-date:20220420T1711;mso-comment-parent:1"></a><a style="mso-comment-reference:BV_2;mso-comment-date:20220420T1711;mso-comment-parent:1"></a><a style="mso-comment-reference:BV_1;mso-comment-date:20220420T1711"><span style="mso-comment-continuation:2"><span style="mso-comment-continuation:3"><span style="mso-comment-continuation:4"><span style="font-size:10.5pt;line-height:107%;font-family:&quot;Arial&quot;,sans-serif;color:black">Lorem </span></span></span></span></a><span style="mso-comment-continuation:2"><span style="mso-comment-continuation:3"><span style="mso-comment-continuation:4"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_1" href="#_msocom_1" id="_anchor_1" class="msocomanchor">[BV1]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></span></span></span><span style="mso-comment-continuation:3"><span style="mso-comment-continuation:4"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_2" href="#_msocom_2" id="_anchor_2" class="msocomanchor">[BV2]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></span></span><span style="mso-comment-continuation:4"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_3" href="#_msocom_3" id="_anchor_3" class="msocomanchor">[BV3]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></span><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_4" href="#_msocom_4" id="_anchor_4" class="msocomanchor">[BV4]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span><a style="mso-comment-reference:BV_7;mso-comment-date:20220420T1711;mso-comment-parent:5"></a><a style="mso-comment-reference:BV_6;mso-comment-date:20220420T1711;mso-comment-parent:5"></a><a style="mso-comment-reference:BV_5;mso-comment-date:20220420T1711"><span style="mso-comment-continuation:6"><span style="mso-comment-continuation:7"><span style="font-size:10.5pt;line-height:107%;font-family:&quot;Arial&quot;,sans-serif;color:black">ipsum </span></span></span></a><span style="mso-comment-continuation:6"><span style="mso-comment-continuation:7"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_5" href="#_msocom_5" id="_anchor_5" class="msocomanchor">[BV5]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></span></span><span style="mso-comment-continuation:7"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_6" href="#_msocom_6" id="_anchor_6" class="msocomanchor">[BV6]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></span><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_7" href="#_msocom_7" id="_anchor_7" class="msocomanchor">[BV7]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span><a style="mso-comment-reference:BV_11;mso-comment-date:20220420T1711;mso-comment-parent:8"></a><a style="mso-comment-reference:BV_10;mso-comment-date:20220420T1711;mso-comment-parent:8"></a><a style="mso-comment-reference:BV_9;mso-comment-date:20220420T1711;mso-comment-parent:8"></a><a style="mso-comment-reference:BV_8;mso-comment-date:20220420T1711"><span style="mso-comment-continuation:9"><span style="mso-comment-continuation:10"><span style="mso-comment-continuation:11"><span style="font-size:10.5pt;line-height:107%;font-family:&quot;Arial&quot;,sans-serif;color:black">dolor</span></span></span></span></a><span style="mso-comment-continuation:9"><span style="mso-comment-continuation:10"><span style="mso-comment-continuation:11"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_8" href="#_msocom_8" id="_anchor_8" class="msocomanchor">[BV8]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></span></span></span><span style="mso-comment-continuation:10"><span style="mso-comment-continuation:11"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_9" href="#_msocom_9" id="_anchor_9" class="msocomanchor">[BV9]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></span></span><span style="mso-comment-continuation:11"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_10" href="#_msocom_10" id="_anchor_10" class="msocomanchor">[BV10]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></span><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_11" href="#_msocom_11" id="_anchor_11" class="msocomanchor">[BV11]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></p>';
        runTest(
            source,
            '<div><p><span></span><span></span><span></span><span><span><span><span><span>Lorem </span></span></span></span></span><span><span></span></span><span></span><span></span><span><span><span><span>ipsum </span></span></span></span><span><span></span></span><span></span><span></span><span></span><span><span><span><span><span>dolor</span></span></span></span></span><span><span></span></span></p></div>'
        );
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
