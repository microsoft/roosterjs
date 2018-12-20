import { EditorPlugin } from 'roosterjs-editor-core';

export default interface SidePanePlugin extends EditorPlugin {
    getTitle: () => string;
    renderSidePane: () => JSX.Element;
}
