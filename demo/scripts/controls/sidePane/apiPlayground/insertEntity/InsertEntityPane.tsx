import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import { Entity } from 'roosterjs-editor-types';
import { getEntityFromElement, getEntitySelector } from 'roosterjs-editor-dom';
import { insertEntity } from 'roosterjs-editor-api';
import { trustedHTMLHandler } from '../../../../utils/trustedHTMLHandler';

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
    private insertAtRoot = React.createRef<HTMLInputElement>();
    private focusAfterEntity = React.createRef<HTMLInputElement>();

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
                    <label htmlFor="styleInline">Inline</label>
                    <input type="radio" name="entityStyle" ref={this.styleBlock} id="styleBlock" />
                    <label htmlFor="styleBlock">Block</label>
                </div>
                <div>
                    <input id="readonly" type="checkbox" ref={this.isReadonly} />
                    <label htmlFor="readonly">Readonly </label>
                </div>
                <div>
                    <input id="insertAtRoot" type="checkbox" ref={this.insertAtRoot} />
                    <label htmlFor="insertAtRoot">Force insert at root of region</label>
                </div>
                <div>
                    <input id="focusAfterEntity" type="checkbox" ref={this.focusAfterEntity} />
                    <label htmlFor="focusAfterEntity">Focus after entity</label>
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
        const node = document.createElement('span');
        node.innerHTML = trustedHTMLHandler(this.html.current.value);
        const isBlock = this.styleBlock.current.checked;
        const isReadonly = this.isReadonly.current.checked;
        const insertAtRoot = this.insertAtRoot.current.checked;
        const focusAfterEntity = this.focusAfterEntity.current.checked;

        if (node) {
            const editor = this.props.getEditor();

            editor.addUndoSnapshot(() => {
                insertEntity(
                    editor,
                    entityType,
                    node,
                    isBlock,
                    isReadonly,
                    undefined /*position*/,
                    insertAtRoot,
                    focusAfterEntity
                );
            });
        }
    };

    private onGetEntities = () => {
        const selector = getEntitySelector();
        const nodes = this.props.getEditor().queryElements(selector);
        const allEntities = nodes.map(node => getEntityFromElement(node));

        this.setState({
            entities: allEntities.filter(e => !!e),
        });
    };
}

function EntityButton({ entity }: { entity: Entity }) {
    let background = '';
    const onMouseOver = React.useCallback(() => {
        background = entity.wrapper.style.backgroundColor;
        entity.wrapper.style.backgroundColor = 'blue';
    }, [entity]);

    const onMouseOut = React.useCallback(() => {
        entity.wrapper.style.backgroundColor = background;
    }, [entity]);

    return (
        <div onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
            Type: {entity.type}
            <br />
            Id: {entity.id}
            <br />
            Readonly: {entity.isReadonly ? 'True' : 'False'}
            <br />
        </div>
    );
}
