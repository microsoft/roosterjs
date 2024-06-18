import { CachePluginState } from 'roosterjs-content-model-types';
import { updateCache } from '../../../lib/corePlugin/cache/updateCache';

describe('updateCache', () => {
    const mockedModel = 'MODEL' as any;

    it('Update to undefined', () => {
        const state: CachePluginState = {};

        updateCache(state, mockedModel, undefined);

        expect(state).toEqual({
            cachedSelection: undefined,
            cachedModel: mockedModel,
        });
    });

    it('Update to table selection', () => {
        const state: CachePluginState = {};
        const mockedSelection = {
            type: 'table',
        } as any;

        updateCache(state, mockedModel, mockedSelection);

        expect(state).toEqual({
            cachedSelection: mockedSelection,
            cachedModel: mockedModel,
        });
    });

    it('Update to image selection', () => {
        const state: CachePluginState = {};
        const mockedSelection = {
            type: 'image',
        } as any;

        updateCache(state, mockedModel, mockedSelection);

        expect(state).toEqual({
            cachedSelection: mockedSelection,
            cachedModel: mockedModel,
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

        updateCache(state, mockedModel, mockedSelection);

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
            cachedModel: mockedModel,
        });
    });
});
