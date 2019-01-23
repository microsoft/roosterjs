import * as React from 'react';
import BuildInPluginState, { UrlPlaceholder } from '../BuildInPluginState';
import { ImageResize } from 'roosterjs-plugin-image-resize';
import {
    Editor as RoosterJsEditor,
    EditorOptions,
    EditorPlugin,
    UndoService,
} from 'roosterjs-editor-core';

import {
    HyperLink,
    Paste,
    ContentEdit,
    Watermark,
    TableResize,
    ContentEditFeatures,
    getDefaultContentEditFeatures,
} from 'roosterjs-editor-plugins';

const styles = require('./Editor.scss');
const assign = require('object-assign');

export interface EditorProps {
    plugins: EditorPlugin[];
    initState: BuildInPluginState;
    className?: string;
    undo?: UndoService;
}

let editorInstance: RoosterJsEditor | null = null;

export default class Editor extends React.Component<EditorProps, BuildInPluginState> {
    private contentDiv: HTMLDivElement;
    private editor: RoosterJsEditor;

    constructor(props: EditorProps) {
        super(props);
        this.state = props.initState;
    }

    render() {
        let className = (this.props.className || '') + ' ' + styles.editor;
        return <div className={className} ref={ref => (this.contentDiv = ref)} />;
    }

    componentWillUpdate() {
        this.disposeEditor();
    }

    componentDidUpdate() {
        this.initEditor();
    }

    componentDidMount() {
        this.initEditor();
        if (editorInstance == null) editorInstance = this.editor;
    }

    componentWillUnmount() {
        if (editorInstance == this.editor) editorInstance = null;
        this.disposeEditor();
    }

    resetEditorPlugin(pluginState: BuildInPluginState) {
        this.setState(pluginState);
    }

    private initEditor() {
        let pluginList = this.state.pluginList;
        let plugins = [
            pluginList.hyperlink ? new HyperLink(this.getLinkCallback()) : null,
            pluginList.paste ? new Paste() : null,
            pluginList.contentEdit ? new ContentEdit(this.getContentEditOptions()) : null,
            pluginList.watermark ? new Watermark(this.state.watermarkText) : null,
            pluginList.imageResize ? new ImageResize() : null,
            pluginList.tableResize ? new TableResize() : null,
            ...this.props.plugins,
        ];
        let defaultFormat = { ...this.state.defaultFormat };
        let options: EditorOptions = {
            plugins: plugins,
            defaultFormat: defaultFormat,
            undo: this.props.undo,
        };
        this.editor = new RoosterJsEditor(this.contentDiv, options);
    }

    private disposeEditor() {
        this.editor.dispose();
        this.editor = null;
    }

    private getLinkCallback(): (url: string) => string {
        let linkCallback: (url: string) => string;
        let linkTitle = this.state.linkTitle;

        if (linkTitle) {
            let index = linkTitle.indexOf(UrlPlaceholder);
            if (index >= 0) {
                let left = linkTitle.substr(0, index);
                let right = linkTitle.substr(index + UrlPlaceholder.length);
                linkCallback = url => left + url + right;
            } else {
                linkCallback = () => linkTitle;
            }
        } else {
            linkCallback = null;
        }

        return linkCallback;
    }

    private getContentEditOptions(): ContentEditFeatures {
        let defaultFeatures = getDefaultContentEditFeatures();
        return assign(defaultFeatures, this.state.contentEditFeatures);
    }
}

// expose the active editor the global window for integration tests
Object.defineProperty(window, 'globalRoosterEditor', {
    get: () => editorInstance
});
