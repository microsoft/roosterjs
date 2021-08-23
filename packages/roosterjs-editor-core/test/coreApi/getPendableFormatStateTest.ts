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
        div.innerHTML =
            '<div style="font-family: arial; font-size: 12pt; color: black; background-color: white"><u>test</u></div>';
        core.api.focus(core);
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
        div.innerHTML = '<div style="text-decoration: underline"><div style="">test</div></div>';
        core.api.focus(core);
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
        div.innerHTML = '<div><b>test</b></div>';
        core.api.focus(core);
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
        div.innerHTML = '<div><strong>test</strong></div>';
        core.api.focus(core);
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
        div.innerHTML =
            '<div><div style="font-weight: bold">test</div style="font-weight: bold"></div>';
        core.api.focus(core);
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
        div.innerHTML =
            '<div><div style="font-weight: bolder">test</div style="font-weight: bolder"></div>';
        core.api.focus(core);
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
        div.innerHTML =
            '<div><div style="font-weight: bolder">test</div style="font-weight: 700"></div>';
        core.api.focus(core);
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
        div.innerHTML = '<div><i>test</i></div>';
        core.api.focus(core);
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
        div.innerHTML = '<div><em>test</em></div>';
        core.api.focus(core);
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
        div.innerHTML = '<div><div style="font-style:italic">test</div></div>';
        core.api.focus(core);
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
        div.innerHTML = '<div><div style="vertical-align:sub">test</div></div>';
        core.api.focus(core);
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
        div.innerHTML = '<div><sub>test</sub></div>';
        core.api.focus(core);
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
        div.innerHTML = '<div><sup>test</sup></div>';
        core.api.focus(core);
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
        div.innerHTML = '<div><div style="vertical-align: super">test</div></div>';
        core.api.focus(core);
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
        div.innerHTML = '<div><div style="text-decoration: line-through">test</div></div>';
        core.api.focus(core);
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
        div.innerHTML = '<div><strike>test</strike></div>';
        core.api.focus(core);
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
        div.innerHTML = '<div><s>test</s></div>';
        core.api.focus(core);
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
        div.innerHTML = '<div><s><u><i><b><sup><sub>test</sub></sup></b></i></u></s></div>';
        core.api.focus(core);
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
        div.innerHTML =
            '<div><div style="text-decoration: underline line-through; font-weight: bold; vertical-align:super; font-style: italic" >test</div></div>';
        core.api.focus(core);
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
        div.innerHTML =
            '<div><div style="text-decoration: underline; font-weight: bold; vertical-align:sub"><s><i>test</i></s></div></div>';
        core.api.focus(core);
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
        div.innerHTML = '<div ><b><div style="font-weight: normal;">test</div><b></div>';
        core.api.focus(core);
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
        div.innerHTML =
            '<div><div style="text-decoration: underline; font-weight:bold;"><div style="font-weight: normal;">test</div></div></div>';
        core.api.focus(core);
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
});
