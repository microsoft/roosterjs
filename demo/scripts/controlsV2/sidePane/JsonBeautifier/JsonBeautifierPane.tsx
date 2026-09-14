import * as React from 'react';
import {
    createEmptyModel,
    createFormatContainer,
    createParagraph,
    createText,
} from 'roosterjs-content-model-dom';
import type { JsonBeautifierPaneProps } from './JsonBeautifierPanePlugin';

const styles = require('./JsonBeautifierPane.scss');

interface JsonBeautifierPaneState {
    errorMessage: string;
}

export default class JsonBeautifierPane extends React.Component<
    JsonBeautifierPaneProps,
    JsonBeautifierPaneState
> {
    private json = React.createRef<HTMLTextAreaElement>();

    constructor(props: JsonBeautifierPaneProps) {
        super(props);
        this.state = { errorMessage: '' };
    }

    private beautify = () => {
        let formattedJson: string;

        try {
            formattedJson = JSON.stringify(JSON.parse(this.json.current.value), null, 2);
        } catch (error) {
            this.setState({
                errorMessage: error instanceof Error ? error.message : 'Invalid JSON',
            });
            return;
        }

        const container = createFormatContainer('pre');
        const paragraph = createParagraph(true);

        paragraph.segments.push(createText(formattedJson));
        container.blocks.push(paragraph);
        this.props.getEditor().formatContentModel(model => {
            model.blocks = [container];
            return true;
        });
        this.setState({ errorMessage: '' });
    };

    private clear = () => {
        this.json.current.value = '';
        this.setState({ errorMessage: '' });
    };

    private clearEditor = () => {
        const editor = this.props.getEditor();
        editor.formatContentModel(model => {
            model.blocks = createEmptyModel().blocks;
            return true;
        });
    };

    render() {
        return (
            <div className={styles.container}>
                <p>Enter JSON to format and display in the editor.</p>
                <textarea className={styles.textArea} title="JSON input" ref={this.json} />
                {this.state.errorMessage ? (
                    <div className={styles.errorMessage} role="alert">
                        {this.state.errorMessage}
                    </div>
                ) : null}
                <div>
                    <button type="button" onClick={this.beautify}>
                        Beautify
                    </button>
                    <button type="button" onClick={this.clear}>
                        Clear
                    </button>
                    <button type="button" onClick={this.clearEditor}>
                        Clear editor
                    </button>
                </div>
            </div>
        );
    }
}
