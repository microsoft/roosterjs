import { ensureTypeInContainer } from './ensureTypeInContainer';
import { getContent } from './getContent';
import { getStyleBasedFormatState } from './getStyleBasedFormatState';
import { insertNode } from './insertNode';
import { setContent } from './setContent';
import type { UnportedCoreApiMap } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const coreApiMap: UnportedCoreApiMap = {
    ensureTypeInContainer,
    getContent,
    getStyleBasedFormatState,
    insertNode,
    setContent,
};
