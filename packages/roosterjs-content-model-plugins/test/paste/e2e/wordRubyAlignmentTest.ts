import { initEditor } from './testUtils';
import { createWordRubyAlignmentProcessor } from '../../../lib/paste/WordDesktop/processWordRubyAlignment';
import { paste } from 'roosterjs-content-model-core';
import {
    contentModelToDom,
    createDomToModelContext,
    createModelToDomContext,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word legacy ruby distribution', () => {
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor('word-ruby-distribution');
        root = document.getElementById('word-ruby-distribution')!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    function run(attributes: string, sheet = '', word = true) {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${
                word ? '<meta name="ProgId" content="Word.Document">' : ''
            }<style>${sheet}</style></head>
                <body><!--StartFragment--><p><ruby ${attributes}>Long base<rp>(</rp><rt>abc</rt><rp>)</rp></ruby></p><!--EndFragment--></body></html>`,
        });
        return root.querySelector('ruby')!;
    }
    it('distributes native annotation letters between the edges without introducing inner blocks', () => {
        const ruby = run('style="ruby-align:distribute-letter"');
        expect(getComputedStyle(ruby).getPropertyValue('ruby-align')).toBe('space-between');
        expect(ruby.querySelectorAll('div,p').length).toBe(0);
        expect(ruby.textContent).toBe('Long base(abc)');
    });
    it('recovers original stylesheet distribution and resets inherited centered annotations', () => {
        root.style.setProperty('ruby-align', 'center');
        const ruby = run('class="Native"', 'ruby.Native{RUBY-ALIGN:distribute-space}');
        expect(getComputedStyle(ruby).getPropertyValue('ruby-align')).toBe('space-around');
        expect(ruby.textContent).toBe('Long base(abc)');
    });
    it('retains converted distribution through ordinary DOM/model conversion', () => {
        run('class="Native"', 'ruby.Native{ruby-align:distribute-letter}');
        const model = domToContentModel(root, createDomToModelContext());
        const output = document.createElement('div');
        contentModelToDom(document, output, model, createModelToDomContext());
        expect(output.querySelector('ruby')!.style.getPropertyValue('ruby-align')).toBe(
            'space-between'
        );
        expect(output.textContent).toBe('Long base(abc)');
    });
    it('keeps explicit inherited standard CSS instead of the native stylesheet directive', () => {
        root.style.setProperty('ruby-align', 'center');
        const inherited = run(
            'class="Native" style="ruby-align:inherit"',
            '.Native{ruby-align:distribute-letter}'
        );
        expect(getComputedStyle(inherited).getPropertyValue('ruby-align')).toBe('center');
    });
    it('keeps explicit initial standard CSS instead of the native stylesheet directive', () => {
        root.style.setProperty('ruby-align', 'center');
        const initial = run(
            'class="Native" style="ruby-align:initial"',
            '.Native{ruby-align:distribute-letter}'
        );
        expect(getComputedStyle(initial).getPropertyValue('ruby-align')).toBe('space-around');
    });
    it('does not reinterpret right-edge native modes', () => {
        root.style.setProperty('ruby-align', 'center');
        const right = run('style="ruby-align:rightvertical"');
        expect(getComputedStyle(right).getPropertyValue('ruby-align')).toBe('center');
    });
    it('does not reinterpret non-Word legacy ruby', () => {
        root.style.setProperty('ruby-align', 'center');
        const nonWord = run('style="ruby-align:distribute-letter"', '', false);
        expect(getComputedStyle(nonWord).getPropertyValue('ruby-align')).toBe('center');
    });
    it('does not bypass configured CSS sanitizers when recovering discarded native rules', () => {
        const html = '<style>.Native{ruby-align:distribute-letter}</style>';
        const ruby = document.createElement('ruby');
        ruby.className = 'Native';
        createWordRubyAlignmentProcessor(html, { 'ruby-align': false })(ruby);
        expect(ruby.style.getPropertyValue('ruby-align')).toBe('');
        createWordRubyAlignmentProcessor(html, { 'ruby-align': () => 'center' })(ruby);
        expect(ruby.style.getPropertyValue('ruby-align')).toBe('center');
    });
});
