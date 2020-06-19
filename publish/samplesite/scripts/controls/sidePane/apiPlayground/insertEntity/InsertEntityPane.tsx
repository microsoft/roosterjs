import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import { fromHtml, wrap } from 'roosterjs-editor-dom';
import { insertEntity } from 'roosterjs-editor-core';

const styles = require('./InsertEntityPane.scss');

export default class InsertEntityPane extends React.Component<ApiPaneProps, {}> {
    private entityType = React.createRef<HTMLInputElement>();
    private html = React.createRef<HTMLTextAreaElement>();
    private styleInline = React.createRef<HTMLInputElement>();
    private styleBlock = React.createRef<HTMLInputElement>();
    private isReadonly = React.createRef<HTMLInputElement>();

    render() {
        return (
            <>
                <div>
                    Type: <input type="input" ref={this.entityType} />
                </div>
                <div>
                    HTML: <textarea className={styles.textarea} ref={this.html}></textarea>
                </div>
                <div>
                    Style:
                    <input
                        type="radio"
                        name="entityStyle"
                        ref={this.styleInline}
                        id="styleInline"
                    />
                    <label htmlFor="styleInline">Inline</label>{' '}
                    <input type="radio" name="entityStyle" ref={this.styleBlock} id="styleBlock" />
                    <label htmlFor="styleBlock">Block</label>
                </div>
                <div>
                    Readonly: <input type="checkbox" ref={this.isReadonly} />
                </div>
                <div>
                    <button onClick={this.insertEntity}>Insert Entity</button>
                </div>
            </>
        );
    }

    private insertEntity = () => {
        const entityType = this.entityType.current.value;
        const nodes = fromHtml(this.html.current.value, document);
        const node = nodes.length > 0 ? wrap(nodes, 'SPAN') : nodes[0];
        const isBlock = this.styleBlock.current.checked;
        const isReadonly = this.isReadonly.current.checked;

        if (node) {
            insertEntity(this.props.getEditor(), entityType, node, isBlock, isReadonly);
        }
    };
}
