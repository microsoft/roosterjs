import { ContentModelContext } from '../../publicTypes/ContentModelContext';
import { ModelToDomContext } from './ModelToDomContext';

export function createModelToDomContext(
    contentModelContext?: ContentModelContext
): ModelToDomContext {
    return {
        contentModelContext: contentModelContext || {
            isDarkMode: false,
            isRightToLeft: false,
            zoomScale: 1,
            getDarkColor: undefined,
        },
    };
}
