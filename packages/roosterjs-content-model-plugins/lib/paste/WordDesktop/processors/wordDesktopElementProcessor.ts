import { getStyles } from '../../utils/getStyles';
import { processWordComments } from '../processWordComments';
import { processWordList } from '../processWordLists';
import type { WordMetadata } from '../WordMetadata';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Element processor for Word Desktop content
 * Processes Word Lists or Word Comments, otherwise uses the default processor
 */
export const wordDesktopElementProcessor = (
    metadataKey: Map<string, WordMetadata>
): ElementProcessor<HTMLElement> => {
    return (group, element, context) => {
        const styles = getStyles(element);
        // Process Word Lists or Word Commands, otherwise use the default processor on this element.
        if (
            !(
                processWordList(styles, group, element, context, metadataKey) ||
                processWordComments(styles, element)
            )
        ) {
            context.defaultElementProcessors.element(group, element, context);
        }
    };
};
