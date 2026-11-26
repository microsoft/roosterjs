import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word emphasis marks', () => {
    const id = 'word-emphasis-marks';
    const sample = '\u7de8\u96c6\u5185\u5bb9';
    let editor: IEditor;
    beforeEach(() => {
        editor = initEditor(id);
    });
    afterEach(() => {
        editor.dispose();
        document.getElementById(id)?.remove();
    });
    const pasteRun = (style: string, content = sample, sheet = '', lang = 'ja-JP') => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"><style>${sheet}</style></head>
                <body><!--StartFragment--><p><span lang="${lang}" class="WordEmphasis" style="font-family:Yu Gothic;font-size:24pt;${style.replace(
                /"/g,
                '&quot;'
            )}">${content}</span></p>
                <!--EndFragment--></body></html>`,
        });
        return document.getElementById(id)!;
    };
    const run = (root: HTMLElement, text = sample) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
            if (node.textContent?.includes(text) && node.parentElement) {
                const style = getComputedStyle(node.parentElement);
                return {
                    style: style.textEmphasisStyle,
                    position: style.textEmphasisPosition,
                    color: style.textEmphasisColor,
                };
            }
        }
        throw new Error('Missing emphasis sample: ' + text);
    };
    it('preserves the native Japanese dot character above the text', () => {
        const result = run(pasteRun('font-emphasize:dot'));
        expect(result.style).toBe('"\uFF0E"');
        expect(result.position).toContain('over');
    });
    it('preserves below-dot placement', () => {
        const result = run(pasteRun('font-emphasize:below dot', sample, '', 'zh-CN'));
        expect(result.style).toBe('"\uFF0E"');
        expect(result.position).toContain('under');
    });
    it('preserves the native Korean circle character', () => {
        expect(run(pasteRun('font-emphasize:circle', sample, '', 'ko-KR')).style).toBe('"\u02DA"');
    });
    it('preserves the native Japanese accent character', () => {
        expect(run(pasteRun('font-emphasize:accent')).style).toBe('"\u3001"');
    });
    it('keeps the supplied Taiwanese dot character', () => {
        expect(run(pasteRun('font-emphasize:dot', sample, '', 'zh-TW')).style).toBe('"\u2027"');
    });
    it('resets native emphasis in nested content', () => {
        const root = pasteRun(
            'font-emphasize:dot',
            'Parent<span style="font-emphasize:none">Child</span>'
        );
        expect(run(root, 'Parent').style).toBe('"\uFF0E"');
        expect(run(root, 'Child').style).toBe('none');
    });
    it('recovers legacy emphasis from source stylesheets', () => {
        expect(run(pasteRun('', sample, '.WordEmphasis{font-emphasize:dot}')).style).toBe(
            '"\uFF0E"'
        );
    });
    it('keeps explicit standard style, position and color authoritative', () => {
        const result = run(
            pasteRun(
                'font-emphasize:below dot;text-emphasis-style:"*";text-emphasis-position:over right;text-emphasis-color:red'
            )
        );
        expect(result.style).toBe('"*"');
        expect(result.position).toContain('over');
        expect(result.color).toBe('rgb(255, 0, 0)');
    });
    it('preserves marks across inherited font and bold wrappers', () => {
        const root = pasteRun(
            'font-emphasize:dot',
            'Parent<b>Bold</b><span style="font:24pt Arial">Font</span>'
        );
        expect(run(root, 'Bold').style).toBe('"\uFF0E"');
        expect(run(root, 'Font').style).toBe('"\uFF0E"');
    });
    it('recovers native far-east glyph context from source stylesheets', () => {
        const result = run(
            pasteRun('', sample, '.WordEmphasis{font-emphasize:dot;mso-fareast-language:ko-KR}')
        );
        expect(result.style).toBe('"\u02D9"');
    });
    it('keeps the supplied dot shape without guessing an absent native language', () => {
        const result = run(pasteRun('font-emphasize:dot', sample, '', ''));
        expect(result.style).toContain('dot');
        expect(result.style).not.toContain('"');
    });
    it('does not guess unknown legacy emphasis', () => {
        expect(run(pasteRun('font-emphasize:unknown')).style).toBe('none');
    });
});
