import type { EditorPlugin } from 'roosterjs-content-model-types';

export interface SidePanePlugin extends EditorPlugin {
    getTitle: () => string;
    renderSidePane: (updateHash: (pluginName?: string, path?: string[]) => void) => JSX.Element;
    setHashPath?: (path: string[]) => void;
}
