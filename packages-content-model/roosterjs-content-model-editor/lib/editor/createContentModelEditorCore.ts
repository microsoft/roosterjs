import { contentModelCoreApiMap } from './coreApi/contentModelCoreApiMap';
import { ContentModelEditorPlugin } from '../publicTypes/ContentModelEditorPlugin';
import { createContentModelCachePlugin } from './corePlugins/ContentModelCachePlugin';
import { createContentModelEditPlugin } from './corePlugins/ContentModelEditPlugin';
import { createContentModelFormatPlugin } from './corePlugins/ContentModelFormatPlugin';
import { createCopyPastePlugin } from './corePlugins/ContentModelCopyPastePlugin';
import { DomToModelOption, ModelToDomOption } from 'roosterjs-content-model-types/lib';
import { tablePreProcessor } from './overrides/tablePreProcessor';
import { TrustedHTMLHandler } from '../publicTypes/callback/TrustedHTMLHandler';
import {
    createDomToModelConfig,
    createModelToDomConfig,
    getObjectKeys,
} from 'roosterjs-content-model-dom';
import {
    ContentModelCorePlugins,
    ContentModelPluginStates,
} from '../publicTypes/pluginState/ContentModelPluginState';
import type { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';

interface CorePluginsWithPlaceholder extends ContentModelCorePlugins {
    _placeholder: null;
}
/**
 * Editor Core creator for Content Model editor
 */
export function createContentModelEditorCore(
    contentDiv: HTMLDivElement,
    options: ContentModelEditorOptions
): ContentModelEditorCore {
    const corePlugins: CorePluginsWithPlaceholder = {
        cache: createContentModelCachePlugin(),
        format: createContentModelFormatPlugin(options),
        edit: createContentModelEditPlugin(),
        _placeholder: null,
        undo: createUndoPlugin(options),
        domEvent: createDOMEventPlugin(options),
        copyPaste: createCopyPastePlugin(options),
        entity: createEntityPlugin(options),
        selection: createSelectionPlugin(options),
        lifecycle: createLifecyclePlugin(options),
    };

    const plugins: ContentModelEditorPlugin[] = [];

    getObjectKeys(corePlugins).forEach(name => {
        if (name != '_placeholder') {
            plugins.push(corePlugins[name]);
        } else if (options.plugins) {
            plugins.push(...options.plugins);
        }
    });

    const pluginState: ContentModelPluginStates = {
        domEvent: corePlugins.domEvent.getState(),
        lifecycle: corePlugins.lifecycle.getState(),
        undo: corePlugins.undo.getState(),
        entity: corePlugins.entity.getState(),
        copyPaste: corePlugins.copyPaste.getState(),
        cache: corePlugins.cache.getState(),
        format: corePlugins.format.getState(),
        selection: corePlugins.selection.getState(),
    };

    const defaultDomToModelOptions: (DomToModelOption | undefined)[] = [
        {
            processorOverride: {
                table: tablePreProcessor,
            },
        },
        options.defaultDomToModelOptions,
    ];
    const defaultModelToDomOptions: (ModelToDomOption | undefined)[] = [
        options.defaultModelToDomOptions,
    ];

    const core: ContentModelEditorCore = {
        contentDiv,
        api: {
            ...contentModelCoreApiMap,
            ...options.coreApiOverride,
        },
        originalApi: contentModelCoreApiMap,
        plugins: plugins.filter(x => !!x),
        ...pluginState,
        trustedHTMLHandler: options.trustedHTMLHandler || defaultTrustedHtmlHandler,
        darkColorHandler: new DarkColorHandlerImpl(contentDiv, pluginState.lifecycle.getDarkColor),

        defaultDomToModelOptions,
        defaultModelToDomOptions,
        defaultDomToModelConfig: createDomToModelConfig(defaultDomToModelOptions),
        defaultModelToDomConfig: createModelToDomConfig(defaultModelToDomOptions),
    };

    return core;
}

const defaultTrustedHtmlHandler: TrustedHTMLHandler = html => html;
