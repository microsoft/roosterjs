import * as React from 'react';
import { createBr, createParagraph, createSelectionMarker } from 'roosterjs-content-model-dom';
import { MarkdownPaneProps } from './MarkdownPanePlugin';
import {
    convertMarkdownToContentModel,
    exportEditorSelectionToMarkdown,
} from 'roosterjs-content-model-markdown';

const styles = require('./MarkdownPane.scss');

export default class MarkdownPane extends React.Component<MarkdownPaneProps> {
    private html = React.createRef<HTMLTextAreaElement>();

    constructor(props: MarkdownPaneProps) {
        super(props);
    }

    private convert = () => {
        const editor = this.props.getEditor();
        convertMarkdownToContentModel(editor, this.html.current.value);
    };

    private clear = () => {
        this.html.current.value = '';
    };

    private clearEditor = () => {
        const editor = this.props.getEditor();
        editor.formatContentModel(model => {
            model.blocks = [];
            const emptyParagraph = createParagraph();
            const marker = createSelectionMarker();
            const br = createBr();
            emptyParagraph.segments.push(marker);
            emptyParagraph.segments.push(br);
            model.blocks.push(emptyParagraph);
            return true;
        });
    };

    private generateMarkdown = () => {
        const selection = this.props.getEditor().getDOMSelection();
        if (selection && !(selection.type == 'range' && selection.range.collapsed)) {
            const content = exportEditorSelectionToMarkdown(selection);
            this.html.current.value = content;
        }
    };

    render() {
        return (
            <div className={styles.container}>
                <p>Convert Markdown to content model</p>
                <textarea
                    className={styles.textArea}
                    title="Plain Text Editor"
                    ref={this.html}></textarea>
                <div>
                    <button type="button" onClick={this.clear}>
                        Clear
                    </button>
                    <button type="button" onClick={this.clearEditor}>
                        Clear editor
                    </button>
                    <button type="button" onClick={this.convert}>
                        Convert
                    </button>
                    <button type="button" onClick={this.generateMarkdown}>
                        Create Markdown from editor content
                    </button>
                </div>
            </div>
        );
    }
}
