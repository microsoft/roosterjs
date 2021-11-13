import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import { HtmlSanitizer } from 'roosterjs-editor-dom';
import { trustedHTMLHandler } from '../../../../utils/trustedHTMLHandler';

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
        const doc = this.getDOMDocument();

        if (doc?.body) {
            this.sanitizer.convertGlobalCssToInlineCss(doc);
            this.result.current.value = doc.body.innerHTML;
        }
    };

    private sanitize = () => {
        const doc = this.getDOMDocument();

        if (doc?.body) {
            this.sanitizer.sanitize(doc.body.firstChild);
            this.result.current.value = doc.body.innerHTML;
        }
    };

    private getDOMDocument(): Document {
        const parser = new DOMParser();
        const html = trustedHTMLHandler(this.source.current.value) || '';
        const doc = parser.parseFromString(html, 'text/html');
        return doc;
    }
}
