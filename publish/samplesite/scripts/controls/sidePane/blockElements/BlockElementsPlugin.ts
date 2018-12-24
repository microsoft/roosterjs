import BlockElementsPane, { BlockElementsPaneProps } from './BlockElementsPane';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { BlockElement, PositionType } from 'roosterjs-editor-types';

export default class BlockElementsPlugin extends SidePanePluginImpl<
    BlockElementsPane,
    BlockElementsPaneProps
> {
    constructor() {
        super(BlockElementsPane, 'block', 'Block Elements');
    }

    getComponentProps() {
        return {
            onGetBlocks: this.onGetBlocks,
            onMouseOver: this.onMouseOver,
        };
    }

    private onGetBlocks = () => {
        let traverser = this.editor.getBodyTraverser();
        let block = traverser && traverser.currentBlockElement;
        let blocks: BlockElement[] = [];

        while (block) {
            blocks.push(block);
            block = traverser.getNextBlockElement();
        }

        this.getComponent(c => c.setBlocks(blocks));
    };

    private onMouseOver = (block: BlockElement) => {
        this.editor.select(block.getStartNode(), 0, block.getEndNode(), PositionType.End);
    };
}
