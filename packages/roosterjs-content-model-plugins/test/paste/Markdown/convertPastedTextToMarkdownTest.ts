import { IEditor } from 'roosterjs-content-model-types';
import {
    convertPastedTextToMarkdown,
    shouldConvertPastedTextToMarkdown,
} from '../../../lib/paste/Markdown/convertPastedTextToMarkdown';

function createFragment(html: string): DocumentFragment {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content;
}

describe('shouldConvertPastedTextToMarkdown', () => {
    it('returns false when there is no plain text', () => {
        const result = shouldConvertPastedTextToMarkdown(
            <any>{ text: '', rawHtml: null },
            createFragment('')
        );

        expect(result).toBeFalse();
    });

    it('returns false when the plain text is only whitespace', () => {
        const result = shouldConvertPastedTextToMarkdown(
            <any>{ text: '   \n  ', rawHtml: null },
            createFragment('')
        );

        expect(result).toBeFalse();
    });

    it('returns true when there is plain text and no HTML (rawHtml is null)', () => {
        const result = shouldConvertPastedTextToMarkdown(
            <any>{ text: '# Heading', rawHtml: null },
            createFragment('')
        );

        expect(result).toBeTrue();
    });

    it('returns true when there is plain text and rawHtml is undefined', () => {
        const result = shouldConvertPastedTextToMarkdown(
            <any>{ text: '# Heading', rawHtml: undefined },
            createFragment('')
        );

        expect(result).toBeTrue();
    });

    it('returns true when the HTML is a thin wrapper of the plain text', () => {
        const text = '# Heading\n- item 1\n- item 2';
        const result = shouldConvertPastedTextToMarkdown(
            <any>{ text, rawHtml: '<div># Heading</div><div>- item 1</div><div>- item 2</div>' },
            createFragment('<div># Heading</div><div>- item 1</div><div>- item 2</div>')
        );

        expect(result).toBeTrue();
    });

    it('returns true when the HTML uses P and BR as thin wrappers', () => {
        const text = 'line 1\nline 2';
        const result = shouldConvertPastedTextToMarkdown(
            <any>{ text, rawHtml: '<p>line 1<br>line 2</p>' },
            createFragment('<p>line 1<br>line 2</p>')
        );

        expect(result).toBeTrue();
    });

    it('returns false when the HTML contains a formatting element', () => {
        const text = 'hello world';
        const result = shouldConvertPastedTextToMarkdown(
            <any>{ text, rawHtml: '<div>hello <b>world</b></div>' },
            createFragment('<div>hello <b>world</b></div>')
        );

        expect(result).toBeFalse();
    });

    it('returns false when a thin wrapper element carries attributes', () => {
        const text = 'hello world';
        const result = shouldConvertPastedTextToMarkdown(
            <any>{ text, rawHtml: '<div style="font-weight:bold">hello world</div>' },
            createFragment('<div style="font-weight:bold">hello world</div>')
        );

        expect(result).toBeFalse();
    });

    it('returns false when the HTML text does not match the plain text', () => {
        const result = shouldConvertPastedTextToMarkdown(
            <any>{ text: 'hello world', rawHtml: '<div>different content</div>' },
            createFragment('<div>different content</div>')
        );

        expect(result).toBeFalse();
    });

    it('returns false when the HTML contains a link', () => {
        const text = 'see roosterjs';
        const result = shouldConvertPastedTextToMarkdown(
            <any>{ text, rawHtml: '<div>see <a href="https://x">roosterjs</a></div>' },
            createFragment('<div>see <a href="https://x">roosterjs</a></div>')
        );

        expect(result).toBeFalse();
    });
});

describe('convertPastedTextToMarkdown', () => {
    let editor: IEditor;

    beforeEach(() => {
        editor = (<any>{
            getDocument: () => document,
        }) as IEditor;
    });

    it('converts a markdown heading into an HTML heading', () => {
        const fragment = createFragment('<div># Heading</div>');

        convertPastedTextToMarkdown(editor, fragment, '# Heading');

        const div = document.createElement('div');
        div.appendChild(fragment.cloneNode(true));

        expect(div.querySelector('h1')).not.toBeNull();
        expect(div.textContent).toBe('Heading');
    });

    it('converts a markdown unordered list into list items', () => {
        const fragment = createFragment('');

        convertPastedTextToMarkdown(editor, fragment, '- item 1\n- item 2');

        const div = document.createElement('div');
        div.appendChild(fragment.cloneNode(true));

        const listItems = div.querySelectorAll('li');
        expect(listItems.length).toBe(2);
        expect(listItems[0].textContent).toBe('item 1');
        expect(listItems[1].textContent).toBe('item 2');
    });

    it('clears the existing content of the fragment before conversion', () => {
        const fragment = createFragment('<div>old content</div>');

        convertPastedTextToMarkdown(editor, fragment, 'new content');

        const div = document.createElement('div');
        div.appendChild(fragment.cloneNode(true));

        expect(div.textContent).toBe('new content');
        expect(div.textContent).not.toContain('old');
    });
});
