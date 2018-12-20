import EditorOptionsPlugin from './sidePane/editorOptions/EditorOptionsPlugin';
import EventViewPlugin from './sidePane/eventViewer/EventViewPlugin';
import FormatStatePlugin from './sidePane/formatState/FormatStatePlugin';
import PasteResultPlugin from './sidePane/pasteResult/PasteResultPlugin';
import RibbonPlugin from './ribbon/RibbonPlugin';
import SidePanePlugin from './SidePanePlugin';
import SnapshotPlugin from './sidePane/snapshot/SnapshotPlugin';
import TableOptionsPlugin from './sidePane/tableOptions/TableOptionsPlugin';
import { EditorPlugin } from 'roosterjs-editor-core';

export default interface Plugins {
    ribbon: RibbonPlugin;
    formatState: FormatStatePlugin;
    snapshot: SnapshotPlugin;
    editorOptions: EditorOptionsPlugin;
    tableOptions: TableOptionsPlugin;
    pasteResult: PasteResultPlugin;
    eventView: EventViewPlugin;
}

let plugins: Plugins = null;

export function getPlugins(): Plugins {
    if (!plugins) {
        plugins = {
            ribbon: new RibbonPlugin(),
            formatState: new FormatStatePlugin(),
            snapshot: new SnapshotPlugin(),
            editorOptions: new EditorOptionsPlugin(),
            tableOptions: new TableOptionsPlugin(),
            pasteResult: new PasteResultPlugin(),
            eventView: new EventViewPlugin(),
        };
    }
    return plugins;
}

export function getAllPluginArray(): EditorPlugin[] {
    let allPlugins = getPlugins();
    return [
        allPlugins.ribbon,
        allPlugins.formatState,
        allPlugins.editorOptions,
        allPlugins.snapshot,
        allPlugins.tableOptions,
        allPlugins.pasteResult,
        allPlugins.eventView,
    ];
}

export function getSidePanePluginArray(): SidePanePlugin[] {
    let allPlugins = getPlugins();
    return [
        allPlugins.formatState,
        allPlugins.editorOptions,
        allPlugins.snapshot,
        allPlugins.tableOptions,
        allPlugins.pasteResult,
        allPlugins.eventView,
    ];
}
