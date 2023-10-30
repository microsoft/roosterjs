import { getContent } from './getContent';
import { insertNode } from './insertNode';
import { setContent } from './setContent';
import type { AdapterEditorCoreApiMap } from '../editor/AdapterEditorCore';

/**
 * @internal
 */
export const coreApiMap: AdapterEditorCoreApiMap = {
    getContent,
    insertNode,
    setContent,
};
