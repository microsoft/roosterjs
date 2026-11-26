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

describe('Word paragraph font alignment', () => {
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor('word-font-alignment');
        root = document.getElementById('word-font-alignment')!;
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
    for (const alignment of ['top', 'middle', 'baseline', 'bottom']) {
        it('preserves native paragraph font alignment: ' + alignment, () => {
            run(
                `<p style="vertical-align:${alignment}"><span style="font-size:36pt">Large</span><span style="font-size:18pt">small</span></p><p>Control</p>`
            );
            const paragraph = root.querySelector('p')!;
            expect(paragraph.style.getPropertyValue('--rooster-paragraph-font-align')).toBe(
                alignment
            );
            expect(
                Array.from(paragraph.children).map(node => getComputedStyle(node).verticalAlign)
            ).toEqual([alignment, alignment]);
            expect(
                root
                    .querySelectorAll('p')[1]
                    .style.getPropertyValue('--rooster-paragraph-font-align')
            ).toBe('');
        });
    }
    it('retains alignment through DOM/model conversion and wraps unformatted text', () => {
        run('<p style="vertical-align:top">Plain <b>bold</b></p>');
        const model = domToContentModel(root, createDomToModelContext());
        const output = document.createElement('div');
        contentModelToDom(document, output, model, createModelToDomContext());
        expect(
            output.querySelector('p')!.style.getPropertyValue('--rooster-paragraph-font-align')
        ).toBe('top');
        expect(
            Array.from(output.querySelector('p')!.children).every(
                node =>
                    (node as HTMLElement).style.verticalAlign ==
                    'var(--rooster-paragraph-font-align)'
            )
        ).toBe(true);
        expect(output.textContent).toBe('Plain bold');
    });
    it('does not override superscript or inline image alignment', () => {
        run(
            '<p style="vertical-align:top"><sup>Raised</sup><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" style="vertical-align:bottom"></p>'
        );
        expect(root.querySelector('sup')).not.toBeNull();
        expect(root.querySelector('img')!.style.verticalAlign).toBe('bottom');
    });
    it('does not inherit paragraph alignment into ruby content or create inner block wrappers', () => {
        run('<p style="vertical-align:top"><ruby>Base<rt>annotation</rt></ruby></p>');
        expect(
            root.querySelector('p')!.style.getPropertyValue('--rooster-paragraph-font-align')
        ).toBe('top');
        expect(root.querySelector('ruby')!.querySelectorAll('div,p').length).toBe(0);
    });
    it('does not reinterpret non-Word CSS or an automatic native alignment', () => {
        run('<p style="vertical-align:top">Ordinary HTML</p>', false);
        expect(
            root.querySelector('p')!.style.getPropertyValue('--rooster-paragraph-font-align')
        ).toBe('');
        root.innerHTML = '';
        run('<p style="mso-vertical-align-alt:auto">Native automatic alignment</p>');
        expect(
            root.querySelector('p')!.style.getPropertyValue('--rooster-paragraph-font-align')
        ).toBe('');
    });
    for (const blocked of [true, false]) {
        it(
            'honors a configured alignment sanitizer: ' + (blocked ? 'blocked' : 'transformed'),
            () => {
                editor.dispose();
                editor = new Editor(root as HTMLDivElement, {
                    plugins: [
                        new PastePlugin(undefined, {
                            additionalAllowedTags: [],
                            additionalDisallowedTags: [],
                            attributeSanitizers: {},
                            styleSanitizers: { 'vertical-align': blocked ? false : () => 'middle' },
                        }),
                    ],
                });
                run('<p style="vertical-align:top">Sanitized</p>');
                expect(
                    root
                        .querySelector('p')!
                        .style.getPropertyValue('--rooster-paragraph-font-align')
                ).toBe(blocked ? '' : 'middle');
            }
        );
    }
});
