import commentsRemoval from '../../../lib/plugins/Paste/wordConverter/commentsRemoval';
import { moveChildNodes } from '../../../../roosterjs-editor-dom';
import {
    createDefaultHtmlSanitizerOptions,
    HtmlSanitizer,
    SanitizeHtmlOptions,
} from '../../../../roosterjs/lib';

describe('convertPastedContentForLi', () => {
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
        const sanitizerOptions = createDefaultHtmlSanitizerOptions();
        commentsRemoval(sanitizerOptions.elementCallbacks);
        callSanitizer(fragment, sanitizerOptions);
        moveChildNodes(div, fragment);

        //Assert
        expect(div.outerHTML).toBe(expected);
    }

    it('Remove Comments mso-element:comment-list', () => {
        let source = `
        <div style="mso-element:comment-list">
            <hr width="33%" size="1" align="left" class="msocomoff">
            <div style="mso-element:comment">
            </div>
            <div style="mso-element:comment">
            </div>
            <div style="mso-element:comment">
            </div>
            <div style="mso-element:comment">
            </div>
            <div style="mso-element:comment">
            </div>
            <div style="mso-element:comment">
            </div>
            <div style="mso-element:comment">
            </div>
        </div>
      `;
        runTest(
            source,
            '<div>\n        <div style="mso-element:comment-list"></div>\n      </div>'
        );
    });

    it('MultipleComments', () => {
        let source = `<p class="MsoNormal"><a style="mso-comment-reference:BV_4;mso-comment-date:20220420T1711;
        mso-comment-parent:1"></a><a style="mso-comment-reference:BV_3;mso-comment-date:
        20220420T1711;mso-comment-parent:1"></a><a style="mso-comment-reference:BV_2;
        mso-comment-date:20220420T1711;mso-comment-parent:1"></a><a style="mso-comment-reference:
        BV_1;mso-comment-date:20220420T1711"><span style="mso-comment-continuation:
        2"><span style="mso-comment-continuation:3"><span style="mso-comment-continuation:
        4"><span style="font-size:10.5pt;line-height:107%;font-family:&quot;Arial&quot;,sans-serif;
        color:black">Lorem </span></span></span></span></a><span style="mso-comment-continuation:
        2"><span style="mso-comment-continuation:3"><span style="mso-comment-continuation:
        4"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:
        107%"><!--[if !supportAnnotations]--><a name="_msoanchor_1" href="#_msocom_1" id="_anchor_1" class="msocomanchor">[BV1]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></span></span></span><span style="mso-comment-continuation:3"><span style="mso-comment-continuation:4"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_2" href="#_msocom_2" id="_anchor_2" class="msocomanchor">[BV2]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></span></span><span style="mso-comment-continuation:4"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_3" href="#_msocom_3" id="_anchor_3" class="msocomanchor">[BV3]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></span><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_4" href="#_msocom_4" id="_anchor_4" class="msocomanchor">[BV4]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span><a style="mso-comment-reference:BV_7;mso-comment-date:20220420T1711;mso-comment-parent:
        5"></a><a style="mso-comment-reference:BV_6;mso-comment-date:20220420T1711;
        mso-comment-parent:5"></a><a style="mso-comment-reference:BV_5;mso-comment-date:
        20220420T1711"><span style="mso-comment-continuation:6"><span style="mso-comment-continuation:
        7"><span style="font-size:10.5pt;line-height:107%;font-family:&quot;Arial&quot;,sans-serif;
        color:black">ipsum </span></span></span></a><span style="mso-comment-continuation:
        6"><span style="mso-comment-continuation:7"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_5" href="#_msocom_5" id="_anchor_5" class="msocomanchor">[BV5]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></span></span><span style="mso-comment-continuation:7"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_6" href="#_msocom_6" id="_anchor_6" class="msocomanchor">[BV6]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></span><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_7" href="#_msocom_7" id="_anchor_7" class="msocomanchor">[BV7]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span><a style="mso-comment-reference:BV_11;mso-comment-date:20220420T1711;mso-comment-parent:
        8"></a><a style="mso-comment-reference:BV_10;mso-comment-date:20220420T1711;
        mso-comment-parent:8"></a><a style="mso-comment-reference:BV_9;mso-comment-date:
        20220420T1711;mso-comment-parent:8"></a><a style="mso-comment-reference:BV_8;
        mso-comment-date:20220420T1711"><span style="mso-comment-continuation:9"><span style="mso-comment-continuation:10"><span style="mso-comment-continuation:11"><span style="font-size:10.5pt;line-height:107%;font-family:&quot;Arial&quot;,sans-serif;
        color:black">dolor</span></span></span></span></a><span style="mso-comment-continuation:
        9"><span style="mso-comment-continuation:10"><span style="mso-comment-continuation:
        11"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:
        107%"><!--[if !supportAnnotations]--><a name="_msoanchor_8" href="#_msocom_8" id="_anchor_8" class="msocomanchor">[BV8]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></span></span></span><span style="mso-comment-continuation:10"><span style="mso-comment-continuation:11"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_9" href="#_msocom_9" id="_anchor_9" class="msocomanchor">[BV9]</a><!--[endif]--><span style="mso-special-character:comment">&nbsp;</span></span></span></span></span><span style="mso-comment-continuation:11"><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_10" href="#_msocom_10" id="_anchor_10" class="msocomanchor">[BV10]</a><!--[endif]--><span style="mso-special-character:
        comment">&nbsp;</span></span></span></span><span class="MsoCommentReference"><span style="font-size:8.0pt;line-height:107%"><!--[if !supportAnnotations]--><a name="_msoanchor_11" href="#_msocom_11" id="_anchor_11" class="msocomanchor">[BV11]</a><!--[endif]--><span style="mso-special-character:
        comment">&nbsp;</span></span></span></p>
        <div style="mso-element:comment-list"><!--[if !supportAnnotations]-->

        <hr width="33%" size="1" align="left" class="msocomoff">

        <!--[endif]-->

        <div style="mso-element:comment"><!--[if !supportAnnotations]-->

        <div class="msocomtxt" id="_com_1"><!--[endif]--><span style="mso-comment-author:
        &quot;Bryan Valverde&quot;;mso-comment-providerid:AD;mso-comment-userid:&quot;S\:\:bvalverde\@microsoft\.com\:\:9f242bb7-642c-4c17-9601-adbdf07d2750&quot;"><!--[if !supportAnnotations]--><a name="_msocom_1"></a><!--[endif]--></span>

        <p class="MsoCommentText"><span class="MsoCommentReference"><span style="font-size:
        8.0pt"><span style="mso-special-character:comment">&nbsp;<!--[if !supportAnnotations]--><a class="msocomoff" href="#_msoanchor_1">[BV1]</a><!--[endif]--></span></span></span>wqeewq</p>

        <!--[if !supportAnnotations]--></div>

        <!--[endif]--></div>

        <div style="mso-element:comment"><!--[if !supportAnnotations]-->

        <div class="msocomtxt" id="_com_2"><!--[endif]--><span style="mso-comment-author:
        &quot;Bryan Valverde&quot;;mso-comment-providerid:AD;mso-comment-userid:&quot;S\:\:bvalverde\@microsoft\.com\:\:9f242bb7-642c-4c17-9601-adbdf07d2750&quot;"><!--[if !supportAnnotations]--><a name="_msocom_2"></a><!--[endif]--></span>

        <p class="MsoCommentText"><span class="MsoCommentReference"><span style="font-size:
        8.0pt"><span style="mso-special-character:comment">&nbsp;<!--[if !supportAnnotations]--><a class="msocomoff" href="#_msoanchor_2">[BV2]</a><!--[endif]--></span></span></span>qwewq</p>

        <!--[if !supportAnnotations]--></div>

        <!--[endif]--></div>

        <div style="mso-element:comment"><!--[if !supportAnnotations]-->

        <div class="msocomtxt" id="_com_3"><!--[endif]--><span style="mso-comment-author:
        &quot;Bryan Valverde&quot;;mso-comment-providerid:AD;mso-comment-userid:&quot;S\:\:bvalverde\@microsoft\.com\:\:9f242bb7-642c-4c17-9601-adbdf07d2750&quot;"><!--[if !supportAnnotations]--><a name="_msocom_3"></a><!--[endif]--></span>

        <p class="MsoCommentText"><span class="MsoCommentReference"><span style="font-size:
        8.0pt"><span style="mso-special-character:comment">&nbsp;<!--[if !supportAnnotations]--><a class="msocomoff" href="#_msoanchor_3">[BV3]</a><!--[endif]--></span></span></span>qwewqe</p>

        <!--[if !supportAnnotations]--></div>

        <!--[endif]--></div>

        <div style="mso-element:comment"><!--[if !supportAnnotations]-->

        <div class="msocomtxt" id="_com_4"><!--[endif]--><span style="mso-comment-author:
        &quot;Bryan Valverde&quot;;mso-comment-providerid:AD;mso-comment-userid:&quot;S\:\:bvalverde\@microsoft\.com\:\:9f242bb7-642c-4c17-9601-adbdf07d2750&quot;"><!--[if !supportAnnotations]--><a name="_msocom_4"></a><!--[endif]--></span>

        <p class="MsoCommentText"><span class="MsoCommentReference"><span style="font-size:
        8.0pt"><span style="mso-special-character:comment">&nbsp;<!--[if !supportAnnotations]--><a class="msocomoff" href="#_msoanchor_4">[BV4]</a><!--[endif]--></span></span></span>qwewqe</p>

        <!--[if !supportAnnotations]--></div>

        <!--[endif]--></div>

        <div style="mso-element:comment"><!--[if !supportAnnotations]-->

        <div class="msocomtxt" id="_com_5"><!--[endif]--><span style="mso-comment-author:
        &quot;Bryan Valverde&quot;;mso-comment-providerid:AD;mso-comment-userid:&quot;S\:\:bvalverde\@microsoft\.com\:\:9f242bb7-642c-4c17-9601-adbdf07d2750&quot;"><!--[if !supportAnnotations]--><a name="_msocom_5"></a><!--[endif]--></span>

        <p class="MsoCommentText"><span class="MsoCommentReference"><span style="font-size:
        8.0pt"><span style="mso-special-character:comment">&nbsp;<!--[if !supportAnnotations]--><a class="msocomoff" href="#_msoanchor_5">[BV5]</a><!--[endif]--></span></span></span>xzcxzc</p>

        <!--[if !supportAnnotations]--></div>

        <!--[endif]--></div>

        <div style="mso-element:comment"><!--[if !supportAnnotations]-->

        <div class="msocomtxt" id="_com_6"><!--[endif]--><span style="mso-comment-author:
        &quot;Bryan Valverde&quot;;mso-comment-providerid:AD;mso-comment-userid:&quot;S\:\:bvalverde\@microsoft\.com\:\:9f242bb7-642c-4c17-9601-adbdf07d2750&quot;"><!--[if !supportAnnotations]--><a name="_msocom_6"></a><!--[endif]--></span>

        <p class="MsoCommentText"><span class="MsoCommentReference"><span style="font-size:
        8.0pt"><span style="mso-special-character:comment">&nbsp;<!--[if !supportAnnotations]--><a class="msocomoff" href="#_msoanchor_6">[BV6]</a><!--[endif]--></span></span></span>xzccxz</p>

        <!--[if !supportAnnotations]--></div>

        <!--[endif]--></div>

        <div style="mso-element:comment"><!--[if !supportAnnotations]-->

        <div class="msocomtxt" id="_com_7"><!--[endif]--><span style="mso-comment-author:
        &quot;Bryan Valverde&quot;;mso-comment-providerid:AD;mso-comment-userid:&quot;S\:\:bvalverde\@microsoft\.com\:\:9f242bb7-642c-4c17-9601-adbdf07d2750&quot;"><!--[if !supportAnnotations]--><a name="_msocom_7"></a><!--[endif]--></span>

        <p class="MsoCommentText"><span class="MsoCommentReference"><span style="font-size:
        8.0pt"><span style="mso-special-character:comment">&nbsp;<!--[if !supportAnnotations]--><a class="msocomoff" href="#_msoanchor_7">[BV7]</a><!--[endif]--></span></span></span>xzccxz</p>

        <!--[if !supportAnnotations]--></div>

        <!--[endif]--></div>

        <div style="mso-element:comment"><!--[if !supportAnnotations]-->

        <div class="msocomtxt" id="_com_8"><!--[endif]--><span style="mso-comment-author:
        &quot;Bryan Valverde&quot;;mso-comment-providerid:AD;mso-comment-userid:&quot;S\:\:bvalverde\@microsoft\.com\:\:9f242bb7-642c-4c17-9601-adbdf07d2750&quot;"><!--[if !supportAnnotations]--><a name="_msocom_8"></a><!--[endif]--></span>

        <p class="MsoCommentText"><span class="MsoCommentReference"><span style="font-size:
        8.0pt"><span style="mso-special-character:comment">&nbsp;<!--[if !supportAnnotations]--><a class="msocomoff" href="#_msoanchor_8">[BV8]</a><!--[endif]--></span></span></span>sad</p>

        <!--[if !supportAnnotations]--></div>

        <!--[endif]--></div>

        <div style="mso-element:comment"><!--[if !supportAnnotations]-->

        <div class="msocomtxt" id="_com_9"><!--[endif]--><span style="mso-comment-author:
        &quot;Bryan Valverde&quot;;mso-comment-providerid:AD;mso-comment-userid:&quot;S\:\:bvalverde\@microsoft\.com\:\:9f242bb7-642c-4c17-9601-adbdf07d2750&quot;"><!--[if !supportAnnotations]--><a name="_msocom_9"></a><!--[endif]--></span>

        <p class="MsoCommentText"><span class="MsoCommentReference"><span style="font-size:
        8.0pt"><span style="mso-special-character:comment">&nbsp;<!--[if !supportAnnotations]--><a class="msocomoff" href="#_msoanchor_9">[BV9]</a><!--[endif]--></span></span></span>sad</p>

        <!--[if !supportAnnotations]--></div>

        <!--[endif]--></div>

        <div style="mso-element:comment"><!--[if !supportAnnotations]-->

        <div class="msocomtxt" id="_com_10"><!--[endif]--><span style="mso-comment-author:
        &quot;Bryan Valverde&quot;;mso-comment-providerid:AD;mso-comment-userid:&quot;S\:\:bvalverde\@microsoft\.com\:\:9f242bb7-642c-4c17-9601-adbdf07d2750&quot;"><!--[if !supportAnnotations]--><a name="_msocom_10"></a><!--[endif]--></span>

        <p class="MsoCommentText"><span class="MsoCommentReference"><span style="font-size:
        8.0pt"><span style="mso-special-character:comment">&nbsp;<!--[if !supportAnnotations]--><a class="msocomoff" href="#_msoanchor_10">[BV10]</a><!--[endif]--></span></span></span>sad</p>

        <!--[if !supportAnnotations]--></div>

        <!--[endif]--></div>

        <div style="mso-element:comment"><!--[if !supportAnnotations]-->

        <div class="msocomtxt" id="_com_11"><!--[endif]--><span style="mso-comment-author:
        &quot;Bryan Valverde&quot;;mso-comment-providerid:AD;mso-comment-userid:&quot;S\:\:bvalverde\@microsoft\.com\:\:9f242bb7-642c-4c17-9601-adbdf07d2750&quot;"><!--[if !supportAnnotations]--><a name="_msocom_11"></a><!--[endif]--></span>

        <p class="MsoCommentText"><span class="MsoCommentReference"><span style="font-size:
        8.0pt"><span style="mso-special-character:comment">&nbsp;<!--[if !supportAnnotations]--><a class="msocomoff" href="#_msoanchor_11">[BV11]</a><!--[endif]--></span></span></span>sad</p>

        <!--[if !supportAnnotations]--></div>

        <!--[endif]--></div>

        </div>`;

        runTest(
            source,
            '<div><p><span style="mso-comment-reference:BV_4;mso-comment-date:20220420T1711;\n        mso-comment-parent:1"></span><span style="mso-comment-reference:BV_3;mso-comment-date:\n        20220420T1711;mso-comment-parent:1"></span><span style="mso-comment-reference:BV_2;\n        mso-comment-date:20220420T1711;mso-comment-parent:1"></span><span style="mso-comment-reference:\n        BV_1;mso-comment-date:20220420T1711"><span style="mso-comment-continuation:\n        2"><span style="mso-comment-continuation:3"><span style="mso-comment-continuation:\n        4"><span style="font-size:10.5pt;line-height:107%;font-family:&quot;Arial&quot;,sans-serif;\n        color:black">Lorem </span></span></span></span></span><span><span style="font-size:8.0pt;line-height:107%"></span></span><span style="mso-comment-reference:BV_7;mso-comment-date:20220420T1711;mso-comment-parent:\n        5"></span><span style="mso-comment-reference:BV_6;mso-comment-date:20220420T1711;\n        mso-comment-parent:5"></span><span style="mso-comment-reference:BV_5;mso-comment-date:\n        20220420T1711"><span style="mso-comment-continuation:6"><span style="mso-comment-continuation:\n        7"><span style="font-size:10.5pt;line-height:107%;font-family:&quot;Arial&quot;,sans-serif;\n        color:black">ipsum </span></span></span></span><span><span style="font-size:8.0pt;line-height:107%"></span></span><span style="mso-comment-reference:BV_11;mso-comment-date:20220420T1711;mso-comment-parent:\n        8"></span><span style="mso-comment-reference:BV_10;mso-comment-date:20220420T1711;\n        mso-comment-parent:8"></span><span style="mso-comment-reference:BV_9;mso-comment-date:\n        20220420T1711;mso-comment-parent:8"></span><span style="mso-comment-reference:BV_8;\n        mso-comment-date:20220420T1711"><span style="mso-comment-continuation:9"><span style="mso-comment-continuation:10"><span style="mso-comment-continuation:11"><span style="font-size:10.5pt;line-height:107%;font-family:&quot;Arial&quot;,sans-serif;\n        color:black">dolor</span></span></span></span></span><span><span style="font-size:8.0pt;line-height:107%"></span></span></p>\n        <div style="mso-element:comment-list"></div></div>'
        );
    });
});
