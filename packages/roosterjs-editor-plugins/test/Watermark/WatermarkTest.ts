import { Watermark } from '../../lib/Watermark';
import * as TestHelper from '../TestHelper';
import { IEditor } from 'roosterjs-editor-types';

const watermarkText = 'this is a watermark';
const watermarkClass = 'watermarkClass';
const preEditorId = 'WatermarkEditor';

function blurEditor(editor: IEditor) {
    //create an element, focus it, then remove it
    const element = document.createElement('div');
    element.setAttribute('tabindex', '0');
    document.body.appendChild(element);
    element.focus();
    document.body.removeChild(element);
    const blurEvent = new FocusEvent('blur', {
        bubbles: true,
    });
    document.querySelector(`#${editor.getEditorDomAttribute('id')}`)?.dispatchEvent(blurEvent);
}

function focusEditor(editor: IEditor) {
    editor.focus();
    const focusEvent = new FocusEvent('focus', {
        bubbles: true,
    });
    document.querySelector(`#${editor.getEditorDomAttribute('id')}`)?.dispatchEvent(focusEvent);
}

function getWatermarkSpan(editor: IEditor) {
    const list = editor.queryElements(`.${watermarkClass}`);
    expect(list.length).toBeLessThanOrEqual(1);
    return <HTMLElement | null>list[0];
}

describe('Watermark plugin', () => {
    let plugin: Watermark;
    let editor: IEditor;
    let runNum = 1;
    let editorId: string;

    beforeEach(() => {
        plugin = new Watermark(watermarkText, undefined, watermarkClass);
        editorId = preEditorId + runNum;
        editor = TestHelper.initEditor(editorId, [plugin]);
        runNum++;
    });

    afterEach(() => {
        editor.dispose();
    });

    it('correctly initializes', () => {
        expect(plugin).toBeDefined();
        const watermark = editor.getDocument().querySelector(`.${watermarkClass}`);
        expect(watermark).toBeDefined();
        expect(editor.contains(watermark)).toBe(true);
        expect(watermark.textContent).toBe(watermarkText);
    });

    it('correctly removes watermark when focused', () => {
        const remover = spyOn(plugin, <keyof Watermark>'removeWatermark').and.callThrough();
        expect(getWatermarkSpan(editor)).toBeDefined();
        focusEditor(editor);
        expect(remover).toHaveBeenCalled();
        expect(getWatermarkSpan(editor)).toBeUndefined();
    });

    it('watermark returns after blur', () => {
        expect(getWatermarkSpan(editor)).toBeDefined();
        focusEditor(editor);
        expect(getWatermarkSpan(editor)).toBeUndefined();
        blurEditor(editor);
        expect(editor.hasFocus()).toBe(false);
        expect(getWatermarkSpan(editor)).toBeDefined();
    });
});
