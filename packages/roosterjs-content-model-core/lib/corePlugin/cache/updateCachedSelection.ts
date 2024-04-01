import type { CachePluginState, DOMSelection } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function updateCachedSelection(
    state: CachePluginState,
    selection: DOMSelection | undefined
) {
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
        state.cachedSelection = selection;
    }
}
