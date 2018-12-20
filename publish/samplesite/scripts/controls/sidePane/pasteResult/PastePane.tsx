import * as React from 'react';
import { ClipboardData } from 'roosterjs-editor-types';

const styles = require('./PastePane.scss');

export interface PastePaneState {
    clipboard: ClipboardData;
}

export default class PastePane extends React.Component<{}, PastePaneState> {
    private image = React.createRef<HTMLImageElement>();

    constructor(props: {}) {
        super(props);
        this.state = {
            clipboard: null,
        };
    }

    render() {
        let clipboard = this.state.clipboard;
        return clipboard ? (
            <>
                {this.renderPasteContent('Palin text', clipboard.text)}
                {this.renderPasteContent('Sanitized HTML', clipboard.html)}
                {this.renderPasteContent('Original HTML', clipboard.rawHtml)}
                {this.renderPasteContent('Image', clipboard.image, img => (
                    <img ref={this.image} className={styles.img} />
                ))}
            </>
        ) : (
            <div>No paste event detected</div>
        );
    }

    componentDidUpdate() {
        if (this.state.clipboard && this.state.clipboard.image) {
            let reader = new FileReader();
            reader.onload = this.onLoadImage;
            reader.readAsDataURL(this.state.clipboard.image);
        }
    }

    setClipboardData(clipboard: ClipboardData) {
        this.setState({
            clipboard: clipboard,
        });
    }

    private onLoadImage = (e: ProgressEvent) => {
        if (this.image && this.image.current) {
            this.image.current.src = (event.target as FileReader).result as string;
        }
    };

    private renderPasteContent(
        title: string,
        content: any,
        renderer: (content: any) => JSX.Element = content => <span>{content}</span>,
    ): JSX.Element {
        return (
            content && (
                <details>
                    <summary>
                        <b>{title}</b>
                    </summary>
                    <div className={styles.pasteContent}>{renderer(content)}</div>
                </details>
            )
        );
    }
}
