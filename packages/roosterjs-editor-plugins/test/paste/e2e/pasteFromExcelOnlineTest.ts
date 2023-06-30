import * as convertPastedContentFromExcel from '../../../lib/plugins/Paste/excelConverter/convertPastedContentFromExcel';
import * as moveChildNodes from 'roosterjs-editor-dom/lib/utils/moveChildNodes';
import { ClipboardData, IEditor } from 'roosterjs-editor-types';
import { initEditor } from '../../TestHelper';
import { Paste } from '../../../lib/index';

const ID = 'Paste_From_ExcelOnline_E2E';
const clipboardData = <ClipboardData>(<any>{
    types: ['text/plain', 'text/html'],
    text: 'Test\tTest',
    image: null,
    files: [],
    rawHtml:
        "<html>\r\n<body>\r\n<!--StartFragment--><div ccp_infra_version='3' ccp_infra_timestamp='1687871836672' ccp_infra_user_hash='1011877142' ccp_infra_copy_id='edfc2633-1068-4e16-9f9a-02e650eb665e' data-ccp-timestamp='1687871836672'><html><head><meta http-equiv=Content-Type content=\"text/html; charset=utf-8\"><meta name=ProgId content=Excel.Sheet><meta name=Generator content=\"Microsoft Excel 15\"><style>table\r\n\t{mso-displayed-decimal-separator:\"\\.\";\r\n\tmso-displayed-thousand-separator:\"\\,\";}\r\ntr\r\n\t{mso-height-source:auto;}\r\ncol\r\n\t{mso-width-source:auto;}\r\ntd\r\n\t{padding-top:1px;\r\n\tpadding-right:1px;\r\n\tpadding-left:1px;\r\n\tmso-ignore:padding;\r\n\tcolor:black;\r\n\tfont-size:11.0pt;\r\n\tfont-weight:400;\r\n\tfont-style:normal;\r\n\ttext-decoration:none;\r\n\tfont-family:Calibri, sans-serif;\r\n\tmso-font-charset:0;\r\n\ttext-align:general;\r\n\tvertical-align:bottom;\r\n\tborder:none;\r\n\twhite-space:nowrap;\r\n\tmso-rotate:0;}\r\n</style></head><body link=\"#0563C1\" vlink=\"#954F72\"><table width=128 style='border-collapse:collapse;width:96pt'><!--StartFragment--><col width=64 style='width:48pt' span=2><tr height=20 style='height:15.0pt'><td width=64 height=20 style='width:48pt;height:15.0pt'>Test</td><td width=64 style='width:48pt'>Test</td></tr><!--EndFragment--></table></body></html></div><!--EndFragment-->\r\n</body>\r\n</html>",
    customValues: {},
    snapshotBeforePaste: '<br><!--{"start":[0],"end":[0]}-->',
    htmlFirstLevelChildTags: ['DIV'],
    html:
        "<div ccp_infra_version='3' ccp_infra_timestamp='1687871836672' ccp_infra_user_hash='1011877142' ccp_infra_copy_id='edfc2633-1068-4e16-9f9a-02e650eb665e' data-ccp-timestamp='1687871836672'><html><head><meta http-equiv=Content-Type content=\"text/html; charset=utf-8\"><meta name=ProgId content=Excel.Sheet><meta name=Generator content=\"Microsoft Excel 15\"><style>table\r\n\t{mso-displayed-decimal-separator:\"\\.\";\r\n\tmso-displayed-thousand-separator:\"\\,\";}\r\ntr\r\n\t{mso-height-source:auto;}\r\ncol\r\n\t{mso-width-source:auto;}\r\ntd\r\n\t{padding-top:1px;\r\n\tpadding-right:1px;\r\n\tpadding-left:1px;\r\n\tmso-ignore:padding;\r\n\tcolor:black;\r\n\tfont-size:11.0pt;\r\n\tfont-weight:400;\r\n\tfont-style:normal;\r\n\ttext-decoration:none;\r\n\tfont-family:Calibri, sans-serif;\r\n\tmso-font-charset:0;\r\n\ttext-align:general;\r\n\tvertical-align:bottom;\r\n\tborder:none;\r\n\twhite-space:nowrap;\r\n\tmso-rotate:0;}\r\n</style></head><body link=\"#0563C1\" vlink=\"#954F72\"><table width=128 style='border-collapse:collapse;width:96pt'><!--StartFragment--><col width=64 style='width:48pt' span=2><tr height=20 style='height:15.0pt'><td width=64 height=20 style='width:48pt;height:15.0pt'>Test</td><td width=64 style='width:48pt'>Test</td></tr><!--EndFragment--></table></body></html></div>",
});

describe(ID, () => {
    let editor: IEditor = undefined!;

    beforeEach(() => {
        editor = initEditor(ID, [new Paste()]);
    });

    afterEach(() => {
        document.getElementById(ID)?.remove();
    });

    it('E2E', () => {
        spyOn(convertPastedContentFromExcel, 'default').and.callThrough();
        spyOn(moveChildNodes, 'default').and.callThrough();

        editor.paste(clipboardData);

        expect(convertPastedContentFromExcel.default).toHaveBeenCalled();
        expect(moveChildNodes.default).toHaveBeenCalledTimes(1);
    });

    it('E2E paste a simage', () => {
        spyOn(convertPastedContentFromExcel, 'default').and.callThrough();
        spyOn(moveChildNodes, 'default').and.callThrough();

        editor.paste(
            clipboardData,
            false /* asText */,
            false /* applyCurrentFormat */,
            true /* pasteImage */
        );

        expect(convertPastedContentFromExcel.default).not.toHaveBeenCalled();
        expect(moveChildNodes.default).toHaveBeenCalledTimes(1);
    });
});
