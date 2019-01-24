import ApiPlaygroundPlugin from './sidePane/apiPlayground/ApiPlaygroundPlugin';
import EditorOptionsPlugin from './sidePane/editorOptions/EditorOptionsPlugin';
import EventViewPlugin from './sidePane/eventViewer/EventViewPlugin';
import FormatStatePlugin from './sidePane/formatState/FormatStatePlugin';
import RibbonPlugin from './ribbon/RibbonPlugin';
import SidePanePlugin from './SidePanePlugin';
import SnapshotPlugin from './sidePane/snapshot/SnapshotPlugin';
import { CustomReplace as CustomReplacePlugin } from 'roosterjs-editor-plugins'
import { EditorPlugin } from 'roosterjs-editor-core';
import { PickerPlugin } from 'roosterjs-plugin-picker';
import SampleColorPickerPluginDataProvider from './samplepicker/SampleColorPickerPluginDataProvider';

export default interface Plugins {
    ribbon: RibbonPlugin;
    formatState: FormatStatePlugin;
    snapshot: SnapshotPlugin;
    editorOptions: EditorOptionsPlugin;
    eventView: EventViewPlugin;
    api: ApiPlaygroundPlugin;
    customReplace: CustomReplacePlugin,
    picker: PickerPlugin,
}

let plugins: Plugins = null;

export function getPlugins(): Plugins {
    if (!plugins) {
        plugins = {
            ribbon: new RibbonPlugin(),
            customReplace: new CustomReplacePlugin(),
            formatState: new FormatStatePlugin(),
            snapshot: new SnapshotPlugin(),
            editorOptions: new EditorOptionsPlugin(),
            eventView: new EventViewPlugin(),
            api: new ApiPlaygroundPlugin(),
            picker: new PickerPlugin(
                new SampleColorPickerPluginDataProvider(),
                {
                    elementIdPrefix: 'samplepicker-',
                    changeSource: 'SAMPLE_COLOR_PICKER',
                    triggerCharacter: ':',
                    isHorizontal: true,
                }
            )
        };
    }
    return plugins;
}

export function getAllPluginArray(includeSidePanePlugins: boolean): EditorPlugin[] {
    let allPlugins = getPlugins();
    return [
        allPlugins.ribbon,
        allPlugins.picker,
        allPlugins.customReplace,
        includeSidePanePlugins && allPlugins.formatState,
        includeSidePanePlugins && allPlugins.editorOptions,
        includeSidePanePlugins && allPlugins.eventView,
        includeSidePanePlugins && allPlugins.api,
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

// expose to the global window for integration tests
Object.defineProperty(window, 'editorPlugins', {
    get: () => plugins
});
