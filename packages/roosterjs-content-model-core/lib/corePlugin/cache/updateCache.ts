import type {
    CachePluginState,
    ContentModelDocument,
    DOMSelection,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function updateCache(
    state: CachePluginState,
    model: ContentModelDocument,
    selection: DOMSelection | null | undefined
) {
    state.cachedModel = model;

    if (selection?.type == 'range') {
        const {
            range: { startContainer, startOffset, endContainer, endOffset },
            isReverted,
        } = selection;
        state.cachedSelection = {
            type: 'range',
            isReverted: isReverted,
            start: {
                node: startContainer,
                offset: startOffset,
            },
            end: {
                node: endContainer,
                offset: endOffset,
            },
        };
    } else {
        state.cachedSelection = selection ?? undefined;
    }
}
