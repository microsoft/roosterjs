import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import { ContentPosition, InsertOptionBasic } from 'roosterjs-editor-types';

const styles = require('./InsertContentPane.scss');

export interface InsertContentPaneState {
    content: string;
    position: ContentPosition;
    updateCursor: boolean;
    replaceSelection: boolean;
    insertOnNewLine: boolean;
}

export default class InsertContentPane extends React.Component<
    ApiPaneProps,
    InsertContentPaneState
> {
    private html = React.createRef<HTMLTextAreaElement>();

    constructor(props: ApiPaneProps) {
        super(props);
        this.state = {
            content: '',
            position: ContentPosition.SelectionStart,
            updateCursor: true,
            replaceSelection: true,
            insertOnNewLine: false,
        };
    }

    render() {
        return (
            <table>
                <tr>
                    <td>HTML Content</td>
                    <td>
                        <textarea
                            className={styles.text}
                            ref={this.html}
                            value={this.state.content}
                            onChange={() => this.setState({ content: this.html.current.value })}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Insert at</td>
                    <td>
                        <div>
                            <input
                                type="radio"
                                name="position"
                                checked={this.state.position == ContentPosition.Begin}
                                id="insertBegin"
                                onClick={() => this.setPosition(ContentPosition.Begin)}
                            />
                            <label htmlFor="insertBegin">Begin</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="position"
                                checked={this.state.position == ContentPosition.End}
                                id="insertEnd"
                                onClick={() => this.setPosition(ContentPosition.End)}
                            />
                            <label htmlFor="insertEnd">End</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="position"
                                checked={this.state.position == ContentPosition.SelectionStart}
                                id="insertSelectionStart"
                                onClick={() => this.setPosition(ContentPosition.SelectionStart)}
                            />
                            <label htmlFor="insertSelectionStart">SelectionStart</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="position"
                                checked={this.state.position == ContentPosition.Outside}
                                id="insertOutside"
                                onClick={() => this.setPosition(ContentPosition.Outside)}
                            />
                            <label htmlFor="insertOutside">Outside</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Cursor option</td>
                    <td>
                        <input
                            type="checkbox"
                            id="insertUpdateCursor"
                            checked={this.state.updateCursor}
                            onClick={() =>
                                this.setState({ updateCursor: !this.state.updateCursor })
                            }
                        />
                        <label htmlFor="insertUpdateCursor">Update cursor</label>
                    </td>
                </tr>
                <tr>
                    <td>Replace option</td>
                    <td>
                        <input
                            type="checkbox"
                            id="insertReplaceSelection"
                            checked={this.state.replaceSelection}
                            onClick={() =>
                                this.setState({ replaceSelection: !this.state.replaceSelection })
                            }
                        />
                        <label htmlFor="insertReplaceSelection">Replace selection</label>
                    </td>
                </tr>
                <tr>
                    <td>New line option</td>
                    <td>
                        <input
                            type="checkbox"
                            id="insertOnNewLine"
                            checked={this.state.insertOnNewLine}
                            onClick={() =>
                                this.setState({ insertOnNewLine: !this.state.insertOnNewLine })
                            }
                        />
                        <label htmlFor="insertOnNewLine">Insert on new line</label>
                    </td>
                </tr>
                <tr>
                    <td colSpan={2} className={styles.buttonRow}>
                        <button onClick={this.onClick}>Insert Content</button>
                    </td>
                </tr>
            </table>
        );
    }

    private setPosition(position: ContentPosition) {
        this.setState({
            position: position,
        });
    }

    private onClick = () => {
        let editor = this.props.getEditor();
        if (this.state.position != ContentPosition.Range) {
            const inputOption: InsertOptionBasic = {
                position: this.state.position,
                updateCursor: this.state.updateCursor,
                replaceSelection: this.state.replaceSelection,
                insertOnNewLine: this.state.insertOnNewLine,
            };
            editor.addUndoSnapshot(() => editor.insertContent(this.state.content, inputOption));
        }
    };
}
