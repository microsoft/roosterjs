import * as React from 'react';
import BuildInPluginState, { UrlPlaceholder } from '../BuildInPluginState';
import ResetListPlugin from '../contextMenu/ResetListPlugin';
import RotateImagePlugin from '../contextMenu/RotateImagePlugin';
import SampleColorPickerPluginDataProvider from '../samplepicker/SampleColorPickerPluginDataProvider';
import { ContentEdit } from 'roosterjs-editor-plugins/lib/ContentEdit';
import { CONTEXT_MENU_DATA_PROVIDER } from '../contextMenu/ContextMenuProvider';
import { ContextMenu } from 'roosterjs-editor-plugins/lib/ContextMenu';
import { CustomReplace as CustomReplacePlugin } from 'roosterjs-editor-plugins/lib/CustomReplace';
import { CutPasteListChain } from 'roosterjs-editor-plugins/lib/CutPasteListChain';
import { Editor as RoosterJsEditor } from 'roosterjs-editor-core';
import { EditorInstanceToggleablePlugins } from './EditorInstanceToggleablePlugins';
import { EditorOptions, EditorPlugin, UndoSnapshotsService } from 'roosterjs-editor-types';
import { HyperLink } from 'roosterjs-editor-plugins/lib/HyperLink';
import { ImageResize } from 'roosterjs-editor-plugins/lib/ImageResize';
import { Paste } from 'roosterjs-editor-plugins/lib/Paste';
import { PickerPlugin } from 'roosterjs-editor-plugins/lib/Picker';
import { TableResize } from 'roosterjs-editor-plugins/lib/TableResize';
import { Watermark } from 'roosterjs-editor-plugins/lib/Watermark';

const styles = require('./Editor.scss');

export interface EditorProps {
    plugins: EditorPlugin[];
    initState: BuildInPluginState;
    content: string;
    snapshotService: UndoSnapshotsService;
    className?: string;
}

let editorInstanceToggleablePlugins: EditorInstanceToggleablePlugins | null = null;

export default class Editor extends React.Component<EditorProps, BuildInPluginState> {
    private contentDiv: HTMLDivElement;
    private editor: RoosterJsEditor;

    constructor(props: EditorProps) {
        super(props);
        this.state = props.initState;
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className={styles.editor} ref={ref => (this.contentDiv = ref)} />
            </div>
        );
    }

    componentWillUpdate() {
        this.disposeEditor();
    }

    componentDidUpdate() {
        this.initEditor();
    }

    componentDidMount() {
        this.initEditor();
    }

    componentWillUnmount() {
        this.disposeEditor();
    }

    resetEditorPlugin(pluginState: BuildInPluginState) {
        this.setState(pluginState);
    }

    getContent() {
        return this.editor.getContent();
    }

    private initEditor() {
        let pluginList = this.state.pluginList;
        editorInstanceToggleablePlugins = {
            contentEdit: pluginList.contentEdit
                ? new ContentEdit(this.state.contentEditFeatures)
                : null,
            hyperlink: pluginList.hyperlink ? new HyperLink(this.getLinkCallback()) : null,
            paste: pluginList.paste ? new Paste() : null,
            watermark: pluginList.watermark ? new Watermark(this.state.watermarkText) : null,
            imageResize: pluginList.imageResize
                ? new ImageResize(10, 10, undefined, this.state.forcePreserveRatio)
                : null,
            cutPasteListChain: pluginList.cutPasteListChain ? new CutPasteListChain() : null,
            tableResize: pluginList.tableResize ? new TableResize() : null,
            pickerPlugin: pluginList.pickerPlugin
                ? new PickerPlugin(new SampleColorPickerPluginDataProvider(), {
                      elementIdPrefix: 'samplepicker-',
                      changeSource: 'SAMPLE_COLOR_PICKER',
                      triggerCharacter: ':',
                      isHorizontal: true,
                  })
                : null,
            customReplace: pluginList.customReplace ? new CustomReplacePlugin() : null,
            resetList: pluginList.contextMenu ? new ResetListPlugin() : null,
            rotateImage: pluginList.contextMenu ? new RotateImagePlugin() : null,
            contextMenu: pluginList.contextMenu
                ? new ContextMenu(CONTEXT_MENU_DATA_PROVIDER)
                : null,
        };
        let plugins = [
            ...Object.keys(editorInstanceToggleablePlugins).map(
                (k: keyof EditorInstanceToggleablePlugins) => editorInstanceToggleablePlugins[k]
            ),
            ...this.props.plugins,
        ];
        let defaultFormat = { ...this.state.defaultFormat };
        let options: EditorOptions = {
            plugins: plugins,
            defaultFormat: defaultFormat,
            initialContent: this.props.content,
            experimentalFeatures: this.state.experimentalFeatures,
            undoSnapshotService: this.props.snapshotService,
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
}
