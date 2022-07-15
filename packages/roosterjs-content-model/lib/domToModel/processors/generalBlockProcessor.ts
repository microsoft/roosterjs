import { addBlock } from '../utils/addBlock';
import { containerProcessor } from './containerProcessor';
import { createGeneralBlock } from '../creators/createGeneralBlock';
import { ElementProcessor } from '../types/ElementProcessor';

/**
 * @internal
 */
export const generalBlockProcessor: ElementProcessor = (group, element, defaultStyle) => {
    const block = createGeneralBlock(element);

    addBlock(group, block);
    containerProcessor(block, element);
};
