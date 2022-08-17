import { ContentModelContext } from '../publicTypes/ContentModelContext';
import { ContentModelFormatBase } from '../publicTypes/format/ContentModelFormatBase';

/**
 * @internal
 */
export interface FormatHandler<TFormat extends ContentModelFormatBase> {
    parse: (format: TFormat, element: HTMLElement, context: ContentModelContext) => void;
    apply: (format: TFormat, element: HTMLElement, context: ContentModelContext) => void;
}
