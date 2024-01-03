import { ensureTypeInContainer } from './ensureTypeInContainer';
import { getContent } from './getContent';
import { getStyleBasedFormatState } from './getStyleBasedFormatState';
import { insertNode } from './insertNode';
import { setContent } from './setContent';
import type { ContentModelCoreApiMap } from '../publicTypes/ContentModelEditorCore';

/**
 * @internal
 */
export const coreApiMap: ContentModelCoreApiMap = {
    ensureTypeInContainer,
    getContent,
    getStyleBasedFormatState,
    insertNode,
    setContent,
};
