import { addBlock } from '../../modelApi/common/addBlock';
import { createDivider } from '../../modelApi/creators/createDivider';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const hrProcessor: ElementProcessor<HTMLHRElement> = (group, element, context) => {
    stackFormat(
        context,
        {
            paragraph: 'shallowClone',
        },
        () => {
            parseFormat(element, context.formatParsers.divider, context.blockFormat, context);

            const hr = createDivider('hr', context.blockFormat);

            if (element.size) {
                hr.size = element.size;
            }

            if (context.isInSelection) {
                hr.isSelected = true;
            }

            addBlock(group, hr);
        }
    );
};
