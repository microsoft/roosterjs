import { addBlock } from '../../modelApi/common/addBlock';
import { createCode } from '../../modelApi/creators/createCode';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const codeProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    stackFormat(context, { segment: 'shallowClone', paragraph: 'shallowClone' }, () => {
        parseFormat(element, context.formatParsers.block, context.blockFormat, context);
        parseFormat(element, context.formatParsers.segmentOnBlock, context.segmentFormat, context);

        const code = createCode(context.blockFormat);

        addBlock(group, code);

        // Do not pass block format into child blocks
        context.blockFormat = {};
        context.elementProcessors.child(code, element, context);
    });
};
