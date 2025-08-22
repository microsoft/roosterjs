import * as React from 'react';
import { createBr, createParagraph, createSelectionMarker } from 'roosterjs-content-model-dom';
import { MarkdownPaneProps } from './MarkdownPanePlugin';
import {
    convertMarkdownToContentModel,
    convertContentModelToMarkdown,
} from 'roosterjs-content-model-markdown';

const styles = require('./MarkdownPane.scss');

export default class MarkdownPane extends React.Component<
    MarkdownPaneProps,
    { emptyLine: 'preserve' | 'remove' | 'merge' }
> {
    private html = React.createRef<HTMLTextAreaElement>();
    private emptyLinePreserve = React.createRef<HTMLInputElement>();
    private emptyLineRemove = React.createRef<HTMLInputElement>();
    private emptyLineMerge = React.createRef<HTMLInputElement>();

    constructor(props: MarkdownPaneProps) {
        super(props);

        this.state = { emptyLine: 'merge' };
    }

    private convert = () => {
        const editor = this.props.getEditor();
        editor.formatContentModel((model, context) => {
            const markdownModel = convertMarkdownToContentModel(this.html.current.value, {
                emptyLine: this.emptyLinePreserve.current.checked
                    ? 'preserve'
                    : this.emptyLineRemove.current.checked
                    ? 'remove'
                    : 'merge',
            });

            model.blocks = markdownModel.blocks;
            return true;
        });
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
        const model = this.props.getEditor().getContentModelCopy('disconnected');
        if (model) {
            const content = convertContentModelToMarkdown(model);
            this.html.current.value = content;
        }
    };

    private onEmptyLineChange = (e: React.MouseEvent<HTMLInputElement>) => {
        switch (e.currentTarget.value) {
            case 'preserve':
                this.setState({ emptyLine: 'preserve' });
                break;
            case 'remove':
                this.setState({ emptyLine: 'remove' });
                break;
            case 'merge':
                this.setState({ emptyLine: 'merge' });
                break;
        }
    };

    render() {
        return (
            <div className={styles.container}>
                <p>Convert Markdown to content model</p>
                <div>
                    Empty line:
                    <input
                        type="radio"
                        name="emptyLine"
                        id="emptyLinePreserve"
                        value="preserve"
                        checked={this.state.emptyLine == 'preserve'}
                        ref={this.emptyLinePreserve}
                        onClick={this.onEmptyLineChange}
                    />{' '}
                    <label htmlFor="emptyLinePreserve">Preserve</label>
                    <input
                        type="radio"
                        name="emptyLine"
                        id="emptyLineRemove"
                        value="remove"
                        checked={this.state.emptyLine == 'remove'}
                        ref={this.emptyLineRemove}
                        onClick={this.onEmptyLineChange}
                    />{' '}
                    <label htmlFor="emptyLineRemove">Remove</label>
                    <input
                        type="radio"
                        name="emptyLine"
                        id="emptyLineMerge"
                        value="merge"
                        checked={this.state.emptyLine == 'merge'}
                        ref={this.emptyLineMerge}
                        onClick={this.onEmptyLineChange}
                    />{' '}
                    <label htmlFor="emptyLineMerge">Merge</label>
                </div>
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
