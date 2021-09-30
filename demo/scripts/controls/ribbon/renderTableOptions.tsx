import * as React from 'react';
import { IEditor } from 'roosterjs-editor-types';
import { insertTable } from 'roosterjs-editor-api';

const styles = require('./TableOptions.scss');

interface TableOptionsProps {
    editor: IEditor;
    onDismiss: () => void;
}

class TableOptions extends React.Component<TableOptionsProps, {}> {
    private cols = React.createRef<HTMLInputElement>();
    private rows = React.createRef<HTMLInputElement>();

    render() {
        return (
            <div className={styles.editTable}>
                <div className={styles.close}>
                    <button onClick={this.props.onDismiss}>X</button>
                </div>
                <table>
                    <tbody>
                        <tr>
                            <th colSpan={2}>Insert Table</th>
                        </tr>
                        <tr>
                            <td>Columns:</td>
                            <td>
                                <input type="text" ref={this.cols} />
                            </td>
                        </tr>
                        <tr>
                            <td>Rows:</td>
                            <td>
                                <input type="text" ref={this.rows} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} className={styles.buttonRow}>
                                <button onClick={this.onInsertTable} className={styles.button}>
                                    Insert
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    private onInsertTable = () => {
        this.props.onDismiss();

        let cols = parseInt(this.cols.current.value);
        let rows = parseInt(this.rows.current.value);
        if (cols > 0 && cols <= 10 && rows > 0 && rows <= 10) {
            insertTable(this.props.editor, cols, rows);
        }
    };
}

export default function renderTableOptions(editor: IEditor, onDismiss: () => void) {
    return <TableOptions editor={editor} onDismiss={onDismiss} />;
}
