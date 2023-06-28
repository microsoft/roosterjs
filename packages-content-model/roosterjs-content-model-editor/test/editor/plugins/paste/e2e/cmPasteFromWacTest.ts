import * as processPastedContentWacComponents from '../../../../../lib/editor/plugins/PastePlugin/WacComponents/processPastedContentWacComponents';
import paste from '../../../../../lib/publicApi/utils/paste';
import { ClipboardData } from 'roosterjs-editor-types';
import { IContentModelEditor } from '../../../../../lib/publicTypes/IContentModelEditor';
import { initEditor } from './cmPasteFromExcelTest';
import { tableProcessor } from 'roosterjs-content-model-dom';

const ID = 'CM_Paste_From_WORD_Online_E2E';
const clipboardData = <ClipboardData>(<any>{
    types: ['text/plain', 'text/html'],
    text: 'asd\r\n\r\nTest ',
    image: null,
    files: [],
    rawHtml:
        '<html>\r\n<body>\r\n<!--StartFragment--><div class="OutlineElement Ltr SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: Calibri, Calibri_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW119048576 BCX8" xml:lang="EN-US" lang="EN-US" paraid="1445671679" paraeid="{56ca519d-7e7d-41fd-839e-df3f4a7a8277}{82}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; font-size: 12pt; line-height: 21.5833px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"><span class="NormalTextRun SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;">asd</span></span><span class="EOP SCXW119048576 BCX8" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559685&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:259}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 21.5833px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"> </span></p></div><div class="ListContainerWrapper SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: relative; color: rgb(0, 0, 0); font-family: Calibri, Calibri_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ul class="BulletListStyle1 SCXW119048576 BCX8" role="list" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; list-style-type: disc; font-family: verdana;"><li data-leveltext="" data-font="Symbol" data-listid="10" data-list-defn-props="{&quot;335552541&quot;:1,&quot;335559683&quot;:0,&quot;335559684&quot;:-2,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769226&quot;:&quot;Symbol&quot;,&quot;469769242&quot;:[8226],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="1" data-aria-level="1" role="listitem" class="OutlineElement Ltr SCXW119048576 BCX8" style="margin: 0px 0px 0px 24px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Calibri, Calibri_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW119048576 BCX8" xml:lang="EN-US" lang="EN-US" paraid="797108091" paraeid="{56ca519d-7e7d-41fd-839e-df3f4a7a8277}{26}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; font-size: 12pt; line-height: 20px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"><span class="NormalTextRun SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;">Test</span></span><span class="EOP SCXW119048576 BCX8" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559739&quot;:0,&quot;335559740&quot;:240}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 20px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"> </span></p></li></ul></div><!--EndFragment-->\r\n</body>\r\n</html>',
    customValues: {},
    snapshotBeforePaste:
        '<div style="margin: 0px; user-select: text; cursor: text; clear: both; font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web&quot;, Arial, Verdana, sans-serif; font-size: 12px; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);"><div style="margin:0px;user-select:text;overflow-wrap:break-word;white-space:pre-wrap;font-weight:normal;font-kerning:none;text-align:left"><span style="margin: 0px; user-select: text; font-size: 12pt; line-height: 20px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif; font-variant-ligatures: none !important; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);" lang="EN-US" data-contrast="auto"><span style="margin:0px;user-select:text">Test</span></span><span style="margin: 0px; user-select: text; font-size: 12pt; line-height: 20px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559739&quot;:0,&quot;335559740&quot;:240}">&nbsp;</span><br></div></div><!--{"start":[0,0,0,0,0,0],"end":[0,0,1,0,1]}-->',
    htmlFirstLevelChildTags: ['DIV', 'DIV'],
    html:
        '<div class="OutlineElement Ltr SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: Calibri, Calibri_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW119048576 BCX8" xml:lang="EN-US" lang="EN-US" paraid="1445671679" paraeid="{56ca519d-7e7d-41fd-839e-df3f4a7a8277}{82}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; font-size: 12pt; line-height: 21.5833px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"><span class="NormalTextRun SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;">asd</span></span><span class="EOP SCXW119048576 BCX8" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559685&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:259}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 21.5833px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"> </span></p></div><div class="ListContainerWrapper SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: relative; color: rgb(0, 0, 0); font-family: Calibri, Calibri_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ul class="BulletListStyle1 SCXW119048576 BCX8" role="list" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; list-style-type: disc; font-family: verdana;"><li data-leveltext="" data-font="Symbol" data-listid="10" data-list-defn-props="{&quot;335552541&quot;:1,&quot;335559683&quot;:0,&quot;335559684&quot;:-2,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769226&quot;:&quot;Symbol&quot;,&quot;469769242&quot;:[8226],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="1" data-aria-level="1" role="listitem" class="OutlineElement Ltr SCXW119048576 BCX8" style="margin: 0px 0px 0px 24px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Calibri, Calibri_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW119048576 BCX8" xml:lang="EN-US" lang="EN-US" paraid="797108091" paraeid="{56ca519d-7e7d-41fd-839e-df3f4a7a8277}{26}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; font-size: 12pt; line-height: 20px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"><span class="NormalTextRun SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;">Test</span></span><span class="EOP SCXW119048576 BCX8" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559739&quot;:0,&quot;335559740&quot;:240}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 20px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"> </span></p></li></ul></div>',
});

