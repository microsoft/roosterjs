import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word underline color', () => {
    const id = 'word-underline-color';
    let editor: IEditor;

    beforeEach(() => {
        editor = initEditor(id);
    });

    afterEach(() => {
        editor.dispose();
        document.getElementById(id)?.remove();
    });

    it('preserves a scalar underline color without changing text color', () => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"></head>
                <body><!--StartFragment--><p><u style="color:#000000;text-underline:#FF0000">Red line</u></p><!--EndFragment--></body></html>`,
        });

        const underline = document.getElementById(id)!.querySelector('u')!;

        expect(underline.textContent).toBe('Red line');
        expect(getComputedStyle(underline).color).toBe('rgb(0, 0, 0)');
        expect(getComputedStyle(underline).textDecorationColor).toBe('rgb(255, 0, 0)');
    });

    it('keeps visible CSS authoritative over scalar metadata', () => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"></head>
                <body><!--StartFragment--><p><u style="text-decoration-color:#0000FF;text-underline:#FF0000">CSS wins</u></p><!--EndFragment--></body></html>`,
        });

        const underline = document.getElementById(id)!.querySelector('u')!;

        expect(getComputedStyle(underline).textDecorationColor).toBe('rgb(0, 0, 255)');
    });

    it('does not enable underline for color metadata or explicit off', () => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"></head>
                <body><!--StartFragment--><p><span style="text-underline:#FF0000">Plain</span>
                <u style="text-decoration:none;text-underline:#FF0000">Off</u></p><!--EndFragment--></body></html>`,
        });

        expect(document.getElementById(id)!.querySelector('u')).toBeNull();
        expect(document.getElementById(id)!.textContent).toContain('Plain');
        expect(document.getElementById(id)!.textContent).toContain('Off');
    });

    it('keeps the source line color across text colors and resets a new underline', () => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"></head>
                <body><!--StartFragment--><p><u style="color:#000000;text-decoration-color:#FF0000">Red
                <span style="color:#0000FF;text-decoration-color:#00FF00">Blue text</span>
                <u style="color:#008000">New green line</u></u><a href="https://example.com">Link</a></p><!--EndFragment--></body></html>`,
        });

        const root = document.getElementById(id)!;
        const blueText = Array.from(root.querySelectorAll('span')).find(
            element => element.textContent == 'Blue text'
        )!;
        const greenLine = Array.from(root.querySelectorAll('u')).find(
            element => element.textContent == 'New green line'
        )!;

        expect(getComputedStyle(blueText).color).toBe('rgb(0, 0, 255)');
        expect(getComputedStyle(blueText.querySelector('u')!).textDecorationColor).toBe(
            'rgb(255, 0, 0)'
        );
        expect(getComputedStyle(greenLine).textDecorationColor).toBe('rgb(0, 128, 0)');
        expect(root.querySelector('a')!.style.textDecorationColor).toBe('');
    });
});
