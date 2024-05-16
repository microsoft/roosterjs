import type {
    ContentModelSegment,
    DomToModelDecoratorContext,
    ReadonlyContentModelCode,
    ReadonlyContentModelLink,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function addLink(segment: ContentModelSegment, link: ReadonlyContentModelLink) {
    if (link.format.href) {
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
export function addCode(segment: ContentModelSegment, code: ReadonlyContentModelCode) {
    if (code.format.fontFamily) {
        segment.code = {
            format: { ...code.format },
        };
    }
}

/**
 * @internal
 */
export function addDecorators(segment: ContentModelSegment, context: DomToModelDecoratorContext) {
    addLink(segment, context.link);
    addCode(segment, context.code);
}
