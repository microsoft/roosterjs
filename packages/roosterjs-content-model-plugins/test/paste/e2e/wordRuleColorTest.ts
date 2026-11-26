import { initEditor } from './testUtils';
import { Editor, paste } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';
import {
    contentModelToDom,
    createDomToModelContext,
    createModelToDomContext,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word horizontal rule foreground color', () => {
    let editor: IEditor;
    let root: HTMLElement;

    beforeEach(() => {
        editor = initEditor('word-rule-color');
        root = document.getElementById('word-rule-color')!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    function run(content: string, word = true) {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${
                word ? '<meta name="ProgId" content="Word.Document">' : ''
            }</head><body><!--StartFragment-->${content}<!--EndFragment--></body></html>`,
        });
    }

    it('retains the native CSS color independently of rule geometry', () => {
        run('<hr noshade style="color:#c00000;width:200pt;height:3pt">');
        const hr = root.querySelector('hr')!;
        expect(hr.style.color).toBe('rgb(192, 0, 0)');
        expect(hr.style.backgroundColor).toBe('rgb(192, 0, 0)');
        expect(hr.style.width).toBe('200pt');
        expect(hr.style.height).toBe('3pt');
    });
    it('retains rule foreground color through DOM/model conversion', () => {
        run('<hr noshade style="color:#c00000">');
        const model = domToContentModel(root, createDomToModelContext());
        const output = document.createElement('div');
        contentModelToDom(document, output, model, createModelToDomContext());
        expect(output.querySelector('hr')!.style.color).toBe('rgb(192, 0, 0)');
        expect(output.querySelector('hr')!.style.backgroundColor).toBe('rgb(192, 0, 0)');
    });
    it('does not replace an explicitly supplied border color with foreground color', () => {
        run('<hr style="color:#c00000;border-top:4px solid #16803c;width:200pt">');
        const hr = root.querySelector('hr')!;
        expect(hr.style.color).toBe('rgb(192, 0, 0)');
        expect(hr.style.borderTopColor).toBe('rgb(22, 128, 60)');
        expect(hr.style.borderTopWidth).toBe('4px');
        expect(hr.style.borderTopStyle).toBe('solid');
    });
    it('retains standard rule color for non-Word HTML too', () => {
        run('<hr style="color:#c00000">', false);
        expect(root.querySelector('hr')!.style.color).toBe('rgb(192, 0, 0)');
    });
    it('does not add an explicit color to an uncolored rule', () => {
        run('<hr style="width:200pt">');
        expect(root.querySelector('hr')!.style.color).toBe('');
    });
    it('honors a configured color sanitizer', () => {
        editor.dispose();
        editor = new Editor(root as HTMLDivElement, {
            plugins: [
                new PastePlugin(undefined, {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: {},
                    styleSanitizers: { color: false },
                }),
            ],
        });
        run('<hr noshade style="color:#c00000;width:200pt">');
        const hr = root.querySelector('hr')!;
        expect(hr.style.color).toBe('');
        expect(hr.style.backgroundColor).toBe('');
        expect(hr.style.width).toBe('200pt');
    });
    it('honors a color sanitizer transformation without changing the border control', () => {
        editor.dispose();
        editor = new Editor(root as HTMLDivElement, {
            plugins: [
                new PastePlugin(undefined, {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: {},
                    styleSanitizers: { color: () => '#0000ff' },
                }),
            ],
        });
        run('<hr noshade style="color:#c00000;border-top:4px solid #16803c">');
        const hr = root.querySelector('hr')!;
        expect(hr.style.color).toBe('rgb(0, 0, 255)');
        expect(hr.style.backgroundColor).toBe('rgb(0, 0, 255)');
        expect(hr.style.borderTopColor).toBe('rgb(22, 128, 60)');
    });
    it('retains an explicitly supplied background instead of inferred native fill', () => {
        run('<hr noshade style="color:#c00000;background-color:#16803c">');
        expect(root.querySelector('hr')!.style.backgroundColor).toBe('rgb(22, 128, 60)');
    });
    it('does not infer native fill for unmarked non-Word HTML', () => {
        run('<hr noshade style="color:#c00000">', false);
        expect(root.querySelector('hr')!.style.backgroundColor).toBe('');
    });
    it('does not override an explicit inherited-background reset with native fill', () => {
        run('<hr noshade style="color:#c00000;background-color:inherit">');
        expect(root.querySelector('hr')!.style.backgroundColor).not.toBe('rgb(192, 0, 0)');
    });
    it('does not fabricate a color for an uncolored native rule', () => {
        run('<hr noshade style="width:200pt">');
        const hr = root.querySelector('hr')!;
        expect(hr.style.color).toBe('');
        expect(hr.style.backgroundColor).toBe('');
    });
    it('honors a disabled background-color for inferred native fill', () => {
        editor.dispose();
        editor = new Editor(root as HTMLDivElement, {
            plugins: [
                new PastePlugin(undefined, {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: {},
                    styleSanitizers: { 'background-color': false },
                }),
            ],
        });
        run('<hr noshade style="color:#c00000">');
        const hr = root.querySelector('hr')!;
        expect(hr.style.color).toBe('rgb(192, 0, 0)');
        expect(hr.style.backgroundColor).toBe('');
    });
    it('does not infer fill from a disabled noshade attribute', () => {
        editor.dispose();
        editor = new Editor(root as HTMLDivElement, {
            plugins: [
                new PastePlugin(undefined, {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: { noshade: false },
                    styleSanitizers: {},
                }),
            ],
        });
        run('<hr noshade style="color:#c00000">');
        expect(root.querySelector('hr')!.style.backgroundColor).toBe('');
    });
});
