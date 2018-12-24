import * as React from 'react';
import { BlockElement } from 'roosterjs-editor-types';

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
                        {block.getTextContent() || '<NO CONTENT>'}
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
