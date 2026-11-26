import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import {
    contentModelToDom,
    createDomToModelContext,
    createModelToDomContext,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word diagonal cell borders', () => {
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor('word-diagonals');
        root = document.getElementById('word-diagonals')!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    function run(style: string, sheet = '') {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"><style>${sheet}</style></head>
                <body><!--StartFragment--><table><tr><td class="Diagonal" style="width:160px;height:80px;border:1px solid black;background:#ffeecc;${style}"><p>Cell</p></td></tr></table><!--EndFragment--></body></html>`,
        });
        return root.querySelector('td')!;
    }
    function svg(td: HTMLElement) {
        return decodeURIComponent(td.style.backgroundImage);
    }
    it('retains the supplied down border, physical width and cell shading', () => {
        const td = run('mso-diagonal-down:1.5pt solid #0066CC');
        expect(svg(td)).toContain('y1="0" x2="100" y2="100"');
        expect(svg(td)).toContain('stroke="rgb(0, 102, 204)" stroke-width="1.5pt"');
        expect(svg(td)).toContain('non-scaling-stroke');
        expect(getComputedStyle(td).backgroundColor).toBe('rgb(255, 238, 204)');
        expect(td.textContent).toBe('Cell');
    });
    it('preserves both diagonals without replacing one with the other', () => {
        const td = run('mso-diagonal-down:1pt solid #0066CC;mso-diagonal-up:2pt solid #CC3300');
        expect(svg(td)).toContain('y1="0" x2="100" y2="100"');
        expect(svg(td)).toContain('y1="100" x2="100" y2="0"');
    });
    it('recovers original stylesheet descriptors and inline no-border overrides', () => {
        const td = run(
            'mso-diagonal-down:none',
            '.Diagonal{mso-diagonal-down:1pt solid #0066CC;mso-diagonal-up:2pt solid #CC3300}'
        );
        expect(svg(td)).not.toContain('y1="0"');
        expect(svg(td)).toContain('y1="100"');
    });
    it('round-trips through ordinary DOM conversion after resizing the cell', () => {
        const td = run('mso-diagonal-down:1.5pt solid #0066CC');
        td.style.width = '320px';
        const model = domToContentModel(root, createDomToModelContext());
        const output = document.createElement('div');
        contentModelToDom(document, output, model, createModelToDomContext());
        const result = output.querySelector('td')!;
        expect(result.style.width).toBe('320px');
        expect(svg(result)).toContain('stroke-width="1.5pt"');
        expect(result.style.backgroundSize).toBe('100% 100%');
        expect(getComputedStyle(td).backgroundColor).toBe('rgb(255, 238, 204)');
    });
    it('does not approximate compound lines or unresolved colors', () => {
        const td = run(
            'mso-diagonal-down:1.5pt double #0066CC;mso-diagonal-up:1pt solid windowtext'
        );
        expect(td.style.backgroundImage).toBe('');
    });
});
