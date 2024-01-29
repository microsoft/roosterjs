import { DOMSelection } from 'roosterjs-content-model-types';
import { getFocusedPosition } from '../../lib/domUtils/getFocusedPosition';

describe('getFocusedPosition', () => {
    it('Range selection, Reverted Selection return startContainer', () => {
        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: 'startContainer',
                startOffset: 'startOffset',
                endContainer: 'endContainer',
                endOffset: 'endOffset',
            } as any,
            isReverted: true,
        };
        const result = getFocusedPosition(selection);

        expect(result?.container).toEqual(<any>'startContainer');
        expect(result?.offset).toEqual(<any>'startOffset');
    });

    it('Range selection, not Reverted Selection return startContainer', () => {
        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: 'startContainer',
                startOffset: 'startOffset',
                endContainer: 'endContainer',
                endOffset: 'endOffset',
            } as any,
            isReverted: false,
        };
        const result = getFocusedPosition(selection);

        expect(result?.container).toEqual(<any>'endContainer');
        expect(result?.offset).toEqual(<any>'endOffset');
    });
});
