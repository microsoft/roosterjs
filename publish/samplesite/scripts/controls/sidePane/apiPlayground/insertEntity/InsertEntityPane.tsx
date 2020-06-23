import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import { Entity } from 'roosterjs-editor-types';
import { fromHtml, wrap } from 'roosterjs-editor-dom';
import { getEntities, insertEntity } from 'roosterjs-editor-plugins/lib/Entity';

const styles = require('./InsertEntityPane.scss');

interface InsertEntityPaneState {
    entities: Entity[];
}

export default class InsertEntityPane extends React.Component<ApiPaneProps, InsertEntityPaneState> {
    private entityType = React.createRef<HTMLInputElement>();
    private html = React.createRef<HTMLTextAreaElement>();
    private styleInline = React.createRef<HTMLInputElement>();
    private styleBlock = React.createRef<HTMLInputElement>();
    private isReadonly = React.createRef<HTMLInputElement>();

    constructor(props: ApiPaneProps) {
        super(props);
        this.state = {
            entities: [],
        };
    }

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
                <hr />
                <div>
                    <button onClick={this.onGetEntities}>Get all entities</button>
                </div>
                <div>
                    {this.state.entities.map(entity => (
                        <EntityButton key={entity.id} entity={entity} />
                    ))}
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

    private onGetEntities = () => {
        this.setState({
            entities: getEntities(this.props.getEditor()),
        });
    };
}

function EntityButton({ entity }: { entity: Entity }) {
    let background = '';
    const onMouseOver = React.useCallback(() => {
        background = entity.contentNode.style.backgroundColor;
        entity.contentNode.style.backgroundColor = 'blue';
    }, [entity]);

    const onMouseOut = React.useCallback(() => {
        entity.contentNode.style.backgroundColor = background;
    }, [entity]);

    return (
        <div onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
            Type: {entity.type}
            <br />
            Id: {entity.id}
            <br />
            Readonly: {entity.isReadonly ? 'True' : 'False'}
            <br />
            <br />
        </div>
    );
}
