import * as React from 'react';
import SidePanePlugin from '../SidePanePlugin';
import { Editor } from 'roosterjs-editor-core';

export default abstract class SidePanePluginImpl<T extends React.Component<P, any>, P>
    implements SidePanePlugin {
    protected editor: Editor;
    private component = React.createRef<T>();

    constructor(
        private readonly componentCtor: { new (props: P): T },
        private readonly title: string,
    ) {}

    initialize(editor: Editor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    getTitle() {
        return this.title;
    }

    renderSidePane() {
        return <this.componentCtor ref={this.component} {...this.getComponentProps()} />;
    }

    protected abstract getComponentProps(): P;

    protected getComponent(callback: (component: T) => void) {
        if (this.component.current) {
            callback(this.component.current);
        }
    }
}
