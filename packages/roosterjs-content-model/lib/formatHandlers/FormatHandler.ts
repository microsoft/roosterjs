import { ContentModelContext } from '../publicTypes/ContentModelContext';

/**
 * @internal
 */
export interface FormatHandler<TFormat> {
    parse: (format: TFormat, element: HTMLElement, context: ContentModelContext) => void;
    apply: (format: TFormat, element: HTMLElement, context: ContentModelContext) => void;
}
