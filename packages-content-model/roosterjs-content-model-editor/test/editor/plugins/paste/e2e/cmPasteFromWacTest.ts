import * as processPastedContentWacComponents from '../../../../../lib/editor/plugins/PastePlugin/WacComponents/processPastedContentWacComponents';
import paste from '../../../../../lib/publicApi/utils/paste';
import { ClipboardData } from 'roosterjs-editor-types';
import { DomToModelOption } from 'roosterjs-content-model-types';
import { expectEqual, initEditor } from './testUtils';
import { IContentModelEditor } from '../../../../../lib/publicTypes/IContentModelEditor';
import { tableProcessor } from 'roosterjs-content-model-dom';

const ID = 'CM_Paste_From_WORD_Online_E2E';
const clipboardData = <ClipboardData>(<any>{
    types: ['text/plain', 'text/html'],
    text: 'asd\r\n\r\nTest ',
    image: null,
    files: [],
    customValues: {},
    snapshotBeforePaste: '<div><br></div><!--{"start":[0,0],"end":[0,0]}-->',
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
        clipboardData.rawHtml =
            '<html>\r\n<body>\r\n<!--StartFragment--><div class="OutlineElement Ltr SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: Calibri, Calibri_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW119048576 BCX8" xml:lang="EN-US" lang="EN-US" paraid="1445671679" paraeid="{56ca519d-7e7d-41fd-839e-df3f4a7a8277}{82}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; font-size: 12pt; line-height: 21.5833px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"><span class="NormalTextRun SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;">asd</span></span><span class="EOP SCXW119048576 BCX8" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559685&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:259}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 21.5833px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"> </span></p></div><div class="ListContainerWrapper SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: relative; color: rgb(0, 0, 0); font-family: Calibri, Calibri_MSFontService, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ul class="BulletListStyle1 SCXW119048576 BCX8" role="list" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; list-style-type: disc; font-family: verdana;"><li data-leveltext="" data-font="Symbol" data-listid="10" data-list-defn-props="{&quot;335552541&quot;:1,&quot;335559683&quot;:0,&quot;335559684&quot;:-2,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769226&quot;:&quot;Symbol&quot;,&quot;469769242&quot;:[8226],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="1" data-aria-level="1" role="listitem" class="OutlineElement Ltr SCXW119048576 BCX8" style="margin: 0px 0px 0px 24px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr; display: block; font-size: 12pt; font-family: Calibri, Calibri_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW119048576 BCX8" xml:lang="EN-US" lang="EN-US" paraid="797108091" paraeid="{56ca519d-7e7d-41fd-839e-df3f4a7a8277}{26}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; font-size: 12pt; line-height: 20px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"><span class="NormalTextRun SCXW119048576 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;">Test</span></span><span class="EOP SCXW119048576 BCX8" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559739&quot;:0,&quot;335559740&quot;:240}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 20px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"> </span></p></li></ul></div><!--EndFragment-->\r\n</body>\r\n</html>';
        spyOn(
            processPastedContentWacComponents,
            'processPastedContentWacComponents'
        ).and.callThrough();

        paste(editor, clipboardData);
        editor.createContentModel({
            processorOverride: {
                table: tableProcessor,
            },
        });

        expect(
            processPastedContentWacComponents.processPastedContentWacComponents
        ).toHaveBeenCalled();
    });

    it('Content from Word Online with table', () => {
        clipboardData.rawHtml =
            '<html><body><!--StartFragment--><div class="OutlineElement Ltr SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web&quot;, Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><div class="TableContainer Ltr SCXW198447319 BCX8" style="margin: 2px 0px 2px -5px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; position: relative; display: flex; justify-content: flex-start;"><table class="Table Ltr TableWordWrap SCXW198447319 BCX8" border="1" data-tablestyle="MsoTableGrid" data-tablelook="1696" aria-rowcount="1" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; table-layout: fixed; width: 0px; overflow: visible; border-collapse: collapse; empty-cells: show; position: relative; background: transparent; border-spacing: 0px;"><tbody class="SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;"><tr class="TableRow SCXW198447319 BCX8" role="row" aria-rowindex="1" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; height: 20px;"><td class="FirstRow FirstCol LastRow SCXW198447319 BCX8" role="rowheader" data-celllook="0" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; vertical-align: top; overflow: visible; position: relative; background-color: transparent; border: 1px solid; width: 312px;"><div class="TableHoverRowHandle SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; display: flex; overflow: visible; width: 15px; height: 10px; cursor: pointer; z-index: 5; background-color: transparent; bottom: -5.5px; left: -15.5px;"></div><div class="TableHoverColumnHandle SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; width: 20px; height: 12px; top: -12.5px; left: auto; cursor: pointer; z-index: 4; text-align: center; display: inline-block; background-color: transparent; right: -10.5px;"></div><div class="TableCellLeftBorderHandle SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; width: 7px; z-index: 1; background-repeat: repeat; cursor: pointer; height: calc(100% + 1px); left: -4px; top: -0.5px;"></div><div class="TableCellTopBorderHandle SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; height: 7px; z-index: 1; background-repeat: repeat; background-color: transparent; cursor: pointer; left: -0.5px; width: calc(100% + 1px); top: -4px;"></div><div class="TableColumnResizeHandle SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; bottom: 0px; overflow: visible; width: 7px; top: -0.5px; z-index: 3; background-repeat: repeat; height: calc(100% + 1px); cursor: url(&quot;https://res-v.cdn.office.net:443/officeonline/we/s/hD55E5E9C2AD2E4F5_resources/1033/ColResize.cur&quot;), pointer; right: -4px;"></div><div class="TableInsertRowGapBlank SCXW198447319 BCX8" style="margin: -3px 0px 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; height: 7px; z-index: 3; background-repeat: repeat; background-color: transparent; left: -0.5px; width: calc(100% + 1px); cursor: url(&quot;https://res-v.cdn.office.net:443/officeonline/we/s/h1E5273DBAA04AEF6_resources/1033/RowResize.cur&quot;), pointer; bottom: -4px;"></div><div class="TableCellContent SCXW198447319 BCX8" style="margin: 0px; padding: 0px 7px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible;"><div class="OutlineElement Ltr SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr;"><p class="Paragraph SCXW198447319 BCX8" xml:lang="EN-US" lang="EN-US" paraid="453525468" paraeid="{2593517c-4d19-44fe-9952-f9ea527090c7}{49}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; font-size: 11pt; line-height: 19.7625px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;">Test Table</span></span><span class="EOP SCXW198447319 BCX8" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559740&quot;:279}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 11pt; line-height: 19.7625px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif;">Â </span></p></div></div></td><td class="FirstRow LastCol LastRow SCXW198447319 BCX8" role="columnheader" data-celllook="0" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; vertical-align: top; overflow: visible; position: relative; background-color: transparent; border: 1px solid; width: 312px;"><div class="TableHoverColumnHandle SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; width: 20px; height: 12px; top: -12.5px; left: auto; cursor: pointer; z-index: 4; text-align: center; display: inline-block; background-color: transparent; right: -10.5px;"></div><div class="TableCellLeftBorderHandle SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; width: 7px; z-index: 1; background-repeat: repeat; cursor: pointer; height: calc(100% + 1px); left: -4px; top: -0.5px;"></div><div class="TableCellTopBorderHandle SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; height: 7px; z-index: 1; background-repeat: repeat; background-color: transparent; cursor: pointer; left: -0.5px; width: calc(100% + 1px); top: -4px;"></div><div class="TableColumnResizeHandle SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; bottom: 0px; overflow: visible; width: 7px; top: -0.5px; z-index: 3; background-repeat: repeat; height: calc(100% + 1px); cursor: url(&quot;https://res-v.cdn.office.net:443/officeonline/we/s/hD55E5E9C2AD2E4F5_resources/1033/ColResize.cur&quot;), pointer; right: -4px;"></div><div class="TableInsertRowGapBlank SCXW198447319 BCX8" style="margin: -3px 0px 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: absolute; overflow: visible; height: 7px; z-index: 3; background-repeat: repeat; background-color: transparent; left: -0.5px; width: calc(100% + 1px); cursor: url(&quot;https://res-v.cdn.office.net:443/officeonline/we/s/h1E5273DBAA04AEF6_resources/1033/RowResize.cur&quot;), pointer; bottom: -4px;"></div><div class="TableCellContent SCXW198447319 BCX8" style="margin: 0px; padding: 0px 7px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible;"><div class="OutlineElement Ltr SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr;"><p class="Paragraph SCXW198447319 BCX8" xml:lang="EN-US" lang="EN-US" paraid="71386661" paraeid="{2593517c-4d19-44fe-9952-f9ea527090c7}{55}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; font-size: 11pt; line-height: 19.7625px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;">Test Table</span></span><span class="EOP SCXW198447319 BCX8" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559740&quot;:279}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 11pt; line-height: 19.7625px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif;">Â </span></p></div></div></td></tr></tbody></table></div></div><div class="OutlineElement Ltr SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr; color: rgb(0, 0, 0); font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web&quot;, Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p class="Paragraph SCXW198447319 BCX8" xml:lang="EN-US" lang="EN-US" paraid="2074601169" paraeid="{2593517c-4d19-44fe-9952-f9ea527090c7}{39}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; font-size: 12pt; line-height: 20.925px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif;"><span class="NormalTextRun SCXW198447319 BCX8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;"></span></span><span class="EOP SCXW198447319 BCX8" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:279}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 20.925px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif;">Â </span></p></div><!--EndFragment--></body></html>';

        paste(editor, clipboardData);

        const model = editor.createContentModel(<DomToModelOption>{
            processorOverride: {
                table: tableProcessor,
            },
        });

        expectEqual(model, {
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
                                    blockType: 'Table',
                                    rows: [
                                        {
                                            height: 0,
                                            format: {},
                                            cells: [
                                                {
                                                    blockGroupType: 'TableCell',
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
                                                                            text: 'Test TableÂ ',
                                                                            format: {
                                                                                letterSpacing:
                                                                                    'normal',
                                                                                fontFamily:
                                                                                    'Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif',
                                                                                fontSize: '11pt',
                                                                                italic: false,
                                                                                fontWeight:
                                                                                    'normal',
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                lineHeight:
                                                                                    '19.7625px',
                                                                            },
                                                                        },
                                                                    ],
                                                                    format: {
                                                                        direction: 'ltr',
                                                                        textAlign: 'start',
                                                                        whiteSpace: 'pre-wrap',
                                                                        marginLeft: '0px',
                                                                        marginRight: '0px',
                                                                        marginTop: '0px',
                                                                        marginBottom: '0px',
                                                                    },
                                                                    segmentFormat: {
                                                                        fontWeight: 'normal',
                                                                    },
                                                                    decorator: {
                                                                        tagName: 'p',
                                                                        format: {},
                                                                    },
                                                                },
                                                            ],
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'start',
                                                                whiteSpace: 'normal',
                                                                marginTop: '0px',
                                                                marginRight: '0px',
                                                                marginBottom: '0px',
                                                                marginLeft: '0px',
                                                                paddingTop: '0px',
                                                                paddingRight: '7px',
                                                                paddingBottom: '0px',
                                                                paddingLeft: '7px',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'start',
                                                        whiteSpace: 'normal',
                                                        borderTop: '1px solid',
                                                        borderRight: '1px solid',
                                                        borderBottom: '1px solid',
                                                        borderLeft: '1px solid',
                                                        verticalAlign: 'top',
                                                        width: '312px',
                                                    },
                                                    spanLeft: false,
                                                    spanAbove: false,
                                                    isHeader: false,
                                                    dataset: {
                                                        celllook: '0',
                                                    },
                                                },
                                                {
                                                    blockGroupType: 'TableCell',
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
                                                                            text: 'Test TableÂ ',
                                                                            format: {
                                                                                letterSpacing:
                                                                                    'normal',
                                                                                fontFamily:
                                                                                    'Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif',
                                                                                fontSize: '11pt',
                                                                                italic: false,
                                                                                fontWeight:
                                                                                    'normal',
                                                                                textColor:
                                                                                    'rgb(0, 0, 0)',
                                                                                lineHeight:
                                                                                    '19.7625px',
                                                                            },
                                                                        },
                                                                    ],
                                                                    format: {
                                                                        direction: 'ltr',
                                                                        textAlign: 'start',
                                                                        whiteSpace: 'pre-wrap',
                                                                        marginLeft: '0px',
                                                                        marginRight: '0px',
                                                                        marginTop: '0px',
                                                                        marginBottom: '0px',
                                                                    },
                                                                    segmentFormat: {
                                                                        fontWeight: 'normal',
                                                                    },
                                                                    decorator: {
                                                                        tagName: 'p',
                                                                        format: {},
                                                                    },
                                                                },
                                                            ],
                                                            format: {
                                                                direction: 'ltr',
                                                                textAlign: 'start',
                                                                whiteSpace: 'normal',
                                                                marginTop: '0px',
                                                                marginRight: '0px',
                                                                marginBottom: '0px',
                                                                marginLeft: '0px',
                                                                paddingTop: '0px',
                                                                paddingRight: '7px',
                                                                paddingBottom: '0px',
                                                                paddingLeft: '7px',
                                                            },
                                                        },
                                                    ],
                                                    format: {
                                                        direction: 'ltr',
                                                        textAlign: 'start',
                                                        whiteSpace: 'normal',
                                                        borderTop: '1px solid',
                                                        borderRight: '1px solid',
                                                        borderBottom: '1px solid',
                                                        borderLeft: '1px solid',
                                                        verticalAlign: 'top',
                                                        width: '312px',
                                                    },
                                                    spanLeft: false,
                                                    spanAbove: false,
                                                    isHeader: false,
                                                    dataset: {
                                                        celllook: '0',
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                    format: {
                                        direction: 'ltr',
                                        textAlign: 'start',
                                        whiteSpace: 'normal',
                                        backgroundColor: 'transparent',
                                        marginTop: '0px',
                                        marginRight: '0px',
                                        marginBottom: '0px',
                                        marginLeft: '0px',
                                        width: '0px',
                                        tableLayout: 'fixed',
                                        borderCollapse: true,
                                    },
                                    widths: [],
                                    dataset: {
                                        tablestyle: 'MsoTableGrid',
                                        tablelook: '1696',
                                    },
                                },
                            ],
                            format: {
                                direction: 'ltr',
                                textAlign: 'start',
                                whiteSpace: 'normal',
                                marginTop: '2px',
                                marginRight: '0px',
                                marginBottom: '2px',
                            },
                        },
                    ],
                    format: {
                        direction: 'ltr',
                        textAlign: 'start',
                        whiteSpace: 'normal',
                        backgroundColor: 'rgb(255, 255, 255)',
                        marginTop: '0px',
                        marginRight: '0px',
                        marginBottom: '0px',
                        marginLeft: '0px',
                    },
                },
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
                                    text: 'Â ',
                                    format: {
                                        letterSpacing: 'normal',
                                        fontFamily:
                                            'Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif',
                                        fontSize: '12pt',
                                        italic: false,
                                        fontWeight: 'normal',
                                        textColor: 'rgb(0, 0, 0)',
                                        lineHeight: '20.925px',
                                    },
                                },
                            ],
                            format: {
                                direction: 'ltr',
                                textAlign: 'start',
                                whiteSpace: 'pre-wrap',
                                marginTop: '0px',
                                marginRight: '0px',
                                marginBottom: '0px',
                                marginLeft: '0px',
                            },
                            segmentFormat: {
                                fontWeight: 'normal',
                            },
                            decorator: {
                                tagName: 'p',
                                format: {},
                            },
                        },
                    ],
                    format: {
                        direction: 'ltr',
                        textAlign: 'start',
                        whiteSpace: 'normal',
                        backgroundColor: 'rgb(255, 255, 255)',
                        marginTop: '0px',
                        marginRight: '0px',
                        marginBottom: '0px',
                        marginLeft: '0px',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        });
    });
});
