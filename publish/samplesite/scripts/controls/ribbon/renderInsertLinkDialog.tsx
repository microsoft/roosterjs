import * as React from 'react';
import { createLink } from 'roosterjs-editor-api';
import { Editor } from 'roosterjs-editor-core';

const styles = require('./InsertLink.scss');

interface InsertLinkProps {
    editor: Editor;
    onDismiss: () => void;
    url: string;
    displayText: string;
}

class InsertLink extends React.Component<InsertLinkProps, {}> {
    private txtUrl: HTMLInputElement;
    private txtDisplayText: HTMLInputElement;

    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <td className={styles.title}>Url:</td>
                        <td>
                            <input type={'text'} ref={ref => (this.txtUrl = ref)} />
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.title}>Display text:</td>
                        <td>
                            <input type={'text'} ref={ref => (this.txtDisplayText = ref)} />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={styles.buttonRow}>
                            <button className={styles.button} onClick={this.onOk}>
                                OK
                            </button>
                            <button className={styles.button} onClick={this.props.onDismiss}>
                                Cancel
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    componentDidMount() {
        this.txtUrl.value = this.props.url;
        this.txtDisplayText.value = this.props.displayText;
    }

    private onOk = () => {
        this.props.onDismiss();
        createLink(this.props.editor, this.txtUrl.value, null, this.txtDisplayText.value);
    };
}

export default function renderInsertLinkDialog(editor: Editor, onDismiss: () => void) {
    let a = editor.getElementAtCursor('a[href]') as HTMLAnchorElement;
    return (
        <InsertLink
            editor={editor}
            onDismiss={onDismiss}
            url={a ? a.href : ''}
            displayText={a ? a.innerText : ''}
        />
    );
}
