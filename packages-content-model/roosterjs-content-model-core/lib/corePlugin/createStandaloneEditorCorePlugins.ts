import { createContentModelCachePlugin } from './ContentModelCachePlugin';
import { createContentModelCopyPastePlugin } from './ContentModelCopyPastePlugin';
import { createContentModelFormatPlugin } from './ContentModelFormatPlugin';
import type {
    StandaloneEditorCorePlugins,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';

/**
 * Create core plugins for standalone editor
 * @param options Options of editor
 */
export function createStandaloneEditorCorePlugins(
    options: StandaloneEditorOptions
): StandaloneEditorCorePlugins {
    return {
        cache: createContentModelCachePlugin(options),
        format: createContentModelFormatPlugin(options),
        copyPaste: createContentModelCopyPastePlugin(options),
    };
}
