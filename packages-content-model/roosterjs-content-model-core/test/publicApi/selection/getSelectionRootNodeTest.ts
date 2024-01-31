import { getSelectionRootNode } from '../../../lib/publicApi/selection/getSelectionRootNode';

describe('getSelectionRootNode', () => {
    it('undefined input', () => {
        const root = getSelectionRootNode(undefined);

        expect(root).toBeUndefined();
    });

    it('range input', () => {
        const mockedRoot = 'ROOT' as any;
        const root = getSelectionRootNode({
            type: 'range',
            range: {
                commonAncestorContainer: mockedRoot,
            } as any,
            isReverted: false,
        });

        expect(root).toBe(mockedRoot);
    });

    it('table input', () => {
        const mockedTable = 'TABLE' as any;
        const root = getSelectionRootNode({
            type: 'table',
            table: mockedTable,
        } as any);

        expect(root).toBe(mockedTable);
    });

    it('image input', () => {
        const mockedImage = 'IMAGE' as any;
        const root = getSelectionRootNode({
            type: 'image',
            image: mockedImage,
        } as any);

        expect(root).toBe(mockedImage);
    });
});
