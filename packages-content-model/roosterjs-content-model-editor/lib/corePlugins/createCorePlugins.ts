import { createContextMenuPlugin } from './ContextMenuPlugin';
import { createEditPlugin } from './EditPlugin';
import { createEventTypeTranslatePlugin } from './EventTypeTranslatePlugin';
import { createNormalizeTablePlugin } from './NormalizeTablePlugin';
import type { ContentModelCorePlugins } from '../publicTypes/ContentModelCorePlugins';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';

/**
 * @internal
 * Create Core Plugins
 * @param options Editor options
 */
export function createCorePlugins(options: ContentModelEditorOptions): ContentModelCorePlugins {
    const map = options.corePluginOverride || {};

    // The order matters, some plugin needs to be put before/after others to make sure event
    // can be handled in right order
    return {
        eventTranslate: map.eventTranslate || createEventTypeTranslatePlugin(),
        edit: map.edit || createEditPlugin(),
        normalizeTable: map.normalizeTable || createNormalizeTablePlugin(),
        contextMenu: map.contextMenu || createContextMenuPlugin(options),
    };
}
