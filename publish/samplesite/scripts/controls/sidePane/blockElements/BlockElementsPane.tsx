import * as React from 'react';
import { BlockElement } from 'roosterjs-editor-types';
import { createRange } from 'roosterjs-editor-dom';

const styles = require('./BlockElementsPane.scss');

export interface BlockElementsPaneProps {
    onGetBlocks: () => void;
    onMouseOver: (block: BlockElement) => void;
}

export interface BlockElementPaneState {
    blocks: BlockElement[];
}

export default class BlockElementsPane extends React.Component<
    BlockElementsPaneProps,
    BlockElementPaneState
> {
    constructor(props: BlockElementsPaneProps) {
        super(props);
        this.state = {
            blocks: [],
        };
    }

    render() {
        return (
            <div>
                <button onClick={this.props.onGetBlocks}>Get blocks</button>
                {this.state.blocks.map((block, index) => (
                    <pre
                        key={index}
                        className={styles.block}
                        onMouseOver={() => this.props.onMouseOver(block)}
                    >
                        {getTextContent(block) || '<NO CONTENT>'}
                    </pre>
                ))}
            </div>
        );
    }

    setBlocks(blocks: BlockElement[]) {
        this.setState({
            blocks: blocks,
        });
    }
}

function getTextContent(block: BlockElement): string {
    return block.getStartNode() == block.getEndNode()
        ? block.getStartNode().textContent
        : createRange(block.getStartNode(), block.getEndNode()).toString();
}
