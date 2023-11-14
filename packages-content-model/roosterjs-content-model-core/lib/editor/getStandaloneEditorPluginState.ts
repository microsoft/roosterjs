import { contentModelDomIndexer } from '../corePlugin/utils/contentModelDomIndexer';
import type { EditorOptions } from 'roosterjs-editor-types';
import type {
    ContentModelPluginState,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';

/**
 * Get plugin state for standalone Content Model editor
 * @param options Editor options
 */
export function getStandaloneEditorPluginState(
    options: EditorOptions & StandaloneEditorOptions
): ContentModelPluginState {
    const format = options.defaultFormat || {};
    return {
        cache: {
            domIndexer: options.cacheModel ? contentModelDomIndexer : undefined,
        },
        format: {
            defaultFormat: {
                fontWeight: format.bold ? 'bold' : undefined,
                italic: format.italic || undefined,
                underline: format.underline || undefined,
                fontFamily: format.fontFamily || undefined,
                fontSize: format.fontSize || undefined,
                textColor: format.textColors?.lightModeColor || format.textColor || undefined,
                backgroundColor:
                    format.backgroundColors?.lightModeColor || format.backgroundColor || undefined,
            },
            pendingFormat: null,
        },
    };
}
