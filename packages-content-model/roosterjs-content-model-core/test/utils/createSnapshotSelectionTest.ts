import { createSnapshotSelection } from '../../lib/utils/createSnapshotSelection';
import { DOMSelection } from 'roosterjs-content-model-types';

describe('createSnapshotSelection', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
    });

    it('Image selection', () => {
        const image = document.createElement('img');
        const selection: DOMSelection = {
            type: 'image',
            image,
        };

        image.id = 'id1';

        const result = createSnapshotSelection(div, selection);

        expect(result).toEqual({
            type: 'image',
            imageId: 'id1',
        });
    });

    it('Table selection', () => {
        const table = document.createElement('table');
        const selection: DOMSelection = {
            type: 'table',
            table,
            firstColumn: 1,
            firstRow: 2,
            lastColumn: 3,
            lastRow: 4,
        };

        table.id = 'id1';

        const result = createSnapshotSelection(div, selection);

        expect(result).toEqual({
            type: 'table',
            tableId: 'id1',
            firstColumn: 1,
            firstRow: 2,
            lastColumn: 3,
            lastRow: 4,
        });
    });
});

describe('createSnapshotSelection - Range selection', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
    });

    it('Null selection', () => {
        const result = createSnapshotSelection(div, null);

        expect(result).toEqual({
            type: 'range',
            start: [],
            end: [],
        });
    });

    it('Direct text node', () => {
        div.innerHTML = 'test';

        const range = div.ownerDocument.createRange();
        range.setStart(div.childNodes[0], 2);
        range.setEnd(div.childNodes[0], 4);

        const result = createSnapshotSelection(div, {
            type: 'range',
            range: range,
        });

        expect(result).toEqual({
            type: 'range',
            start: [0, 2],
            end: [0, 4],
        });
    });

    it('Text node under element', () => {
        div.innerHTML = '<div>test</div>';

        const range = div.ownerDocument.createRange();
        range.setStart(div.childNodes[0].firstChild!, 2);
        range.setEnd(div.childNodes[0].firstChild!, 4);

        const result = createSnapshotSelection(div, {
            type: 'range',
            range: range,
        });

        expect(result).toEqual({
            type: 'range',
            start: [0, 0, 2],
            end: [0, 0, 4],
        });
    });

    it('Element node', () => {
        div.innerHTML = '<div><span>test</span></div><div><br></div>';

        const range = div.ownerDocument.createRange();
        range.setStart(div.childNodes[0].childNodes[0], 1);
        range.setEnd(div.childNodes[1].childNodes[0], 0);

        const result = createSnapshotSelection(div, {
            type: 'range',
            range: range,
        });

        expect(result).toEqual({
            type: 'range',
            start: [0, 0, 1],
            end: [1, 0, 0],
        });
    });

    it('Splitted text node', () => {
        div.appendChild(document.createTextNode('test1'));
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(document.createTextNode('test3'));

        const range = div.ownerDocument.createRange();

        range.setStart(div.childNodes[1], 2);
        range.setEnd(div.childNodes[2], 2);

        const result = createSnapshotSelection(div, {
            type: 'range',
            range: range,
        });

        expect(result).toEqual({
            type: 'range',
            start: [0, 7],
            end: [0, 12],
        });
    });

    it('Splitted text node in deeper element', () => {
        const span = document.createElement('span');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(span);

        span.appendChild(document.createTextNode('test3'));
        span.appendChild(document.createTextNode('test4'));

        div.appendChild(document.createTextNode('test5'));
        div.appendChild(document.createTextNode('test6'));

        const range = div.ownerDocument.createRange();

        range.setStart(div.childNodes[2].childNodes[1], 2);
        range.setEnd(div.childNodes[4], 2);

        const result = createSnapshotSelection(div, {
            type: 'range',
            range: range,
        });

        expect(result).toEqual({
            type: 'range',
            start: [1, 0, 7],
            end: [2, 7],
        });
    });
});
