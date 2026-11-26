import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import { setHeadingLevel } from 'roosterjs-content-model-api';
import {
    contentModelToDom,
    createDomToModelContext,
    createModelToDomContext,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word paragraph outline heading levels', () => {
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor('word-outline-level');
        root = document.getElementById('word-outline-level')!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    function run(content: string, sheet = '') {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"><style>${sheet}</style></head>
                <body><!--StartFragment-->${content}<!--EndFragment--></body></html>`,
        });
        return root.querySelector('p')!;
    }
    it('recovers a custom paragraph outline heading without imposing default heading fonts', () => {
        const paragraph = run(
            '<p style="mso-outline-level:2;font-size:18pt;font-weight:normal">Custom heading</p><p>Body</p>'
        );
        expect(paragraph.tagName).toBe('P');
        expect(paragraph.getAttribute('role')).toBe('heading');
        expect(paragraph.getAttribute('aria-level')).toBe('2');
        expect(getComputedStyle(paragraph).fontWeight).toBe('400');
        expect(getComputedStyle(paragraph.querySelector('span') || paragraph).fontSize).toBe(
            '24px'
        );
        expect(root.querySelectorAll('[role=heading]').length).toBe(1);
    });
    it('recovers Heading7 through Heading9 from original class rules without generating invalid H7 tags', () => {
        run(
            '<p class="MsoHeading7">Seven</p><p class="MsoHeading8">Eight</p><p class="MsoHeading9">Nine</p>',
            'p.MsoHeading7{mso-outline-level:7}p.MsoHeading8{mso-outline-level:8}p.MsoHeading9{mso-outline-level:9}'
        );
        const paragraphs = root.querySelectorAll('p');
        expect(Array.from(paragraphs).map(p => p.getAttribute('aria-level'))).toEqual([
            '7',
            '8',
            '9',
        ]);
        expect(root.querySelectorAll('h7,h8,h9').length).toBe(0);
    });
    it('retains an imported outline level through ordinary DOM/model conversion', () => {
        run('<p style="mso-outline-level:3">Heading</p><p>Body</p>');
        const model = domToContentModel(root, createDomToModelContext());
        const output = document.createElement('div');
        contentModelToDom(document, output, model, createModelToDomContext());
        expect(output.querySelector('p')!.getAttribute('aria-level')).toBe('3');
        expect(output.querySelectorAll('[role=heading]').length).toBe(1);
    });
    it('does not inherit paragraph outline semantics into inline general content or create extra blocks', () => {
        const paragraph = run(
            '<p style="mso-outline-level:7"><ruby>Base<rt>annotation</rt></ruby></p>'
        );
        expect(paragraph.getAttribute('aria-level')).toBe('7');
        expect(root.querySelector('ruby')!.querySelectorAll('div,p,[role=heading]').length).toBe(0);
    });
    for (const level of [0, 1] as const) {
        it(
            'removes stale outline semantics during an actual heading command to level ' + level,
            () => {
                const paragraph = run('<p style="mso-outline-level:7">Heading</p>');
                const range = document.createRange();
                range.selectNodeContents(paragraph);
                editor.setDOMSelection({ type: 'range', range, isReverted: false });
                setHeadingLevel(editor, level);
                expect(root.querySelector('[aria-level]')).toBeNull();
                expect(root.querySelector(level == 0 ? 'p' : 'h1')).not.toBeNull();
            }
        );
    }
    it('keeps explicit HTML heading semantics instead of the native descriptor', () => {
        const paragraph = run(
            '<p role="heading" aria-level="4" style="mso-outline-level:2">Author heading</p><h2 style="mso-outline-level:7">HTML heading</h2>'
        );
        expect(paragraph.getAttribute('aria-level')).toBe('4');
        expect(root.querySelector('h2')!.hasAttribute('aria-level')).toBe(false);
    });
    it('does not promote body-text, invalid levels, explicit nonheading roles or native numbered lists', () => {
        run(
            '<p class="Outline" style="mso-outline-level:body-text">Body</p><p style="mso-outline-level:0">Zero</p><p style="mso-outline-level:10">Ten</p><p role="presentation" style="mso-outline-level:2">Presentation</p><p style="mso-outline-level:2;mso-list:l0 level1 lfo1">List</p>',
            '.Outline{mso-outline-level:2}'
        );
        expect(root.querySelectorAll('[role=heading]').length).toBe(0);
    });
});
