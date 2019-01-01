import BlockElementsPlugin from './sidePane/blockElements/BlockElementsPlugin';
import EditorOptionsPlugin from './sidePane/editorOptions/EditorOptionsPlugin';
import EventViewPlugin from './sidePane/eventViewer/EventViewPlugin';
import FormatStatePlugin from './sidePane/formatState/FormatStatePlugin';
import RibbonPlugin from './ribbon/RibbonPlugin';
import SanitizerPlugin from './sidePane/sanitizer/SanitizerPlugin';
import SidePanePlugin from './SidePanePlugin';
import SnapshotPlugin from './sidePane/snapshot/SnapshotPlugin';
import { EditorPlugin } from 'roosterjs-editor-core';

export default interface Plugins {
    ribbon: RibbonPlugin;
    formatState: FormatStatePlugin;
    snapshot: SnapshotPlugin;
    editorOptions: EditorOptionsPlugin;
    eventView: EventViewPlugin;
    blocks: BlockElementsPlugin;
    sanitizer: SanitizerPlugin;
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
            blocks: new BlockElementsPlugin(),
            sanitizer: new SanitizerPlugin(),
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
        allPlugins.eventView,
        allPlugins.blocks,
        allPlugins.sanitizer,
    ];
}

export function getSidePanePluginArray(): SidePanePlugin[] {
    let allPlugins = getPlugins();
    return [
        allPlugins.formatState,
        allPlugins.editorOptions,
        allPlugins.snapshot,
        allPlugins.eventView,
        allPlugins.blocks,
        allPlugins.sanitizer,
    ];
}
