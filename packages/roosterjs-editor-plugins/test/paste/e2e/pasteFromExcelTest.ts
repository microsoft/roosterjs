import * as convertPastedContentFromExcel from '../../../lib/plugins/Paste/excelConverter/convertPastedContentFromExcel';
import { ClipboardData, IEditor } from 'roosterjs-editor-types';
import { initEditor } from '../../TestHelper';
import { Paste } from '../../../lib/index';

const ID = 'Paste_From_Excel_E2E';

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
        spyOn(convertPastedContentFromExcel, 'excelHandler').and.callThrough();

        const clipboardData = <ClipboardData>(<any>{
            types: ['image/png', 'text/plain', 'text/html'],
            text: 'Test\tTest\r\n',
            image: {},
            files: [],
            rawHtml: '<html xmlns:v="urn:schemas-microsoft-com:vml"\r\nxmlns:o="urn:schemas-microsoft-com:office:office"\r\nxmlns:x="urn:schemas-microsoft-com:office:excel"\r\nxmlns="http://www.w3.org/TR/REC-html40">\r\n\r\n<head>\r\n<meta http-equiv=Content-Type content="text/html; charset=utf-8">\r\n<meta name=ProgId content=Excel.Sheet>\r\n<meta name=Generator content="Microsoft Excel 15">\r\n<link id=Main-File rel=Main-File\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip.htm">\r\n<link rel=File-List\r\nhref="file:///C:/Users/BVALVE~1/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">\r\n<style>\r\n<!--table\r\n\t{mso-displayed-decimal-separator:"\\.";\r\n\tmso-displayed-thousand-separator:"\\,";}\r\n@page\r\n\t{margin:.75in .7in .75in .7in;\r\n\tmso-header-margin:.3in;\r\n\tmso-footer-margin:.3in;}\r\ntr\r\n\t{mso-height-source:auto;}\r\ncol\r\n\t{mso-width-source:auto;}\r\nbr\r\n\t{mso-data-placement:same-cell;}\r\ntd\r\n\t{padding-top:1px;\r\n\tpadding-right:1px;\r\n\tpadding-left:1px;\r\n\tmso-ignore:padding;\r\n\tcolor:black;\r\n\tfont-size:11.0pt;\r\n\tfont-weight:400;\r\n\tfont-style:normal;\r\n\ttext-decoration:none;\r\n\tfont-family:"Aptos Narrow", sans-serif;\r\n\tmso-font-charset:0;\r\n\tmso-number-format:General;\r\n\ttext-align:general;\r\n\tvertical-align:bottom;\r\n\tborder:none;\r\n\tmso-background-source:auto;\r\n\tmso-pattern:auto;\r\n\tmso-protection:locked visible;\r\n\twhite-space:nowrap;\r\n\tmso-rotate:0;}\r\n-->\r\n</style>\r\n</head>\r\n\r\n<body link="#467886" vlink="#96607D">\r\n\r\n<table border=0 cellpadding=0 cellspacing=0 width=134 style=\'border-collapse:\r\n collapse;width:100pt\'>\r\n <col width=67 span=2 style=\'width:50pt\'>\r\n <tr height=19 style=\'height:14.4pt\'>\r\n<!--StartFragment-->\r\n  <td height=19 width=67 style=\'height:14.4pt;width:50pt\'>Test</td>\r\n  <td width=67 style=\'width:50pt\'>Test</td>\r\n<!--EndFragment-->\r\n </tr>\r\n</table>\r\n\r\n</body>\r\n\r\n</html>\r\n'.replace(
                '\r\n',
                ''
            ),
            customValues: {},
            imageDataUri:
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVEAAAAxCAYAAABj9ZqsAAAESUlEQVR4nO3dO3LySBSG4Y+pfx8kkgOXVyCtQDj5I6eTNSEkkzmcbBIRQubU0SRuVoBWQDmwFEgr6Qm4GDDCQHMR4/epUhVGUltUfT4I0TpulWXpBAA4yi9Jarfb1z4OYKuqqsgnGquqKv1x7YMAgFtGEQUADxRRAPBAEQUADxRRAPBAEQUADxRRAPBAEQUADxRRAPBAEQUADxRRAPBAEQUAD7VFdNxtqdU6cokHKi75KvDjkE80BWeiAODhV92K8N7ImC0rpiONsvnjKJJ5ePi6zf3daY7upAoN4lD9TJIipflEveDax4RjkU80RW0RDXpDDbc8XwymGmXzlD48azhMznRoQD3yiabg4zwAeKCIAoCHyxbRYqxBN1a89m1prDjualzs+X3pYox4/RvXOO5qMP46RjGI59ssrjdJUqZ+uLp/V+OTvUjcLPKJY5Rl6Q6Rp5GTNFuMPW6/miUy1uWeYygyzh66j9b3QXOQT/LZZGVZussUUWtWQhQ5k1qX5/lssakzkb4fc3UMHTBGbp211tm1bWb7z563ztp85x8Hrod8ks8mu1ARtc4sA5rWhCF31nyG7OuwuUtXApZuHeS7bfYZA01DPtFkZVm6s18TLQZ/ayRJipS+9LR96lug5K9U0fyn0b+bV4ByvS+vFz3obusggXovVtZaWfusR+bYYQ/kE77OXEQLvb3O0xU97Q5O8Kinz5RuXEgPdb9Yp6k+6q7xB4mSZLaQUXyPfMJf7WT701h9h5ZUFDvvWb57kJRJiyAmy6QFK+sy9cNYsi/qJUQRPsgn/J23iBYfmi4eZ32FYf/ooZKhlZl25rf0Zep3QvUlRSbV0+9HPSYB7+44DPnECdzQZPtEw0kua6K1Z7NRX/1OqHA+F2/LVDzgAsjnT3W5ImqsnHN7LnXNFwIlw4mcy5XbVCbaCGw2UidsqUtScSjyiSNdrohOP07YwzFQkPQ0nEzknFOeW62eAIw6f2pATnEI8okjnbeIBndaNiLL3pWf69cEiYYTJ7tsjZbp9Y2U4hvkEydw5jPRPad+nMjqXL7s/Vx/Evj/IJ/wd+YiGuhxObkuU/+fXW0UxurWNVwYdxXHseI4Vvfoz0HzaSjAEvmEv7NfEw16z1p+ihl11K3J6eedI5LMb6210g3vpSxTlmUavb7VXrsq3l61bGp+H+44qkycCEAinziBizd4kFxkUmcXzRly61Kz2slm+33Dq/cuKzIutflng4c9x9hsEpHS4KHxyCf5bLLLdXFyzuXWuOjbll+7Gi+sNmg49Ri0Gmsq8kk+m+wiDUgWgmSoSZ7LpkYb0+dm/1Astcpr599JUqDeZDZdJDWRvg6x7xizCdGb++NnI584VqssS9dut699HMBWVVWJfKKpqqq6pds+AaB5KKIA4IEiCgAeKKIA4IEiCgAeKKIA4IEiCgAeKKIA4IEiCgAeWmVZumsfBADcqv8Ai4RWETveacsAAAAASUVORK5CYII=',
            snapshotBeforePaste: '<div><br></div><!--{"start":[0,0],"end":[0,0]}-->',
        });

        editor.paste(clipboardData);
        const el = document.getElementById(ID)?.querySelector('table') as HTMLTableElement;
        expect(el).toBeDefined();
        expect(el.tBodies.length).toEqual(1);
        expect(el.rows.length).toEqual(1);
        expect(el.rows.item(0)?.cells.length).toEqual(2);
        expect(el.rows.item(0)?.cells.item(0)?.textContent).toEqual('Test');
        expect(el.rows.item(0)?.cells.item(1)?.textContent).toEqual('Test');

        expect(convertPastedContentFromExcel.default).toHaveBeenCalled();
        expect(convertPastedContentFromExcel.excelHandler).toHaveBeenCalled();
    });
});
