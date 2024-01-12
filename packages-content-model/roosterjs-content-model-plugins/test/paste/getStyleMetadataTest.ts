import getStyleMetadata from '../../lib/paste/WordDesktop/getStyleMetadata';
import { BeforePasteEvent } from 'roosterjs-content-model-types';

describe('getStyleMetadata', () => {
    it('Extract metadata from style element', () => {
        const event = <BeforePasteEvent>(<any>{
            htmlBefore:
                '<style><!--/*FontDefinitions*/@font-face{font-family:"MSMincho";panose-1:2269425834;mso-font-alt:"ＭＳ明朝";mso-font-charset:128;mso-generic-font-family:modern;mso-font-pitch:fixed;mso-font-signature:-536870145179149157913421774601312310;}@font-face{font-family:"CambriaMath";panose-1:2453546324;mso-font-charset:0;mso-generic-font-family:roman;mso-font-pitch:variable;mso-font-signature:-53686912111073057273355443204150;}@font-face{font-family:Aptos;mso-font-charset:0;mso-generic-font-family:swiss;mso-font-pitch:variable;mso-font-signature:5368715593004150;}@font-face{font-family:"@MSMincho";panose-1:2269425834;mso-font-charset:128;mso-generic-font-family:modern;mso-font-pitch:fixed;mso-font-signature:-536870145179149157913421774601312310;}/*StyleDefinitions*/p.MsoNormal,li.MsoNormal,div.MsoNormal{mso-style-unhide:no;mso-style-qformat:yes;mso-style-parent:"";margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:116%;mso-pagination:widow-orphan;font-size:12.0pt;font-family:"Aptos",sans-serif;mso-ascii-font-family:Aptos;mso-ascii-theme-font:minor-latin;mso-fareast-font-family:"MSMincho";mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:Aptos;mso-hansi-theme-font:minor-latin;mso-bidi-font-family:Arial;mso-bidi-theme-font:minor-bidi;}p.MsoListParagraph,li.MsoListParagraph,div.MsoListParagraph{mso-style-priority:34;mso-style-unhide:no;mso-style-qformat:yes;margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:.5in;mso-add-space:auto;line-height:116%;mso-pagination:widow-orphan;font-size:12.0pt;font-family:"Aptos",sans-serif;mso-ascii-font-family:Aptos;mso-ascii-theme-font:minor-latin;mso-fareast-font-family:"MSMincho";mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:Aptos;mso-hansi-theme-font:minor-latin;mso-bidi-font-family:Arial;mso-bidi-theme-font:minor-bidi;}p.MsoListParagraphCxSpFirst,li.MsoListParagraphCxSpFirst,div.MsoListParagraphCxSpFirst{mso-style-priority:34;mso-style-unhide:no;mso-style-qformat:yes;mso-style-type:export-only;margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;mso-add-space:auto;line-height:116%;mso-pagination:widow-orphan;font-size:12.0pt;font-family:"Aptos",sans-serif;mso-ascii-font-family:Aptos;mso-ascii-theme-font:minor-latin;mso-fareast-font-family:"MSMincho";mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:Aptos;mso-hansi-theme-font:minor-latin;mso-bidi-font-family:Arial;mso-bidi-theme-font:minor-bidi;}p.MsoListParagraphCxSpMiddle,li.MsoListParagraphCxSpMiddle,div.MsoListParagraphCxSpMiddle{mso-style-priority:34;mso-style-unhide:no;mso-style-qformat:yes;mso-style-type:export-only;margin-top:0in;margin-right:0in;margin-bottom:0in;margin-left:.5in;mso-add-space:auto;line-height:116%;mso-pagination:widow-orphan;font-size:12.0pt;font-family:"Aptos",sans-serif;mso-ascii-font-family:Aptos;mso-ascii-theme-font:minor-latin;mso-fareast-font-family:"MSMincho";mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:Aptos;mso-hansi-theme-font:minor-latin;mso-bidi-font-family:Arial;mso-bidi-theme-font:minor-bidi;}p.MsoListParagraphCxSpLast,li.MsoListParagraphCxSpLast,div.MsoListParagraphCxSpLast{mso-style-priority:34;mso-style-unhide:no;mso-style-qformat:yes;mso-style-type:export-only;margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:.5in;mso-add-space:auto;line-height:116%;mso-pagination:widow-orphan;font-size:12.0pt;font-family:"Aptos",sans-serif;mso-ascii-font-family:Aptos;mso-ascii-theme-font:minor-latin;mso-fareast-font-family:"MSMincho";mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:Aptos;mso-hansi-theme-font:minor-latin;mso-bidi-font-family:Arial;mso-bidi-theme-font:minor-bidi;}.MsoChpDefault{mso-style-type:export-only;mso-default-props:yes;font-family:"Aptos",sans-serif;mso-ascii-font-family:Aptos;mso-ascii-theme-font:minor-latin;mso-fareast-font-family:"MSMincho";mso-fareast-theme-font:minor-fareast;mso-hansi-font-family:Aptos;mso-hansi-theme-font:minor-latin;mso-bidi-font-family:Arial;mso-bidi-theme-font:minor-bidi;mso-font-kerning:0pt;mso-ligatures:none;}.MsoPapDefault{mso-style-type:export-only;margin-bottom:8.0pt;line-height:116%;}@pageWordSection1{size:8.5in11.0in;margin:1.0in1.0in1.0in1.0in;mso-header-margin:.5in;mso-footer-margin:.5in;mso-paper-source:0;}div.WordSection1{page:WordSection1;}/*ListDefinitions*/@listl0{mso-list-id:1153643359;mso-list-type:hybrid;mso-list-template-ids:133990276544500572-1-1-1-1-1-1-1-1;}@listl0:level1{mso-level-number-format:roman-upper;mso-level-text:"%1)";mso-level-tab-stop:none;mso-level-number-position:right;text-indent:-.25in;}@listl0:level2{mso-level-number-format:alpha-lower;mso-level-tab-stop:none;mso-level-number-position:left;text-indent:-.25in;}@listl0:level3{mso-level-number-format:roman-lower;mso-level-tab-stop:none;mso-level-number-position:right;text-indent:-9.0pt;}@listl0:level4{mso-level-tab-stop:none;mso-level-number-position:left;text-indent:-.25in;}@listl0:level5{mso-level-number-format:alpha-lower;mso-level-tab-stop:none;mso-level-number-position:left;text-indent:-.25in;}@listl0:level6{mso-level-number-format:roman-lower;mso-level-tab-stop:none;mso-level-number-position:right;text-indent:-9.0pt;}@listl0:level7{mso-level-tab-stop:none;mso-level-number-position:left;text-indent:-.25in;}@listl0:level8{mso-level-number-format:alpha-lower;mso-level-tab-stop:none;mso-level-number-position:left;text-indent:-.25in;}@listl0:level9{mso-level-number-format:roman-lower;mso-level-tab-stop:none;mso-level-number-position:right;text-indent:-9.0pt;}ol{margin-bottom:0in;}ul{margin-bottom:0in;}--></style>',
        });
        const result = getStyleMetadata(event, (val: string) => val);

        expect(result.get('l0:level1')).toEqual({
            'mso-level-number-format': 'roman-upper',
            'mso-level-start-at': '1',
            'mso-level-text': '%1)',
        });
        expect(result.get('l0:level2')).toEqual({
            'mso-level-number-format': 'alpha-lower',
            'mso-level-start-at': '1',
            'mso-level-text': undefined,
        });
        expect(result.get('l0:level3')).toEqual({
            'mso-level-number-format': 'roman-lower',
            'mso-level-start-at': '1',
            'mso-level-text': undefined,
        });
        expect(result.get('l0:level4')).toEqual({
            'mso-level-number-format': undefined,
            'mso-level-start-at': '1',
            'mso-level-text': undefined,
        });
        expect(result.get('l0:level5')).toEqual({
            'mso-level-number-format': 'alpha-lower',
            'mso-level-start-at': '1',
            'mso-level-text': undefined,
        });
        expect(result.get('l0:level6')).toEqual({
            'mso-level-number-format': 'roman-lower',
            'mso-level-start-at': '1',
            'mso-level-text': undefined,
        });
        expect(result.get('l0:level7')).toEqual({
            'mso-level-number-format': undefined,
            'mso-level-start-at': '1',
            'mso-level-text': undefined,
        });
        expect(result.get('l0:level8')).toEqual({
            'mso-level-number-format': 'alpha-lower',
            'mso-level-start-at': '1',
            'mso-level-text': undefined,
        });
        expect(result.get('l0:level9')).toEqual({
            'mso-level-number-format': 'roman-lower',
            'mso-level-start-at': '1',
            'mso-level-text': undefined,
        });
        expect(result.get('l0:level10')).toEqual(undefined);
    });
});
