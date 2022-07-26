import { addBlock } from '../utils/addBlock';
import { containerProcessor } from './containerProcessor';
import { createGeneralBlock } from '../creators/createGeneralBlock';
import { ElementProcessor } from './ElementProcessor';

/**
 * @internal
 */
export const generalBlockProcessor: ElementProcessor = (group, element, context) => {
    const block = createGeneralBlock(element);

    addBlock(group, block);
    containerProcessor(block, element, context);
};
