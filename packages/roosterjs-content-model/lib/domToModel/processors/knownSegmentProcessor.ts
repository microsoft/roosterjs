import { containerProcessor } from './containerProcessor';
import { ElementProcessor } from './ElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { SegmentFormatHandlers } from '../../formatHandlers/SegmentFormatHandlers';
import { stackSegmentFormat } from '../utils/stackSegmentFormat';

/**
 * @internal
 */
export const knownSegmentProcessor: ElementProcessor = (group, element, context) => {
    stackSegmentFormat(context, () => {
        parseFormat(
            element,
            SegmentFormatHandlers,
            context.segmentFormat,
            context.contentModelContext
        );
        containerProcessor(group, element, context);
    });
};
