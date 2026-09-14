import * as React from 'react';
import {
    createEmptyModel,
    createFormatContainer,
    createParagraph,
    createText,
} from 'roosterjs-content-model-dom';
import type { TextUtilitiesPaneProps } from './TextUtilitiesPanePlugin';

const styles = require('./TextUtilitiesPane.scss');

interface TextUtilitiesPaneState {
    errorMessage: string;
}

export default class TextUtilitiesPane extends React.Component<
    TextUtilitiesPaneProps,
    TextUtilitiesPaneState
> {
    private text = React.createRef<HTMLTextAreaElement>();

    constructor(props: TextUtilitiesPaneProps) {
        super(props);
        this.state = { errorMessage: '' };
    }

    private beautifyJson = () => {
        this.applyTransformation(
            value => JSON.stringify(JSON.parse(value), null, 2),
            'Invalid JSON'
        );
    };

    private encodeUriComponent = () => {
        this.applyTransformation(
            value => encodeURIComponent(value),
            'Unable to encode URI component'
        );
    };

    private decodeUriComponent = () => {
        this.applyTransformation(value => decodeURIComponent(value), 'Invalid URI component');
    };

    private encodeBase64 = () => {
        this.applyTransformation(value => encodeTextToBase64(value), 'Unable to encode Base64');
    };

    private decodeBase64 = () => {
        this.applyTransformation(value => decodeBase64ToText(value), 'Invalid Base64');
    };

    private applyTransformation = (transform: (value: string) => string, fallbackError: string) => {
        let result: string;

        try {
            result = transform(this.text.current.value);
        } catch (error) {
            this.setState({
                errorMessage: error instanceof Error ? error.message : fallbackError,
            });
            return;
        }

        this.setEditorText(result);
    };

    private setEditorText = (text: string) => {
        const container = createFormatContainer('pre');
        const paragraph = createParagraph(true);

        paragraph.segments.push(createText(text));
        container.blocks.push(paragraph);
        this.props.getEditor().formatContentModel(model => {
            model.blocks = [container];
            return true;
        });
        this.setState({ errorMessage: '' });
    };

    private clear = () => {
        this.text.current.value = '';
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
                <p>Enter text to transform and display in the editor.</p>
                <textarea className={styles.textArea} title="Text input" ref={this.text} />
                {this.state.errorMessage ? (
                    <div className={styles.errorMessage} role="alert">
                        {this.state.errorMessage}
                    </div>
                ) : null}
                <div className={styles.buttons}>
                    <button type="button" onClick={this.beautifyJson}>
                        Beautify JSON
                    </button>
                    <button type="button" onClick={this.encodeUriComponent}>
                        Encode URI component
                    </button>
                    <button type="button" onClick={this.decodeUriComponent}>
                        Decode URI component
                    </button>
                    <button type="button" onClick={this.encodeBase64}>
                        Encode as Base64
                    </button>
                    <button type="button" onClick={this.decodeBase64}>
                        Decode from Base64
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

function encodeTextToBase64(value: string): string {
    const encodedValue = encodeURIComponent(value);
    let binaryValue = '';

    for (let i = 0; i < encodedValue.length; i++) {
        if (encodedValue[i] == '%') {
            binaryValue += String.fromCharCode(parseInt(encodedValue.substr(i + 1, 2), 16));
            i += 2;
        } else {
            binaryValue += encodedValue[i];
        }
    }

    return btoa(binaryValue);
}

function decodeBase64ToText(value: string): string {
    const binaryValue = atob(value);
    let encodedValue = '';

    for (let i = 0; i < binaryValue.length; i++) {
        encodedValue += '%' + ('0' + binaryValue.charCodeAt(i).toString(16)).slice(-2);
    }

    return decodeURIComponent(encodedValue);
}
