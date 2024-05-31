import { matchLink } from 'roosterjs-content-model-api';
import { splitTextSegment } from '../../pluginUtils/splitTextSegment';
import type {
    ContentModelText,
    FormatContentModelContext,
    LinkData,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createLinkAfterSpace(
    previousSegment: ContentModelText,
    paragraph: ShallowMutableContentModelParagraph,
    context: FormatContentModelContext
) {
    const link = previousSegment.text.split(' ').pop();
    const url = link?.trim();
    let linkData: LinkData | null = null;
    if (url && link && (linkData = matchLink(url))) {
        const linkSegment = splitTextSegment(
            previousSegment,
            paragraph,
            previousSegment.text.length - link.trimLeft().length,
            previousSegment.text.trimRight().length
        );
        linkSegment.link = {
            format: {
                href: linkData.normalizedUrl,
                underline: true,
            },
            dataset: {},
        };

        context.canUndoByBackspace = true;

        return true;
    }
    return false;
}
