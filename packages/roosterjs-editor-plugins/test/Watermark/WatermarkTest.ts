import { Watermark } from '../../lib/Watermark';
import * as TestHelper from '../TestHelper';
import { IEditor } from 'roosterjs-editor-types';

const watermarkText = 'this is a watermark';
const watermarkClass = 'watermarkClass';
const editorId = 'WatermarkEditor';

function blurEverything() {
    const activeElement = document.activeElement;
    if (activeElement) {
        (activeElement as HTMLElement).blur();
    }
}

function getWatermarkSpan(editor: IEditor) {
    return editor.getDocument().querySelector(`.${watermarkClass}`);
}

describe('Watermark plugin', () => {
    let plugin: Watermark;
    let editor: IEditor;

    beforeEach(() => {
        plugin = new Watermark(watermarkText, undefined, watermarkClass);
        editor = TestHelper.initEditor(editorId, [plugin]);
    });

    afterEach(() => {
        editor.dispose();
        plugin.dispose();
        document.querySelector(`#${editorId}`)?.remove();
    });

    it('correctly initializes', () => {
        expect(plugin).toBeDefined();
        const watermark = editor.getDocument().querySelector(`.${watermarkClass}`);
        expect(watermark).toBeDefined();
        expect(editor.contains(watermark)).toBe(true);
        expect(watermark.textContent).toBe(watermarkText);
    });

    it('correctly removes watermark when focused', () => {
        expect(getWatermarkSpan(editor)).toBeDefined();
        editor.focus();
        expect(getWatermarkSpan(editor)).toBeNull();
    });

    it('watermark returns after blur', () => {
        expect(getWatermarkSpan(editor)).toBeDefined();
        editor.focus();
        expect(getWatermarkSpan(editor)).toBeNull();
        blurEverything();
        expect(getWatermarkSpan(editor)).toBeDefined();
    });
});
