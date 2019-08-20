import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import { BlockElement, PluginEvent, PluginEventType, PositionType } from 'roosterjs-editor-types';
import { createRange, NodeBlockElement } from 'roosterjs-editor-dom';

const styles = require('./BlockElementsPane.scss');

export interface BlockElementPaneState {
    blocks: BlockElement[];
}

export default class BlockElementsPane extends React.Component<
    ApiPaneProps,
    BlockElementPaneState
> {
    private checkGetBlocks = React.createRef<HTMLInputElement>();

    constructor(props: ApiPaneProps) {
        super(props);
        this.state = {
            blocks: [],
        };
    }

    render() {
        return (
            <div>
                <button onClick={this.onGetBlocks}>Get blocks</button>
                <input
                    type="checkbox"
                    id="checkGetBlocks"
                    ref={this.checkGetBlocks}
                    onClick={this.update}
                />
                <label htmlFor="checkGetBlocks">Auto refresh</label>
                {this.state.blocks.map((block, index) => (
                    <pre
                        key={index}
                        className={styles.block}
                        onMouseOver={() => this.onMouseOver(block)}>
                        {block instanceof NodeBlockElement ? (
                            this.renderBlock(block)
                        ) : (
                            <i onDoubleClick={() => this.collapse(block)}>
                                {this.renderBlock(block)}
                            </i>
                        )}
                    </pre>
                ))}
            </div>
        );
    }

    onPluginEvent(e: PluginEvent) {
        if (
            e.eventType == PluginEventType.KeyPress ||
            e.eventType == PluginEventType.ContentChanged
        ) {
            if (this.checkGetBlocks.current.checked) {
                this.update();
            } else {
                this.setBlocks([]);
            }
        }
    }

    private update = () => {
        this.props.getEditor().runAsync(this.onGetBlocks);
    };

    private collapse(block: BlockElement) {
        block.collapseToSingleElement();
        this.props.getEditor().triggerContentChangedEvent();
        if (!this.checkGetBlocks.current.checked) {
            this.onGetBlocks();
        }
    }

    private renderBlock(block: BlockElement): JSX.Element {
        let isNodeBlock = block instanceof NodeBlockElement;
        return (
            <div
                onDoubleClick={!isNodeBlock && (() => this.collapse(block))}
                title={
                    isNodeBlock
                        ? 'This is a NodeBlockElement'
                        : 'This is a StartEndBlockElement, double to collapse'
                }
                style={{ fontStyle: isNodeBlock ? 'normal' : 'italic' }}>
                {getTextContent(block) || '<NO CONTENT>'}
            </div>
        );
    }

    private setBlocks(blocks: BlockElement[]) {
        this.setState({
            blocks: blocks,
        });
    }

    private onGetBlocks = () => {
        let traverser = this.props.getEditor().getBodyTraverser();
        let block = traverser && traverser.currentBlockElement;
        let blocks: BlockElement[] = [];

        while (block) {
            blocks.push(block);
            block = traverser.getNextBlockElement();
        }

        this.setBlocks(blocks);
    };

    private onMouseOver = (block: BlockElement) => {
        this.props
            .getEditor()
            .select(block.getStartNode(), 0, block.getEndNode(), PositionType.End);
    };
}

function getTextContent(block: BlockElement): string {
    return block.getStartNode() == block.getEndNode()
        ? block.getStartNode().textContent
        : createRange(block.getStartNode(), block.getEndNode()).toString();
}
