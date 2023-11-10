import { contentModelDomIndexer } from '../corePlugin/utils/contentModelDomIndexer';
import { ContentModelTypeInContainerPlugin } from '../corePlugin/ContentModelTypeInContainerPlugin';
import { createContentModelCachePlugin } from '../corePlugin/ContentModelCachePlugin';
import { createContentModelCopyPastePlugin } from '../corePlugin/ContentModelCopyPastePlugin';
import { createContentModelFormatPlugin } from '../corePlugin/ContentModelFormatPlugin';
import { createEditorCore } from 'roosterjs-editor-core';
import { promoteToContentModelEditorCore } from './promoteToContentModelEditorCore';
import type { CoreCreator, EditorCore, EditorOptions } from 'roosterjs-editor-types';
import type {
    ContentModelPluginState,
    StandaloneEditorCore,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';

/**
 * Editor Core creator for Content Model editor
 */
export const createContentModelEditorCore: CoreCreator<
    EditorCore & StandaloneEditorCore,
    EditorOptions & StandaloneEditorOptions
> = (contentDiv, options) => {
    const pluginState = getPluginState(options);
    const modifiedOptions: EditorOptions & StandaloneEditorOptions = {
        ...options,
        plugins: [
            createContentModelCachePlugin(pluginState.cache),
            createContentModelFormatPlugin(pluginState.format),
            ...(options.plugins || []),
        ],
        corePluginOverride: {
            typeInContainer: new ContentModelTypeInContainerPlugin(),
            copyPaste: createContentModelCopyPastePlugin(pluginState.copyPaste),
            ...options.corePluginOverride,
        },
    };

    const core = createEditorCore(contentDiv, modifiedOptions) as EditorCore & StandaloneEditorCore;

    promoteToContentModelEditorCore(core, modifiedOptions, pluginState);

    return core;
};

function getPluginState(options: EditorOptions & StandaloneEditorOptions): ContentModelPluginState {
    const format = options.defaultFormat || {};
    return {
        cache: {
            domIndexer: options.cacheModel ? contentModelDomIndexer : undefined,
        },
        copyPaste: {
            allowedCustomPasteType: options.allowedCustomPasteType || [],
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
