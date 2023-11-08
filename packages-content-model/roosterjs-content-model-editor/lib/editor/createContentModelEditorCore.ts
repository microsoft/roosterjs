import ContentModelTypeInContainerPlugin from './corePlugins/ContentModelTypeInContainerPlugin';
import { contentModelDomIndexer } from './utils/contentModelDomIndexer';
import { createContentModelCachePlugin } from './corePlugins/ContentModelCachePlugin';
import { createContentModelCopyPastePlugin } from './corePlugins/ContentModelCopyPastePlugin';
import { createContentModelFormatPlugin } from './corePlugins/ContentModelFormatPlugin';
import { createEditorCore } from 'roosterjs-editor-core';
import { promoteToContentModelEditorCore } from 'roosterjs-content-model-core';
import type { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import type { CoreCreator } from 'roosterjs-editor-types';
import type { ContentModelPluginState } from 'roosterjs-content-model-types';

/**
 * Editor Core creator for Content Model editor
 */
export const createContentModelEditorCore: CoreCreator<
    ContentModelEditorCore,
    ContentModelEditorOptions
> = (contentDiv, options) => {
    const pluginState = getPluginState(options);
    const modifiedOptions: ContentModelEditorOptions = {
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

    const core = createEditorCore(contentDiv, modifiedOptions) as ContentModelEditorCore;

    promoteToContentModelEditorCore(core, modifiedOptions, pluginState);

    return core;
};

function getPluginState(options: ContentModelEditorOptions): ContentModelPluginState {
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
