import createEditorCore from './createMockEditorCore';
import { getPendableFormatState } from '../../lib/coreApi/getPendableFormatState';
import { PendableFormatState } from 'roosterjs-editor-types';

describe('getPendableFormatState', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    function runTest(content: string, expectedFormat: PendableFormatState) {
        const core = createEditorCore(div, {});
        core.api.setContent(core, content, true);
        const format = getPendableFormatState(core, false /*forceGetStateFromDom*/);
        expect(format).toEqual(expectedFormat);
    }

    it('underline with u tag', () => {
        runTest(
            '<div style="font-family: arial; font-size: 12pt; color: black; background-color: white"><u>test</u></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: true,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('underline with u tag collapsed cursor', () => {
        runTest(
            '<div style="font-family: arial; font-size: 12pt; color: black; background-color: white"><u>test</u></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: true,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('underline with css style u tag', () => {
        runTest(
            '<div style="text-decoration: underline"><div style="">test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: true,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('bold with b tag', () => {
        runTest('<div><b>test</b></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('bold with strong tag', () => {
        runTest('<div><strong>test</strong></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('bold with h1 tag', () => {
        runTest('<div><h1>test</h1></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('bold with strong tag collapsed cursor', () => {
        runTest('<div><strong>test</strong></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->', {
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('bold with style css style font-weight: bold', () => {
        runTest(
            '<div><div style="font-weight: bold">test</div style="font-weight: bold"></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('bold with css style font-weight: bolder', () => {
        runTest(
            '<div><div style="font-weight: bolder">test</div style="font-weight: bolder"></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('bold with css style font-weight: 700', () => {
        runTest(
            '<div><div style="font-weight: bolder">test</div style="font-weight: 700"></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('italic with tag I ', () => {
        runTest('<div><i>test</i></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: true,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('italic with tag I collapsed cursor', () => {
        runTest('<div><i>test</i></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: true,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('italic with tag EM ', () => {
        runTest('<div><em>test</em></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: true,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('italic with css style font-style:italic ', () => {
        runTest(
            '<div><div style="font-style:italic">test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: true,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('Subscript with css style vertical-align: sub ', () => {
        runTest(
            '<div><div style="vertical-align:sub">test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: true,
                isSuperscript: false,
            }
        );
    });

    it('Subscript with tag SUB ', () => {
        runTest('<div><sub>test</sub></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: true,
            isSuperscript: false,
        });
    });

    it('Subscript with tag SUB collapsed cursor ', () => {
        runTest('<div><sub>test</sub></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: true,
            isSuperscript: false,
        });
    });

    it('Superscript with tag SUP ', () => {
        runTest('<div><sup>test</sup></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: true,
        });
    });

    it('Superscript with tag SUP collapsed cursor ', () => {
        runTest('<div><sup>test</sup></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: true,
        });
    });

    it('Superscript with css style vertical-align: super', () => {
        runTest(
            '<div><div style="vertical-align: super">test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: true,
            }
        );
    });

    it('StrikeThrough with css style text-decoration: line-through', () => {
        runTest(
            '<div><div style="text-decoration: line-through">test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: true,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('StrikeThrough with tag STRIKE ', () => {
        runTest('<div><strike>test</strike></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: true,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('StrikeThrough with tag STRIKE with collapsed cursor', () => {
        runTest('<div><strike>test</strike></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: true,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('StrikeThrough with tag S ', () => {
        runTest('<div><s>test</s></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: true,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('check all formats with tags ', () => {
        runTest(
            '<div><s><u><i><b><sup><sub>test</sub></sup></b></i></u></s></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: true,
                isUnderline: true,
                isStrikeThrough: true,
                isSubscript: true,
                isSuperscript: true,
            }
        );
    });

    it('check all formats with tags with collapsed cursor ', () => {
        runTest(
            '<div><s><u><i><b><sup><sub>test</sub></sup></b></i></u></s></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: true,
                isUnderline: true,
                isStrikeThrough: true,
                isSubscript: true,
                isSuperscript: true,
            }
        );
    });

    it('check all formats with css style ', () => {
        runTest(
            '<div><div style="text-decoration: underline line-through; font-weight: bold; vertical-align:super; font-style: italic" >test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: true,
                isUnderline: true,
                isStrikeThrough: true,
                isSubscript: false,
                isSuperscript: true,
            }
        );
    });

    it('check all formats with css style mixed with tags ', () => {
        runTest(
            '<div><div style="text-decoration: underline; font-weight: bold; vertical-align:sub"><s><i>test</i></s></div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: true,
                isUnderline: true,
                isStrikeThrough: true,
                isSubscript: true,
                isSuperscript: false,
            }
        );
    });

    it('check all formats with css style mixed with tags witj collapsed cursor ', () => {
        runTest(
            '<div><div style="text-decoration: underline; font-weight: bold; vertical-align:sub"><s><i>test</i></s></div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: true,
                isUnderline: true,
                isStrikeThrough: true,
                isSubscript: true,
                isSuperscript: false,
            }
        );
    });

    it('check css style that overlay tags', () => {
        runTest(
            '<div ><b><div style="font-weight: normal;">test</div><b></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('check css style that overlay tags with collapsed cursor', () => {
        runTest(
            '<div ><b><div style="font-weight: normal;">test</div><b></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('check css style that overlay css styles', () => {
        runTest(
            '<div><div style="text-decoration: underline; font-weight:bold;"><div style="font-weight: normal;">test</div></div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: true,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('check css style that overlay css styles with collapsed cursor', () => {
        runTest(
            '<div><div style="text-decoration: underline; font-weight:bold;"><div style="font-weight: normal;">test</div></div></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: true,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('check focus out of format range', () => {
        runTest('<div>abcd<strong>sasa<strong></div><!--{"start":[0,0,1],"end":[0,0,3]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('check focus in format range', () => {
        runTest(
            '<div>gdfgfdgdf<b>gdfgfdgdfgdf</b></div><!--{"start":[0,1,0,11],"end":[0,1,0,11]}-->',
            {
                isBold: true,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });
});

describe('getPendableFormatState with ignoreImplicitStyles=true', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    function runTest(content: string, expectedFormat: PendableFormatState) {
        const core = createEditorCore(div, {});
        core.api.setContent(core, content, true);
        const format = getPendableFormatState(
            core,
            false /*forceGetStateFromDom*/,
            true /*ignoreImplicitStyles*/
        );
        expect(format).toEqual(expectedFormat);
    }

    it('underline with u tag', () => {
        runTest(
            '<div style="font-family: arial; font-size: 12pt; color: black; background-color: white"><u>test</u></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: true,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('underline with u tag collapsed cursor', () => {
        runTest(
            '<div style="font-family: arial; font-size: 12pt; color: black; background-color: white"><u>test</u></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: true,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('underline with css style u tag', () => {
        runTest(
            '<div style="text-decoration: underline"><div style="">test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: true,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('bold with b tag', () => {
        runTest('<div><b>test</b></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('bold with strong tag', () => {
        runTest('<div><strong>test</strong></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('bold with h1 tag', () => {
        runTest('<div><h1>test</h1></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('bold with strong tag collapsed cursor', () => {
        runTest('<div><strong>test</strong></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->', {
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('bold with style css style font-weight: bold', () => {
        runTest(
            '<div><div style="font-weight: bold">test</div style="font-weight: bold"></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('bold with css style font-weight: bolder', () => {
        runTest(
            '<div><div style="font-weight: bolder">test</div style="font-weight: bolder"></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('bold with css style font-weight: 700', () => {
        runTest(
            '<div><div style="font-weight: bolder">test</div style="font-weight: 700"></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('italic with tag I ', () => {
        runTest('<div><i>test</i></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: true,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('italic with tag I collapsed cursor', () => {
        runTest('<div><i>test</i></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: true,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('italic with tag EM ', () => {
        runTest('<div><em>test</em></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: true,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('italic with css style font-style:italic ', () => {
        runTest(
            '<div><div style="font-style:italic">test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: true,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('Subscript with css style vertical-align: sub ', () => {
        runTest(
            '<div><div style="vertical-align:sub">test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: true,
                isSuperscript: false,
            }
        );
    });

    it('Subscript with tag SUB ', () => {
        runTest('<div><sub>test</sub></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: true,
            isSuperscript: false,
        });
    });

    it('Subscript with tag SUB collapsed cursor ', () => {
        runTest('<div><sub>test</sub></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: true,
            isSuperscript: false,
        });
    });

    it('Superscript with tag SUP ', () => {
        runTest('<div><sup>test</sup></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: true,
        });
    });

    it('Superscript with tag SUP collapsed cursor ', () => {
        runTest('<div><sup>test</sup></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: true,
        });
    });

    it('Superscript with css style vertical-align: super', () => {
        runTest(
            '<div><div style="vertical-align: super">test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: true,
            }
        );
    });

    it('StrikeThrough with css style text-decoration: line-through', () => {
        runTest(
            '<div><div style="text-decoration: line-through">test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: true,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('StrikeThrough with tag STRIKE ', () => {
        runTest('<div><strike>test</strike></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: true,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('StrikeThrough with tag STRIKE with collapsed cursor', () => {
        runTest('<div><strike>test</strike></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: true,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('StrikeThrough with tag S ', () => {
        runTest('<div><s>test</s></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: true,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('check all formats with tags ', () => {
        runTest(
            '<div><s><u><i><b><sup><sub>test</sub></sup></b></i></u></s></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: true,
                isUnderline: true,
                isStrikeThrough: true,
                isSubscript: true,
                isSuperscript: true,
            }
        );
    });

    it('check all formats with tags with collapsed cursor ', () => {
        runTest(
            '<div><s><u><i><b><sup><sub>test</sub></sup></b></i></u></s></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: true,
                isUnderline: true,
                isStrikeThrough: true,
                isSubscript: true,
                isSuperscript: true,
            }
        );
    });

    it('check all formats with css style ', () => {
        runTest(
            '<div><div style="text-decoration: underline line-through; font-weight: bold; vertical-align:super; font-style: italic" >test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: true,
                isUnderline: true,
                isStrikeThrough: true,
                isSubscript: false,
                isSuperscript: true,
            }
        );
    });

    it('check all formats with css style mixed with tags ', () => {
        runTest(
            '<div><div style="text-decoration: underline; font-weight: bold; vertical-align:sub"><s><i>test</i></s></div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: true,
                isUnderline: true,
                isStrikeThrough: true,
                isSubscript: true,
                isSuperscript: false,
            }
        );
    });

    it('check all formats with css style mixed with tags witj collapsed cursor ', () => {
        runTest(
            '<div><div style="text-decoration: underline; font-weight: bold; vertical-align:sub"><s><i>test</i></s></div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: true,
                isItalic: true,
                isUnderline: true,
                isStrikeThrough: true,
                isSubscript: true,
                isSuperscript: false,
            }
        );
    });

    it('check css style that overlay tags', () => {
        runTest(
            '<div ><b><div style="font-weight: normal;">test</div><b></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('check css style that overlay tags with collapsed cursor', () => {
        runTest(
            '<div ><b><div style="font-weight: normal;">test</div><b></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('check css style that overlay css styles', () => {
        runTest(
            '<div><div style="text-decoration: underline; font-weight:bold;"><div style="font-weight: normal;">test</div></div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: true,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('check css style that overlay css styles with collapsed cursor', () => {
        runTest(
            '<div><div style="text-decoration: underline; font-weight:bold;"><div style="font-weight: normal;">test</div></div></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            {
                isBold: false,
                isItalic: false,
                isUnderline: true,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });

    it('check focus out of format range', () => {
        runTest('<div>abcd<strong>sasa<strong></div><!--{"start":[0,0,1],"end":[0,0,3]}-->', {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('check focus in format range', () => {
        runTest(
            '<div>gdfgfdgdf<b>gdfgfdgdfgdf</b></div><!--{"start":[0,1,0,11],"end":[0,1,0,11]}-->',
            {
                isBold: true,
                isItalic: false,
                isUnderline: false,
                isStrikeThrough: false,
                isSubscript: false,
                isSuperscript: false,
            }
        );
    });
});
