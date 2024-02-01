import { getContent } from './getContent';
import { insertNode } from './insertNode';
import type { ContentModelCoreApiMap } from '../publicTypes/ContentModelEditorCore';

/**
 * @internal
 */
export const coreApiMap: ContentModelCoreApiMap = {
    getContent,
    insertNode,
};
