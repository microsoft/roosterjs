import { CachePluginState } from 'roosterjs-content-model-types';
import { updateCachedSelection } from '../../../lib/corePlugin/cache/updateCachedSelection';

describe('updateCachedSelection', () => {
    it('Update to undefined', () => {
        const state: CachePluginState = {};

        updateCachedSelection(state, undefined);

        expect(state).toEqual({
            cachedSelection: undefined,
        });
    });

    it('Update to table selection', () => {
        const state: CachePluginState = {};
        const mockedSelection = {
            type: 'table',
        } as any;

        updateCachedSelection(state, mockedSelection);

        expect(state).toEqual({
            cachedSelection: mockedSelection,
        });
    });

    it('Update to image selection', () => {
        const state: CachePluginState = {};
        const mockedSelection = {
            type: 'image',
        } as any;

        updateCachedSelection(state, mockedSelection);

        expect(state).toEqual({
            cachedSelection: mockedSelection,
        });
    });

    it('Update to range selection', () => {
        const state: CachePluginState = {};
        const mockedSelection = {
            type: 'range',
            range: {
                startContainer: 'NODE1',
                endContainer: 'NODE2',
                startOffset: 'OFFSET1',
                endOffset: 'OFFSET2',
            },
            isReverted: false,
        } as any;

        updateCachedSelection(state, mockedSelection);

        expect(state).toEqual({
            cachedSelection: {
                type: 'range',
                start: {
                    node: 'NODE1',
                    offset: 'OFFSET1',
                },
                end: {
                    node: 'NODE2',
                    offset: 'OFFSET2',
                },
                isReverted: false,
            } as any,
        });
    });
});
