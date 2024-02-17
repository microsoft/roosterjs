import * as React from 'react';
import { IStandaloneEditor } from 'roosterjs-content-model-types';
import { SidePaneElement, SidePaneElementProps } from './SidePaneElement';
import { SidePanePlugin } from './SidePanePlugin';

interface SidePaneComponent<P extends SidePaneElementProps>
    extends React.Component<P, any>,
        SidePaneElement {}

export abstract class SidePanePluginImpl<
    T extends SidePaneComponent<P>,
    P extends SidePaneElementProps
> implements SidePanePlugin {
    protected editor: IStandaloneEditor;
    private component = React.createRef<T>();

    constructor(
        private readonly componentCtor: { new (props: P): T },
        private readonly pluginName: string,
        private readonly title: string
    ) {}

    getName() {
        return this.pluginName;
    }

    initialize(editor: IStandaloneEditor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    getTitle() {
        return this.title;
    }

    renderSidePane(updateHash: (pluginName?: string, path?: string[]) => void) {
        return React.createElement<P>(this.componentCtor, {
            ...this.getComponentProps({
                updateHash,
            }),
            ref: this.component,
        });
    }

    setHashPath(path: string[]) {
        if (this.component.current && this.component.current.setHashPath) {
            this.component.current.setHashPath(path);
        }
    }

    protected abstract getComponentProps(baseProps: SidePaneElementProps): P;

    protected getComponent(callback: (component: T) => void) {
        if (this.component.current) {
            callback(this.component.current);
        }
    }
}
