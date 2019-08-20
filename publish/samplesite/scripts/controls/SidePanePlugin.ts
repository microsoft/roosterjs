import { EditorPlugin } from 'roosterjs-editor-core';

export default interface SidePanePlugin extends EditorPlugin {
    getTitle: () => string;
    renderSidePane: (updateHash: (pluginName?: string, path?: string[]) => void) => JSX.Element;
    setHashPath?: (path: string[]) => void;
}
