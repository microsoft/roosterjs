import { createLinkDecorator } from 'roosterjs-content-model-dom/lib';
import { matchLink } from 'roosterjs-content-model-api';
import { splitTextSegment } from '../../pluginUtils/splitTextSegment';
import type {
    ContentModelParagraph,
    ContentModelText,
    FormatContentModelContext,
    LinkData,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createLinkAfterSpace(
    previousSegment: ContentModelText,
    paragraph: ContentModelParagraph,
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
        linkSegment.link = createLinkDecorator({
            href: linkData.normalizedUrl,
            underline: true,
        });

        context.canUndoByBackspace = true;

        return true;
    }
    return false;
}
