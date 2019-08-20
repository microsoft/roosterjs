import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import { HtmlSanitizer } from 'roosterjs-html-sanitizer';

const styles = require('./SanitizerPane.scss');

export default class SanitizerPane extends React.Component<ApiPaneProps, {}> {
    private source = React.createRef<HTMLTextAreaElement>();
    private result = React.createRef<HTMLTextAreaElement>();
    private sanitizer = new HtmlSanitizer();

    render() {
        return (
            <>
                <h3>Input</h3>
                <textarea className={styles.textarea} ref={this.source} />
                <div>
                    <button className={styles.button} onClick={this.inline}>
                        Inline CSS
                    </button>
                    <button className={styles.button} onClick={this.sanitize}>
                        Sanitize
                    </button>
                </div>
                <h3>Result</h3>
                <textarea className={styles.textarea} ref={this.result} />
            </>
        );
    }

    private inline = () => {
        this.result.current.value = this.sanitizer.exec(this.source.current.value, true);
    };

    private sanitize = () => {
        this.result.current.value = HtmlSanitizer.sanitizeHtml(this.source.current.value);
    };
}
