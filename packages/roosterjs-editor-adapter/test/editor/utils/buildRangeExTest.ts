import { buildRangeEx } from '../../../lib/editor/utils/buildRangeEx';
import { SelectionRangeTypes } from 'roosterjs-editor-types';

describe('buildRangeEx', () => {
    let root: HTMLDivElement;

    beforeEach(() => {
        root = document.createElement('div');
        root.innerHTML = '<div>line1</div><div>line2</div>';
        document.body.appendChild(root);
    });

    afterEach(() => {
        root.parentNode?.removeChild(root);
    });

    it('returns the SelectionRangeEx as-is when given one', () => {
        const input = {
            type: SelectionRangeTypes.Normal,
            ranges: [],
            areAllCollapsed: true,
        } as any;

        expect(buildRangeEx(root, input)).toBe(input);
    });

    it('builds a table selection from a table element and coordinates', () => {
        const table = document.createElement('table');
        const coordinates = {
            firstCell: { x: 0, y: 0 },
            lastCell: { x: 1, y: 1 },
        } as any;

        const result = buildRangeEx(root, table, coordinates);

        expect(result.type).toBe(SelectionRangeTypes.TableSelection);
        expect((result as any).table).toBe(table);
        expect((result as any).coordinates).toBe(coordinates);
        expect(result.areAllCollapsed).toBe(false);
    });

    it('builds a table selection with undefined coordinates when given null', () => {
        const table = document.createElement('table');

        const result = buildRangeEx(root, table, null);

        expect(result.type).toBe(SelectionRangeTypes.TableSelection);
        expect((result as any).coordinates).toBeUndefined();
    });

    it('builds an image selection from an image element', () => {
        const image = document.createElement('img');

        const result = buildRangeEx(root, image);

        expect(result.type).toBe(SelectionRangeTypes.ImageSelection);
        expect((result as any).image).toBe(image);
    });

    it('builds an empty normal selection for null', () => {
        const result = buildRangeEx(root, null);

        expect(result.type).toBe(SelectionRangeTypes.Normal);
        expect(result.ranges).toEqual([]);
        expect(result.areAllCollapsed).toBe(true);
    });

    it('builds a normal selection from a Range', () => {
        const range = document.createRange();
        range.selectNodeContents(root);

        const result = buildRangeEx(root, range);

        expect(result.type).toBe(SelectionRangeTypes.Normal);
        expect(result.ranges[0]).toBe(range);
        expect(result.areAllCollapsed).toBe(range.collapsed);
    });

    it('reports areAllCollapsed for a collapsed Range', () => {
        const range = document.createRange();
        range.setStart(root, 0);
        range.collapse(true);

        const result = buildRangeEx(root, range);

        expect(result.type).toBe(SelectionRangeTypes.Normal);
        expect(result.areAllCollapsed).toBe(true);
    });

    it('builds a normal selection from a SelectionPath', () => {
        const path = { start: [0, 0], end: [0, 3] } as any;

        const result = buildRangeEx(root, path);

        expect(result.type).toBe(SelectionRangeTypes.Normal);
        expect(result.ranges.length).toBe(1);
    });

    it('builds a normal selection from a NodePosition', () => {
        const textNode = root.firstChild!.firstChild!; // 'line1' text node
        const position = { node: textNode, offset: 2 } as any;

        const result = buildRangeEx(root, position);

        expect(result.type).toBe(SelectionRangeTypes.Normal);
        expect(result.ranges.length).toBe(1);
    });

    it('builds a normal selection from a Node', () => {
        const node = root.firstChild!; // first <div>

        const result = buildRangeEx(root, node, 0 as any);

        expect(result.type).toBe(SelectionRangeTypes.Normal);
        expect(result.ranges.length).toBe(1);
    });
});
