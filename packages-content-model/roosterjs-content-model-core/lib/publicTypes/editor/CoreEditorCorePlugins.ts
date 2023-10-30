import type { ContentModelLifecyclePluginState } from '../corePluginState/ContentModelLifecyclePluginState';
import type { ContentModelSelectionPluginState } from '../corePluginState/ContentModelSelectionPluginState';
import type { CoreEditorPlugin } from './CoreEditorPlugin';
import type {
    ContentModelCachePluginState,
    ContentModelFormatPluginState,
} from 'roosterjs-content-model-editor';
import type { CoreEditorPluginWithState } from './CoreEditorPluginWithState';

/**
 * @internal
 */
export interface CoreEditorCorePlugins {
    cache: CoreEditorPluginWithState<ContentModelCachePluginState>;
    format: CoreEditorPluginWithState<ContentModelFormatPluginState>;
    keyboardEdit: CoreEditorPlugin;
    selection: CoreEditorPluginWithState<ContentModelSelectionPluginState>;
    lifecycle: CoreEditorPluginWithState<ContentModelLifecyclePluginState>;
}
