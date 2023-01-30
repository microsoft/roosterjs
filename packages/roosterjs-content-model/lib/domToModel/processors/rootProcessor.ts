import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { rootDirectionFormatHandler } from '../../formatHandlers/root/rootDirectionFormatHandler';
import { scaleFormatHandler } from '../../formatHandlers/root/scaleFormatHandler';

/**
 * @internal
 */
export const rootProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    parseFormat(element, [rootDirectionFormatHandler.parse], context.blockFormat, context);
    parseFormat(element, [scaleFormatHandler.parse], context.scaleFormat, context);

    context.elementProcessors.child(group, element, context);
};
