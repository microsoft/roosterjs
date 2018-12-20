import * as React from 'react';
import { HtmlSanitizer } from 'roosterjs-html-sanitizer';

const styles = require('./SanitizerPane.scss');

export default class SanitizerPane extends React.Component<{}, {}> {
    private source = React.createRef<HTMLTextAreaElement>();
    private result = React.createRef<HTMLTextAreaElement>();

    render() {
        return (
            <>
                <h3>Input</h3>
                <textarea className={styles.textarea} ref={this.source} />
                <button className={styles.button} onClick={this.sanitize}>
                    Sanitize
                </button>
                <h3>Result</h3>
                <textarea className={styles.textarea} ref={this.result} />
            </>
        );
    }

    private sanitize = () => {
        this.result.current.value = HtmlSanitizer.sanitizeHtml(this.source.current.value);
    };
}
