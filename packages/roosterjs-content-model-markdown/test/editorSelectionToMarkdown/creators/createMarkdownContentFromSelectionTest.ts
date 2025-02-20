import { createMarkdownContentFromSelection } from '../../../lib/editorSelectionToMarkdown/creators/createMarkdownContentFromSelection';
import { RangeSelection } from 'roosterjs-content-model-types';

describe('createMarkdownContentFromSelection', () => {
    it('1 - Single paragraph', () => {
        const parent = document.createElement('div');
        const paragraph = document.createElement('p');
        paragraph.textContent = 'Hello, world!';
        parent.appendChild(paragraph);
        const range = document.createRange();
        range.selectNode(paragraph);
        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };
        expect(createMarkdownContentFromSelection(selection)).toBe('Hello, world!\n\n');
    });

    it('2 - Multiple paragraphs', () => {
        const div = document.createElement('div');
        const paragraph1 = document.createElement('p');
        paragraph1.textContent = 'Hello, world!';
        const paragraph2 = document.createElement('p');
        paragraph2.textContent = 'This is a test.';
        div.appendChild(paragraph1);
        div.appendChild(paragraph2);

        const range = document.createRange();
        range.setStartBefore(paragraph1);
        range.setEndAfter(paragraph2);
        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };
        expect(createMarkdownContentFromSelection(selection)).toBe(
            'Hello, world!\n\nThis is a test.\n\n'
        );
    });

    it('3 - Nested elements', () => {
        const parent = document.createElement('div');
        const div = document.createElement('div');
        const paragraph = document.createElement('p');
        paragraph.textContent = 'Hello, world!';
        div.appendChild(paragraph);
        parent.appendChild(div);
        const range = document.createRange();
        range.selectNode(div);
        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };
        expect(createMarkdownContentFromSelection(selection)).toBe('Hello, world!\n\n');
    });

    it('4 - Table selection', () => {
        const parent = document.createElement('div');
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = 'Cell 1';
        tr.appendChild(td);
        table.appendChild(tr);
        parent.appendChild(table);
        const range = document.createRange();
        range.selectNode(table);
        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };
        expect(createMarkdownContentFromSelection(selection)).toBe('| Cell 1 |\n|----|\n\n');
    });

    it('5 - Image selection', () => {
        const parent = document.createElement('div');
        const div = document.createElement('div');
        const image = document.createElement('img');
        image.src = 'https://example.com/image.png';
        div.appendChild(image);
        parent.appendChild(div);
        const range = document.createRange();
        range.selectNode(div);
        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };
        expect(createMarkdownContentFromSelection(selection)).toBe(
            '![image](https://example.com/image.png)\n\n'
        );
    });

    it('6 - Table and Image selection', () => {
        const div = document.createElement('div');
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = 'Cell 1';
        tr.appendChild(td);
        table.appendChild(tr);
        const parent = document.createElement('div');
        const image = document.createElement('img');
        image.src = 'https://example.com/image.png';
        parent.appendChild(image);
        div.appendChild(table);
        div.appendChild(parent);

        const range = document.createRange();
        range.setStartBefore(table);
        range.setEndAfter(image);

        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };

        expect(createMarkdownContentFromSelection(selection)).toBe(
            '| Cell 1 |\n|----|\n\n![image](https://example.com/image.png)\n\n'
        );
    });

    it('7 - Table and Image selection with nested elements', () => {
        const parent = document.createElement('div');
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = 'Cell 1';
        tr.appendChild(td);
        table.appendChild(tr);

        const imageParagraph = document.createElement('p');
        const image = document.createElement('img');
        image.src = 'https://example.com/image.png';
        imageParagraph.appendChild(image);

        const div = document.createElement('div');
        div.appendChild(imageParagraph);
        div.appendChild(image);

        parent.appendChild(table);
        parent.appendChild(div);

        const range = document.createRange();

        range.setStartBefore(table);
        range.setEndAfter(div);

        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };

        expect(createMarkdownContentFromSelection(selection)).toBe(
            '| Cell 1 |\n|----|\n\n![image](https://example.com/image.png)\n\n'
        );
    });

    it('8 - List selection', () => {
        const parent = document.createElement('div');
        const ul = document.createElement('ul');
        const li1 = document.createElement('li');
        li1.textContent = 'Item 1';
        const li2 = document.createElement('li');
        li2.textContent = 'Item 2';
        ul.appendChild(li1);
        ul.appendChild(li2);
        parent.appendChild(ul);
        const range = document.createRange();
        range.selectNode(ul);

        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };

        expect(createMarkdownContentFromSelection(selection)).toBe('- Item 1\n- Item 2\n\n');
    });

    it('9 - Blockquote selection', () => {
        const parent = document.createElement('div');
        const blockquote = document.createElement('blockquote');
        const p = document.createElement('p');
        p.textContent = 'This is a quote.';
        blockquote.appendChild(p);
        parent.appendChild(blockquote);

        const range = document.createRange();
        range.selectNode(blockquote);

        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };

        expect(createMarkdownContentFromSelection(selection)).toBe('> This is a quote.\n');
    });

    it('10 - Horizontal rule selection', () => {
        const parent = document.createElement('div');
        const hr = document.createElement('hr');
        parent.appendChild(hr);
        const range = document.createRange();
        range.selectNode(hr);

        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };

        expect(createMarkdownContentFromSelection(selection)).toBe('\n---\n\n');
    });

    it('11 - Header selection', () => {
        const parent = document.createElement('div');
        const h1 = document.createElement('h1');
        h1.textContent = 'Header 1';
        parent.appendChild(h1);
        const range = document.createRange();
        range.selectNode(h1);

        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };

        expect(createMarkdownContentFromSelection(selection)).toBe('# Header 1\n\n');
    });

    it('12 - Multiple elements selection', () => {
        const div = document.createElement('div');
        const p = document.createElement('p');
        p.textContent = 'Hello, world!';
        const ul = document.createElement('ul');
        const li1 = document.createElement('li');
        li1.textContent = 'Item 1';
        const li2 = document.createElement('li');
        li2.textContent = 'Item 2';
        ul.appendChild(li1);
        ul.appendChild(li2);
        div.appendChild(p);
        div.appendChild(ul);

        const range = document.createRange();
        range.setStartBefore(p);
        range.setEndAfter(ul);

        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };

        expect(createMarkdownContentFromSelection(selection)).toBe(
            'Hello, world!\n\n- Item 1\n- Item 2\n\n'
        );
    });

    it('13 - Different elements selection', () => {
        const div = document.createElement('div');
        const p = document.createElement('p');
        p.textContent = 'Hello, world!';
        const ul = document.createElement('ul');
        const li1 = document.createElement('li');
        li1.textContent = 'Item 1';
        const li2 = document.createElement('li');
        li2.textContent = 'Item 2';
        ul.appendChild(li1);
        ul.appendChild(li2);
        const blockquote = document.createElement('blockquote');
        const p2 = document.createElement('p');
        p2.textContent = 'This is a quote.';
        blockquote.appendChild(p2);
        div.appendChild(p);
        div.appendChild(ul);
        div.appendChild(blockquote);

        const range = document.createRange();
        range.setStartBefore(p);
        range.setEndAfter(blockquote);

        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };

        expect(createMarkdownContentFromSelection(selection)).toBe(
            'Hello, world!\n\n- Item 1\n- Item 2\n\n> This is a quote.\n'
        );
    });

    it('14 -Text with links selection', () => {
        const parent = document.createElement('div');
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = 'https://example.com';
        a.textContent = 'Example';
        p.appendChild(a);
        parent.appendChild(p);

        const range = document.createRange();
        range.selectNode(p);

        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };

        expect(createMarkdownContentFromSelection(selection)).toBe(
            '[Example](https://example.com/)\n\n'
        );
    });

    it('15 - Text with bold and italic selection', () => {
        const parent = document.createElement('div');
        const p = document.createElement('p');
        const strong = document.createElement('b');
        strong.textContent = 'Bold text';
        const em = document.createElement('i');
        em.textContent = 'Italic text';
        p.appendChild(strong);
        p.appendChild(em);
        parent.appendChild(p);

        const range = document.createRange();
        range.selectNode(p);

        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };

        expect(createMarkdownContentFromSelection(selection)).toBe(
            '**Bold text***Italic text*\n\n'
        );
    });

    it('16 - Text, table, and image selection', () => {
        const parent = document.createElement('div');
        const div = document.createElement('div');
        const p = document.createElement('p');
        p.textContent = 'Hello, world!';
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = 'Cell 1';
        tr.appendChild(td);
        table.appendChild(tr);
        const image = document.createElement('img');
        image.src = 'https://example.com/image.png';
        div.appendChild(p);
        div.appendChild(table);
        div.appendChild(image);
        parent.appendChild(div);

        const range = document.createRange();
        range.selectNode(div);

        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };

        expect(createMarkdownContentFromSelection(selection)).toBe(
            'Hello, world!Cell 1![image](https://example.com/image.png)\n\n'
        );
    });

    it('17 - Text, list, bold, italic, table and image selection', () => {
        const div = document.createElement('div');
        const p = document.createElement('p');
        p.textContent = 'Hello, world!';
        const ul = document.createElement('ul');
        const li1 = document.createElement('li');
        li1.textContent = 'Item 1';
        const li2 = document.createElement('li');
        li2.textContent = 'Item 2';
        ul.appendChild(li1);
        ul.appendChild(li2);
        const textParagraph = document.createElement('p');
        const strong = document.createElement('b');
        strong.textContent = 'Bold text';
        const em = document.createElement('i');
        em.textContent = 'Italic text';
        textParagraph.appendChild(strong);
        textParagraph.appendChild(em);
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = 'Cell 1';
        tr.appendChild(td);
        table.appendChild(tr);
        const imageParagraph = document.createElement('p');
        const image = document.createElement('img');
        image.src = 'https://example.com/image.png';
        imageParagraph.appendChild(image);
        div.appendChild(p);
        div.appendChild(ul);
        div.appendChild(textParagraph);
        div.appendChild(table);
        div.appendChild(imageParagraph);

        const range = document.createRange();

        range.setStartBefore(p);
        range.setEndAfter(imageParagraph);

        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };

        expect(createMarkdownContentFromSelection(selection)).toBe(
            'Hello, world!\n\n- Item 1\n- Item 2\n\n**Bold text***Italic text*\n\n| Cell 1 |\n|----|\n\n![image](https://example.com/image.png)\n\n'
        );
    });

    it('18 - Text, list, bold, italic, table with 2 rows and 2 columns,  image, blockquote  selection', () => {
        const div = document.createElement('div');
        const p = document.createElement('p');
        p.textContent = 'Hello, world!';
        const ul = document.createElement('ul');
        const li1 = document.createElement('li');
        li1.textContent = 'Item 1';
        const li2 = document.createElement('li');
        li2.textContent = 'Item 2';
        ul.appendChild(li1);
        ul.appendChild(li2);
        const textParagraph = document.createElement('p');
        const strong = document.createElement('b');
        strong.textContent = 'Bold text';
        const em = document.createElement('i');
        em.textContent = 'Italic text';
        textParagraph.appendChild(strong);
        textParagraph.appendChild(em);
        const table = document.createElement('table');
        const tr1 = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.textContent = 'Cell 1';
        const td2 = document.createElement('td');
        td2.textContent = 'Cell 2';
        tr1.appendChild(td1);
        tr1.appendChild(td2);
        const tr2 = document.createElement('tr');
        const td3 = document.createElement('td');
        td3.textContent = 'Cell 3';
        const td4 = document.createElement('td');
        td4.textContent = 'Cell 4';
        tr2.appendChild(td3);
        tr2.appendChild(td4);
        table.appendChild(tr1);
        table.appendChild(tr2);

        const imageParagraph = document.createElement('p');
        const image = document.createElement('img');
        image.src = 'https://example.com/image.png';
        imageParagraph.appendChild(image);

        const blockquote = document.createElement('blockquote');

        const p2 = document.createElement('p');
        p2.textContent = 'This is a quote.';
        blockquote.appendChild(p2);
        div.appendChild(p);
        div.appendChild(ul);
        div.appendChild(textParagraph);
        div.appendChild(table);
        div.appendChild(imageParagraph);
        div.appendChild(blockquote);

        const range = document.createRange();
        range.setStartBefore(p);
        range.setEndAfter(blockquote);
        const selection: RangeSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };
        expect(createMarkdownContentFromSelection(selection)).toBe(
            'Hello, world!\n\n- Item 1\n- Item 2\n\n**Bold text***Italic text*\n\n| Cell 1 | Cell 2 |\n|----|----|\n| Cell 3 | Cell 4 |\n\n![image](https://example.com/image.png)\n\n> This is a quote.\n'
        );
    });
});
