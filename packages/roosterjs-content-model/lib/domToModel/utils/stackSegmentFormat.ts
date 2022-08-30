import { DomToModelContext } from '../context/DomToModelContext';

/**
 * @internal
 */
export function stackSegmentFormat(
    context: DomToModelContext,
    callback: () => void,
    clearFormat?: boolean
) {
    const originalSegmentFormat = context.segmentFormat;

    context.segmentFormat = clearFormat ? {} : { ...originalSegmentFormat };

    callback();
    context.segmentFormat = originalSegmentFormat;
}
