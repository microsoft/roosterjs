import ApiPlaygroundPlugin from './sidePane/apiPlayground/ApiPlaygroundPlugin';
import EditorOptionsPlugin from './sidePane/editorOptions/EditorOptionsPlugin';
import EventViewPlugin from './sidePane/eventViewer/EventViewPlugin';
import FormatStatePlugin from './sidePane/formatState/FormatStatePlugin';
import MainPaneBase from './MainPaneBase';
import RibbonPlugin from './ribbon/RibbonPlugin';
import SidePanePlugin from './SidePanePlugin';
import SnapshotPlugin from './sidePane/snapshot/SnapshotPlugin';
import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';

export default interface Plugins {
    ribbon: RibbonPlugin;
    formatState: FormatStatePlugin;
    snapshot: SnapshotPlugin;
    editorOptions: EditorOptionsPlugin;
    eventView: EventViewPlugin;
    api: ApiPlaygroundPlugin;
    bridge: Bridge;
}

let plugins: Plugins = null;

export function getPlugins(): Plugins {
    if (!plugins) {
        plugins = {
            ribbon: new RibbonPlugin(),
            formatState: new FormatStatePlugin(),
            snapshot: new SnapshotPlugin(),
            editorOptions: new EditorOptionsPlugin(),
            eventView: new EventViewPlugin(),
            api: new ApiPlaygroundPlugin(),
            bridge: new Bridge(),
        };
    }
    return plugins;
}

export function getAllPluginArray(includeSidePanePlugins: boolean): EditorPlugin[] {
    let allPlugins = getPlugins();
    return [
        allPlugins.ribbon,
        includeSidePanePlugins && allPlugins.formatState,
        includeSidePanePlugins && allPlugins.editorOptions,
        includeSidePanePlugins && allPlugins.eventView,
        includeSidePanePlugins && allPlugins.api,
        includeSidePanePlugins && allPlugins.snapshot,
        allPlugins.bridge,
    ];
}

export function getSidePanePluginArray(): SidePanePlugin[] {
    let allPlugins = getPlugins();
    return [
        allPlugins.formatState,
        allPlugins.editorOptions,
        allPlugins.snapshot,
        allPlugins.eventView,
        allPlugins.api,
    ];
}

class Bridge implements EditorPlugin {
    private editor: IEditor;
    private isDark: boolean = undefined;
    private content: string = undefined;

    getName() {
        return 'Bridge';
    }

    initialize(editor: IEditor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    onPluginEvent(e: PluginEvent) {
        if (e.eventType == PluginEventType.EditorReady) {
            if (this.isDark !== undefined) {
                this.editor.setDarkModeState(
                    this.isDark && MainPaneBase.getInstance().isDarkModeSupported()
                );
            }
            if (this.content !== undefined) {
                this.editor.setContent(this.content);
            }
        } else if (e.eventType == PluginEventType.BeforeDispose) {
            this.isDark = this.editor.isDarkMode();
            this.content = this.editor.getContent();
        }
    }
}
