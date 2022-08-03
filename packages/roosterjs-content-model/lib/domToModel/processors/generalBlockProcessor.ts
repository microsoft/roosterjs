import { addBlock } from '../../modelApi/common/addBlock';
import { containerProcessor } from './containerProcessor';
import { createGeneralBlock } from '../../modelApi/creators/createGeneralBlock';
import { ElementProcessor } from './ElementProcessor';

/**
 * @internal
 */
export const generalBlockProcessor: ElementProcessor = (group, element, context) => {
    const block = createGeneralBlock(element);

    addBlock(group, block);
    containerProcessor(block, element, context);
};
