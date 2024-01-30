import { createContentModelCachePlugin } from './ContentModelCachePlugin';
import { createContentModelCopyPastePlugin } from './ContentModelCopyPastePlugin';
import { createContentModelFormatPlugin } from './ContentModelFormatPlugin';
import { createContextMenuPlugin } from './ContextMenuPlugin';
import { createDOMEventPlugin } from './DOMEventPlugin';
import { createEntityPlugin } from './EntityPlugin';
import { createLifecyclePlugin } from './LifecyclePlugin';
import { createSelectionPlugin } from './SelectionPlugin';
import { createUndoPlugin } from './UndoPlugin';
import type {
    StandaloneEditorCorePlugins,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Create core plugins for standalone editor
 * @param options Options of editor
 */
export function createStandaloneEditorCorePlugins(
    options: StandaloneEditorOptions,
    contentDiv: HTMLDivElement
): StandaloneEditorCorePlugins {
    return {
        cache: createContentModelCachePlugin(options, contentDiv),
        format: createContentModelFormatPlugin(options),
        copyPaste: createContentModelCopyPastePlugin(options),
        domEvent: createDOMEventPlugin(options, contentDiv),
        lifecycle: createLifecyclePlugin(options, contentDiv),
        entity: createEntityPlugin(),
        selection: createSelectionPlugin(options),
        contextMenu: createContextMenuPlugin(options),
        undo: createUndoPlugin(options),
    };
}
