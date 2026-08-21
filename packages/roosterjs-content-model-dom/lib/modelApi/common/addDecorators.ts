import type {
    DomToModelDecoratorContext,
    ReadonlyContentModelCode,
    ReadonlyContentModelData,
    ReadonlyContentModelLink,
    ShallowMutableContentModelSegment,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function addLink(
    segment: ShallowMutableContentModelSegment,
    link: ReadonlyContentModelLink
) {
    if (link.format.href || link.format.name) {
        segment.link = {
            format: { ...link.format },
            dataset: { ...link.dataset },
        };
    }
}

/**
 * Add a code decorator into segment if any
 * @param segment The segment to add decorator to
 * @param code The code decorator to add
 */
export function addCode(
    segment: ShallowMutableContentModelSegment,
    code: ReadonlyContentModelCode
) {
    if (code.format.fontFamily) {
        segment.code = {
            format: { ...code.format },
        };
    }
}

/**
 * @internal
 * Add a data decorator into segment if any
 * @param segment The segment to add decorator to
 * @param data The data decorator to add
 */
export function addData(
    segment: ShallowMutableContentModelSegment,
    data: ReadonlyContentModelData
) {
    if (data.format.dataValue != undefined) {
        segment.data = {
            format: { ...data.format },
        };
    }
}

/**
 * @internal
 */
export function addDecorators(
    segment: ShallowMutableContentModelSegment,
    context: DomToModelDecoratorContext
) {
    addLink(segment, context.link);
    addCode(segment, context.code);
    addData(segment, context.data);
}
