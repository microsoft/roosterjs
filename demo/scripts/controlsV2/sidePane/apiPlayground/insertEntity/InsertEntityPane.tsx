import * as React from 'react';
import { ApiPaneProps } from '../ApiPaneProps';
import { insertEntity } from 'roosterjs-content-model-api';
import { moveChildNodes } from 'roosterjs-content-model-dom';
import { trustedHTMLHandler } from '../../../../utils/trustedHTMLHandler';
import {
    ContentModelEntity,
    InsertEntityOptions,
    ReadonlyContentModelBlockGroup,
} from 'roosterjs-content-model-types';

const styles = require('./InsertEntityPane.scss');

interface InsertEntityPaneState {
    entities: ContentModelEntity[];
}

export default class InsertEntityPane extends React.Component<ApiPaneProps, InsertEntityPaneState> {
    private entityType = React.createRef<HTMLInputElement>();
    private html = React.createRef<HTMLTextAreaElement>();
    private styleInline = React.createRef<HTMLInputElement>();
    private styleBlock = React.createRef<HTMLInputElement>();
    private focusAfterEntity = React.createRef<HTMLInputElement>();

    private posFocus = React.createRef<HTMLInputElement>();
    private posTop = React.createRef<HTMLInputElement>();
    private posBottom = React.createRef<HTMLInputElement>();
    private posRegionRoot = React.createRef<HTMLInputElement>();

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
                    Position:
                    <br />
                    <input type="radio" name="position" ref={this.posFocus} id="posFocus" />
                    <label htmlFor="posFocus">Current focus</label>
                    <br />
                    <input type="radio" name="position" ref={this.posTop} id="posTop" />
                    <label htmlFor="posTop">Top</label>
                    <br />
                    <input type="radio" name="position" ref={this.posBottom} id="posBottom" />
                    <label htmlFor="posBottom">Bottom</label>
                    <br />
                    <input
                        type="radio"
                        name="position"
                        ref={this.posRegionRoot}
                        id="posRegionRoot"
                    />
                    <label htmlFor="posRegionRoot">Region root</label>
                    <br />
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
                        <EntityButton key={entity.entityFormat.id} entity={entity} />
                    ))}
                </div>
            </>
        );
    }

    private insertEntity = () => {
        const entityType = this.entityType.current.value;
        const node = document.createElement('span');

        moveChildNodes(node, trustedHTMLHandler.htmlToDOM(this.html.current.value).body);
        const isBlock = this.styleBlock.current.checked;
        const focusAfterEntity = this.focusAfterEntity.current.checked;
        const insertAtTop = this.posTop.current.checked;
        const insertAtBottom = this.posBottom.current.checked;
        const insertAtRoot = this.posRegionRoot.current.checked;

        if (node) {
            const editor = this.props.getEditor();
            const options: InsertEntityOptions = {
                contentNode: node,
                focusAfterEntity: focusAfterEntity,
            };

            editor.focus();

            if (isBlock) {
                insertEntity(
                    editor,
                    entityType,
                    true,
                    insertAtRoot
                        ? 'root'
                        : insertAtTop
                        ? 'begin'
                        : insertAtBottom
                        ? 'end'
                        : 'focus',
                    options
                );
            } else {
                insertEntity(
                    editor,
                    entityType,
                    isBlock,
                    insertAtTop ? 'begin' : insertAtBottom ? 'end' : 'focus',
                    options
                );
            }
        }
    };

    private onGetEntities = () => {
        const allEntities: ContentModelEntity[] = [];

        this.props.getEditor().formatContentModel(model => {
            findAllEntities(model, allEntities);

            return false;
        });

        this.setState({
            entities: allEntities.filter(e => !!e),
        });
    };
}

function findAllEntities(group: ReadonlyContentModelBlockGroup, result: ContentModelEntity[]) {
    group.blocks.forEach(block => {
        switch (block.blockType) {
            case 'BlockGroup':
                findAllEntities(block, result);
                break;

            case 'Entity':
                result.push(block);
                break;

            case 'Paragraph':
                block.segments.forEach(segment => {
                    switch (segment.segmentType) {
                        case 'Entity':
                            result.push(segment);
                            break;

                        case 'General':
                            findAllEntities(segment, result);
                            break;
                    }
                });
                break;

            case 'Table':
                block.rows.forEach(row => row.cells.forEach(cell => findAllEntities(cell, result)));
                break;
        }
    });
}

function EntityButton({ entity }: { entity: ContentModelEntity }) {
    let background = '';
    const onMouseOver = React.useCallback(() => {
        background = entity.wrapper.style.backgroundColor;
        entity.wrapper.style.backgroundColor = 'blue';
    }, [entity]);

    const onMouseOut = React.useCallback(() => {
        entity.wrapper.style.backgroundColor = background;
    }, [entity]);

    return (
        <div
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            style={{
                border: 'solid 1px gray',
                borderRadius: '5px',
                marginBottom: '10px',
                padding: '5px',
            }}>
            Type: {entity.entityFormat.entityType}
            <br />
            Id: {entity.entityFormat.id}
            <br />
            Readonly: {entity.entityFormat.isReadonly ? 'True' : 'False'}
            <br />
            Fake entity: {entity.entityFormat.isFakeEntity ? 'True' : 'False'}
            <br />
        </div>
    );
}
