import { createDOMHelper } from '../../../lib/editor/core/DOMHelperImpl';
import { DOMHelper, ParsedTable } from 'roosterjs-content-model-types';
import { findCoordinate } from '../../../lib/corePlugin/selection/findCoordinate';

describe('findCoordinate', () => {
    let domHelper: DOMHelper;
    let root: HTMLElement;

    beforeEach(() => {
        root = document.createElement('div');
        domHelper = createDOMHelper(root);
    });

    it('Empty table', () => {
        const table: ParsedTable = [];
        const text = document.createTextNode('test');

        root.appendChild(text);

        const result = findCoordinate(table, text, domHelper);

        expect(result).toBeNull();
    });

    it('Table contains node', () => {
        const container = document.createElement('div') as any;
        root.appendChild(container);

        const table: ParsedTable = [[container]];
        const text = document.createTextNode('test');

        container.appendChild(text);

        const result = findCoordinate(table, text, domHelper);

        expect(result).toEqual({ row: 0, col: 0 });
    });

    it('Table contains node indirectly', () => {
        const container = document.createElement('div') as any;
        root.appendChild(container);

        const table: ParsedTable = [[container]];
        const span = document.createElement('span');
        const text = document.createTextNode('test');

        span.appendChild(text);
        container.appendChild(span);

        const result = findCoordinate(table, text, domHelper);

        expect(result).toEqual({ row: 0, col: 0 });
    });

    it('Table contains node on second row', () => {
        const container = document.createElement('div') as any;
        root.appendChild(container);

        const table: ParsedTable = [[], ['spanLeft', container]];
        const span = document.createElement('span');
        const text = document.createTextNode('test');

        span.appendChild(text);
        container.appendChild(span);

        const result = findCoordinate(table, text, domHelper);

        expect(result).toEqual({ row: 1, col: 1 });
    });
});
