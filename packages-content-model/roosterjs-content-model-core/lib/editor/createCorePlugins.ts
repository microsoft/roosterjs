import type { CoreEditorOptions } from 'roosterjs-content-model-types';
import type { CoreEditorCorePlugins } from '../publicTypes/editor/CoreEditorCorePlugins';

/**
 * @internal
 */
export function createCorePlugins(
    contentDiv: HTMLDivElement,
    options: CoreEditorOptions
): CoreEditorCorePlugins & {
    __placeholder: null;
} {
    return ({
        // TODO: Add implementation
    } as any) as CoreEditorCorePlugins & {
        __placeholder: null;
    };
}
