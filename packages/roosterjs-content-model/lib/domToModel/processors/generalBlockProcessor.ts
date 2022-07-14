import { addBlock } from '../utils/addBlock';
import { containerProcessor } from './containerProcessor';
import { createGeneralBlock } from '../creators/createGeneralBlock';
import { ElementProcessor } from '../types/ElementProcessor';

/**
 * @internal
 */
export const generalBlockProcessor: ElementProcessor = (group, context, element, defaultStyle) => {
    const block = createGeneralBlock(context, element);

    addBlock(group, block);
    containerProcessor(block, element, context);
};
