import * as React from 'react';
import { convertMarkdownToContentModel } from 'roosterjs-content-model-api';
import { createBr, createParagraph, createSelectionMarker } from 'roosterjs-content-model-dom';
import { PlainTextPaneProps } from './PlainTextPlugin';

const styles = require('./PlainTextPane.scss');

export default class PlainTextPane extends React.Component<PlainTextPaneProps> {
    private html = React.createRef<HTMLTextAreaElement>();

    constructor(props: PlainTextPaneProps) {
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

    render() {
        return (
            <div className={styles.container}>
                <p>Convert plain text to content model</p>
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
                </div>
            </div>
        );
    }
}
