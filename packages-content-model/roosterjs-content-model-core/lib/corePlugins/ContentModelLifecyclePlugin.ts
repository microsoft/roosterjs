import { ContentModelLifecyclePluginState } from '../publicTypes/pluginState/ContentModelLifecyclePluginState';
import { IContentModelEditor } from '../publicTypes/editor/IContentModelEditor';
import { PluginWithState } from '../publicTypes/plugin/PluginWithState';

class ContentModelLifecyclePlugin implements PluginWithState<ContentModelLifecyclePluginState> {
    private state: ContentModelLifecyclePluginState;

    constructor() {
        this.state = {
            customData: {},
            isDarkMode: false,
            isInShadowEdit: false,
        };
    }
    getName() {
        return 'Selection';
    }

    initialize(editor: IContentModelEditor) {}

    dispose() {}

    getState(): ContentModelLifecyclePluginState {
        return this.state;
    }
}

export function createContentModelLifecyclePlugin() {
    return new ContentModelLifecyclePlugin();
}
