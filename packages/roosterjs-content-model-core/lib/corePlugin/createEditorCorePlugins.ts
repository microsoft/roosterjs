import { createCachePlugin } from './cache/CachePlugin';
import { createContextMenuPlugin } from './contextMenu/ContextMenuPlugin';
import { createCopyPastePlugin } from './copyPaste/CopyPastePlugin';
import { createDOMEventPlugin } from './domEvent/DOMEventPlugin';
import { createEntityPlugin } from './entity/EntityPlugin';
import { createFormatPlugin } from './format/FormatPlugin';
import { createLifecyclePlugin } from './lifecycle/LifecyclePlugin';
import { createSelectionPlugin } from './selection/SelectionPlugin';
import { createUndoPlugin } from './undo/UndoPlugin';
import type { EditorCorePlugins, EditorOptions } from 'roosterjs-content-model-types';

/**
 * @internal
 * Create core plugins for editor
 * @param options Options of editor
 */
export function createEditorCorePlugins(
    options: EditorOptions,
    contentDiv: HTMLDivElement
): EditorCorePlugins {
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
