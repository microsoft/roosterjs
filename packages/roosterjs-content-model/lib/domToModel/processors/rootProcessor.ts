import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { rootDirectionFormatHandler } from '../../formatHandlers/root/rootDirectionFormatHandler';
import { zoomScaleFormatHandler } from '../../formatHandlers/root/zoomScaleFormatHandler';

/**
 * @internal
 */
export const rootProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    parseFormat(element, [rootDirectionFormatHandler.parse], context.blockFormat, context);
    parseFormat(element, [zoomScaleFormatHandler.parse], context.zoomScaleFormat, context);

    context.elementProcessors.child(group, element, context);
};
