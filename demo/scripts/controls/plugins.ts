import ApiPlaygroundPlugin from './sidePane/apiPlayground/ApiPlaygroundPlugin';
import EditorOptionsPlugin from './sidePane/editorOptions/EditorOptionsPlugin';
import EntityHydratingPlugin from './editor/EntityHydratingPlugin';
import EventViewPlugin from './sidePane/eventViewer/EventViewPlugin';
import FormatStatePlugin from './sidePane/formatState/FormatStatePlugin';
import RibbonPlugin from './ribbon/RibbonPlugin';
import SidePanePlugin from './SidePanePlugin';
import SnapshotPlugin from './sidePane/snapshot/SnapshotPlugin';
import { EditorPlugin } from 'roosterjs-editor-types';

export default interface Plugins {
    ribbon: RibbonPlugin;
    formatState: FormatStatePlugin;
    snapshot: SnapshotPlugin;
    editorOptions: EditorOptionsPlugin;
    eventView: EventViewPlugin;
    api: ApiPlaygroundPlugin;
    entityHydrating: EntityHydratingPlugin;
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
            entityHydrating: new EntityHydratingPlugin(),
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
        allPlugins.entityHydrating,
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
