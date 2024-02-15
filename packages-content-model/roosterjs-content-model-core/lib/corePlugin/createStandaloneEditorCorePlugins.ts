import { createCachePlugin } from './CachePlugin';
import { createContextMenuPlugin } from './ContextMenuPlugin';
import { createCopyPastePlugin } from './CopyPastePlugin';
import { createDOMEventPlugin } from './DOMEventPlugin';
import { createEntityPlugin } from './EntityPlugin';
import { createFormatPlugin } from './FormatPlugin';
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
        cache: createCachePlugin(options, contentDiv),
        format: createFormatPlugin(options),
        copyPaste: createCopyPastePlugin(options),
        domEvent: createDOMEventPlugin(options, contentDiv),
        lifecycle: createLifecyclePlugin(options, contentDiv),
        entity: createEntityPlugin(),
        selection: createSelectionPlugin(options),
        contextMenu: createContextMenuPlugin(options),
        undo: createUndoPlugin(options),
    };
}
