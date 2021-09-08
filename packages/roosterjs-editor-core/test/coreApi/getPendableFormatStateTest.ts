import createEditorCore from './createMockEditorCore';
import { getPendableFormatState } from '../../lib/coreApi/getPendableFormatState';

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

    it('underline with u tag', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div style="font-family: arial; font-size: 12pt; color: black; background-color: white"><u>test</u></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);
        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: true,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('underline with u tag collapsed cursor', () => {
        const core = createEditorCore(div, {});
        core.api.setContent(
            core,
            '<div style="font-family: arial; font-size: 12pt; color: black; background-color: white"><u>test</u></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);
        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: true,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('underline with css style u tag', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div style="text-decoration: underline"><div style="">test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);
        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: true,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('bold with b tag', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><b>test</b></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('bold with strong tag', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><strong>test</strong></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);
        expect(format).toEqual({
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('bold with strong tag collapsed cursor', () => {
        const core = createEditorCore(div, {});
        core.api.setContent(
            core,
            '<div><strong>test</strong></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('bold with style  css style font-weight: bold', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><div style="font-weight: bold">test</div style="font-weight: bold"></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('bold with css style font-weight: bolder', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><div style="font-weight: bolder">test</div style="font-weight: bolder"></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('bold with  css style font-weight: 700', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><div style="font-weight: bolder">test</div style="font-weight: 700"></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('italic with tag I ', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><i>test</i></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);
        expect(format).toEqual({
            isBold: false,
            isItalic: true,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('italic with tag I collapsed cursor', () => {
        const core = createEditorCore(div, {});
        core.api.setContent(
            core,
            '<div><i>test</i></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: false,
            isItalic: true,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('italic with tag EM ', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><em>test</em></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: false,
            isItalic: true,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('italic with css style font-style:italic ', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><div style="font-style:italic">test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: false,
            isItalic: true,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('Subscript with css style vertical-align: sub ', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><div style="vertical-align:sub">test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: true,
            isSuperscript: false,
        });
    });

    it('Subscript with tag SUB ', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><sub>test</sub></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);
        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: true,
            isSuperscript: false,
        });
    });

    it('Subscript with tag SUB collapsed cursor ', () => {
        const core = createEditorCore(div, {});
        core.api.setContent(
            core,
            '<div><sub>test</sub></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: true,
            isSuperscript: false,
        });
    });

    it('Superscript with tag SUP ', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><sup>test</sup></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );

        const format = getPendableFormatState(core);
        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: true,
        });
    });

    it('Superscript with tag SUP collapsed cursor ', () => {
        const core = createEditorCore(div, {});
        core.api.setContent(
            core,
            '<div><sup>test</sup></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            true
        );

        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: true,
        });
    });

    it('Superscript with css style vertical-align: super', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><div style="vertical-align: super">test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: true,
        });
    });

    it('StrikeThrough with css style text-decoration: line-through', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><div style="text-decoration: line-through">test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );

        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: true,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('StrikeThrough with tag STRIKE ', () => {
        const core = createEditorCore(div, {});
        core.api.setContent(
            core,
            '<div><strike>test</strike></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );

        const format = getPendableFormatState(core);
        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: true,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('StrikeThrough with tag STRIKE with collapsed cursor', () => {
        const core = createEditorCore(div, {});
        core.api.setContent(
            core,
            '<div><strike>test</strike></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            true
        );

        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: true,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('StrikeThrough with tag S ', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><s>test</s></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: true,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('check all formats with tags ', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><s><u><i><b><sup><sub>test</sub></sup></b></i></u></s></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);
        expect(format).toEqual({
            isBold: true,
            isItalic: true,
            isUnderline: true,
            isStrikeThrough: true,
            isSubscript: true,
            isSuperscript: true,
        });
    });

    it('check all formats with tags with collapsed cursor ', () => {
        const core = createEditorCore(div, {});
        core.api.setContent(
            core,
            '<div><s><u><i><b><sup><sub>test</sub></sup></b></i></u></s></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: true,
            isItalic: true,
            isUnderline: true,
            isStrikeThrough: true,
            isSubscript: true,
            isSuperscript: true,
        });
    });

    it('check all formats with css style ', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><div style="text-decoration: underline line-through; font-weight: bold; vertical-align:super; font-style: italic" >test</div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );

        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: true,
            isItalic: true,
            isUnderline: true,
            isStrikeThrough: true,
            isSubscript: false,
            isSuperscript: true,
        });
    });

    it('check all formats with css style mixed with tags ', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><div style="text-decoration: underline; font-weight: bold; vertical-align:sub"><s><i>test</i></s></div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);
        expect(format).toEqual({
            isBold: true,
            isItalic: true,
            isUnderline: true,
            isStrikeThrough: true,
            isSubscript: true,
            isSuperscript: false,
        });
    });

    it('check all formats with css style mixed with tags witj collapsed cursor ', () => {
        const core = createEditorCore(div, {});
        core.api.setContent(
            core,
            '<div><div style="text-decoration: underline; font-weight: bold; vertical-align:sub"><s><i>test</i></s></div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: true,
            isItalic: true,
            isUnderline: true,
            isStrikeThrough: true,
            isSubscript: true,
            isSuperscript: false,
        });
    });

    it('check css style that overlay tags', () => {
        const core = createEditorCore(div, {});
        core.api.setContent(
            core,
            '<div ><b><div style="font-weight: normal;">test</div><b></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);
        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('check css style that overlay tags with collapsed cursor', () => {
        const core = createEditorCore(div, {});
        core.api.setContent(
            core,
            '<div ><b><div style="font-weight: normal;">test</div><b></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('check css style that overlay css styles', () => {
        const core = createEditorCore(div, {});

        core.api.setContent(
            core,
            '<div><div style="text-decoration: underline; font-weight:bold;"><div style="font-weight: normal;">test</div></div></div><!--{"start":[0,0,0,0],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);

        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: true,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('check css style that overlay css styles with collapsed cursor', () => {
        const core = createEditorCore(div, {});
        core.api.setContent(
            core,
            '<div><div style="text-decoration: underline; font-weight:bold;"><div style="font-weight: normal;">test</div></div></div><!--{"start":[0,0,0,4],"end":[0,0,0,4]}-->',
            true
        );
        const format = getPendableFormatState(core);
        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: true,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('check focus out of format range', () => {
        const core = createEditorCore(div, {});
        core.api.setContent(
            core,
            '<div>abcd<strong>sasa<strong></div><!--{"start":[0,0,1],"end":[0,0,3]}-->',
            true
        );
        const format = getPendableFormatState(core);
        expect(format).toEqual({
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });

    it('check focus in format range', () => {
        const core = createEditorCore(div, {});
        core.api.setContent(
            core,
            '<div>gdfgfdgdf<b>gdfgfdgdfgdf</b></div><!--{"start":[0,1,0,11],"end":[0,1,0,11]}-->',
            true
        );
        const format = getPendableFormatState(core);
        expect(format).toEqual({
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isStrikeThrough: false,
            isSubscript: false,
            isSuperscript: false,
        });
    });
});
