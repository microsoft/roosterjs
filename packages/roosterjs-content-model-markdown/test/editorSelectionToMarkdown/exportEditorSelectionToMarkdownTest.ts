import { exportEditorSelectionToMarkdown } from '../../lib/editorSelectionToMarkdown/exportEditorSelectionToMarkdown';
import {
    DOMSelection,
    ImageSelection,
    RangeSelection,
    TableSelection,
} from 'roosterjs-content-model-types';

describe('exportEditorSelectionToMarkdown', () => {
    function runTest(selection: DOMSelection, expected: string) {
        // Act
        const result = exportEditorSelectionToMarkdown(selection);

        // Assert
        expect(result).toEqual(expected);
    }

    it('should return table markdown', () => {
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
        const tableSelection: TableSelection = {
            type: 'table',
            table: table,
            firstRow: 0,
            lastRow: 1,
            firstColumn: 0,
            lastColumn: 1,
        };
        runTest(tableSelection, '| Cell 1 | Cell 2 |\n|----|----|\n| Cell 3 | Cell 4 |\n');
    });

    it('empty selection', () => {
        const range = document.createRange();
        range.collapse();
        const rangeSelection: DOMSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };
        runTest(rangeSelection, '');
    });

    it('image selection', () => {
        const img = document.createElement('img');
        img.src = 'https://example.com/image.png';
        img.alt = 'Example Image';
        const imageSelection: ImageSelection = {
            type: 'image',
            image: img,
        };
        runTest(imageSelection, '![Example Image](https://example.com/image.png)');
    });

    it('range selection with link', () => {
        const parentDiv = document.createElement('div');
        const textNode1 = document.createTextNode('text1');
        const link = document.createElement('a');
        link.href = 'https://example.com';
        link.textContent = 'link';
        const textNode2 = document.createTextNode('text2');
        parentDiv.appendChild(textNode1);
        parentDiv.appendChild(link);
        parentDiv.appendChild(textNode2);
        const range = document.createRange();
        range.setStart(textNode1, 0);
        range.setEnd(textNode2, 3);
        const rangeSelection: DOMSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };
        runTest(rangeSelection, 'text1[link](https://example.com/)tex');
    });
    it('range selection with bold and italic', () => {
        const parentDiv = document.createElement('div');
        const textNode1 = document.createTextNode('text1');
        const strong = document.createElement('b');
        strong.textContent = 'bold';
        const em = document.createElement('i');
        em.textContent = 'italic';
        const textNode2 = document.createTextNode('text2');
        parentDiv.appendChild(textNode1);
        parentDiv.appendChild(strong);
        parentDiv.appendChild(em);
        parentDiv.appendChild(textNode2);
        const range = document.createRange();
        range.setStart(textNode1, 0);
        range.setEnd(textNode2, 3);
        const rangeSelection: DOMSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };
        runTest(rangeSelection, 'text1**bold***italic*tex');
    });

    it('range selection with blockquote', () => {
        const parentDiv = document.createElement('div');
        const blockquote = document.createElement('blockquote');
        const textNode1 = document.createTextNode('text1');
        const textNode2 = document.createTextNode('text2');
        blockquote.appendChild(textNode1);
        parentDiv.appendChild(blockquote);
        parentDiv.appendChild(textNode2);
        const range = document.createRange();
        range.setStart(textNode1, 0);
        range.setEnd(textNode2, 3);
        const rangeSelection: DOMSelection = {
            type: 'range',
            range: range,
            isReverted: false,
        };
        runTest(rangeSelection, '> text1\ntex');
    });

    it('Text, list, bold, italic, table with 2 rows and 2 columns,  image, blockquote  selection', () => {
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

        runTest(
            selection,
            'Hello, world!\n\n- Item 1\n- Item 2\n\n**Bold text***Italic text*\n\n| Cell 1 | Cell 2 |\n|----|----|\n| Cell 3 | Cell 4 |\n\n![image](https://example.com/image.png)\n\n> This is a quote.\n'
        );
    });
});