describe(ID, () => {
    let editor: IContentModelEditor = undefined!;

    beforeEach(() => {
        editor = initEditor(ID);
    });

    afterEach(() => {
        document.getElementById(ID)?.remove();
    });

    it('E2E', () => {
        spyOn(
            processPastedContentWacComponents,
            'processPastedContentWacComponents'
        ).and.callThrough();

        paste(editor, clipboardData);
        const model = editor.createContentModel({
            processorOverride: {
                table: tableProcessor,
            },
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'div',
                    blocks: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'FormatContainer',
                            tagName: 'div',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'asd ',
                                            format: {
                                                fontFamily:
                                                    'Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif',
                                                fontSize: '12pt',
                                                lineHeight: '21.5833px',
                                            },
                                        },
                                    ],
                                    format: {
                                        whiteSpace: 'pre-wrap',
                                        marginTop: '0px',
                                        marginRight: '0px',
                                        marginBottom: '0px',
                                        marginLeft: '0px',
                                    },
                                    decorator: { tagName: 'p', format: {} },
                                },
                            ],
                            format: {
                                backgroundColor: 'rgb(255, 255, 255)',
                                marginTop: '0px',
                                marginRight: '0px',
                                marginBottom: '0px',
                                marginLeft: '0px',
                            },
                        },
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'Test ',
                                            format: {
                                                fontFamily:
                                                    'Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif',
                                                fontSize: '12pt',
                                            },
                                        },
                                    ],
                                    format: {
                                        whiteSpace: 'pre-wrap',
                                        marginTop: '0px',
                                        marginRight: '0px',
                                        marginBottom: '0px',
                                        marginLeft: '0px',
                                    },
                                    decorator: { tagName: 'p', format: {} },
                                },
                            ],
                            levels: [
                                {
                                    listType: 'UL',
                                    marginTop: '0px',
                                    marginRight: '0px',
                                    marginBottom: '0px',
                                    marginLeft: '0px',
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {
                                    fontFamily: 'Calibri, Calibri_MSFontService, sans-serif',
                                    fontSize: '12pt',
                                },
                            },
                            format: {},
                        },
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {
                                        fontFamily:
                                            'Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif',
                                        fontSize: '12pt',
                                        textColor: 'rgb(0, 0, 0)',
                                        backgroundColor: 'rgb(255, 255, 255)',
                                        lineHeight: '20px',
                                    },
                                },
                                {
                                    segmentType: 'Br',
                                    format: {
                                        fontFamily:
                                            'Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif',
                                        fontSize: '12pt',
                                        textColor: 'rgb(0, 0, 0)',
                                        backgroundColor: 'rgb(255, 255, 255)',
                                        lineHeight: '20px',
                                    },
                                },
                            ],
                            format: {
                                textAlign: 'start',
                                whiteSpace: 'normal',
                                backgroundColor: 'rgb(255, 255, 255)',
                                marginTop: '0px',
                                marginRight: '0px',
                                marginBottom: '0px',
                                marginLeft: '0px',
                            },
                            isImplicit: false,
                        },
                    ],
                    format: {
                        backgroundColor: 'rgb(255, 255, 255)',
                        marginTop: '0px',
                        marginRight: '0px',
                        marginBottom: '0px',
                        marginLeft: '0px',
                    },
                },
            ],
            format: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: undefined,
                fontSize: undefined,
                textColor: undefined,
                backgroundColor: undefined,
            },
        });
        expect(
            processPastedContentWacComponents.processPastedContentWacComponents
        ).toHaveBeenCalled();
    });
});
