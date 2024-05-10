import type { ContentModelCode } from './ContentModelCode';
import type { ContentModelLink } from './ContentModelLink';
import type { ContentModelListLevel } from './ContentModelListLevel';

/**
 * Union type for segment decorators
 */
export type ContentModelDecorator = ContentModelLink | ContentModelCode | ContentModelListLevel;
