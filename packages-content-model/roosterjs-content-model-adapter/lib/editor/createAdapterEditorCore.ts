import { AdapterEditorPlugin } from './AdapterEditorPlugin';
import { coreApiMap } from '../coreApi/coreApiMap';
import { CoreEditor } from 'roosterjs-content-model-core/lib';
import type { EditorOptions } from 'roosterjs-editor-types';
import type { AdapterEditorCore } from './AdapterEditorCore';
import type { CoreEditorOptions, ICoreEditor } from 'roosterjs-content-model-types';

const ExclusivePluginKey = '__ExclusivelyPlugin';

/**
 * @internal
 */
export function createAdapterEditorCore(
    contentDiv: HTMLDivElement,
    options: EditorOptions,
    coreEditorOptions: CoreEditorOptions
): AdapterEditorCore {
    let core: AdapterEditorCore;

    if (!coreEditorOptions.plugins) {
        coreEditorOptions.plugins = [];
    }

    coreEditorOptions.plugins.push(
        new AdapterEditorPlugin(
            event => {
                const plugin = event.eventDataCache?.[ExclusivePluginKey];

                (plugin ? [plugin] : core.plugins).forEach(p => p.onPluginEvent?.(event));

                return event;
            },
            event => {
                return core.plugins.some(plugin => {
                    if (plugin.onPluginEvent && plugin.willHandleEventExclusively?.(event)) {
                        if (!event.eventDataCache) {
                            event.eventDataCache = {};
                        }

                        event.eventDataCache[ExclusivePluginKey] = plugin;

                        return true;
                    } else {
                        return false;
                    }
                });
            }
        )
    );

    let coreEditor: ICoreEditor = new CoreEditor(contentDiv, coreEditorOptions);

    core = {
        api: coreApiMap, // TODO: Support core API map
        contentDiv,
        coreEditor: coreEditor,
        getVisibleViewport: () => {},
        imageSelectionBorderColor: options.imageSelectionBorderColor,
        originalApi: coreApiMap,
        plugins: (options.plugins || []).filter(x => !!x),
        trustedHTMLHandler: options.trustedHTMLHandler || (html => html),
        zoomScale: options.zoomScale || 1,
    };

    return core;
}
