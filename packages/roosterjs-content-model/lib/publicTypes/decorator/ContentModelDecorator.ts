import { ContentModelCode } from './ContentModelCode';
import { ContentModelLink } from './ContentModelLink';

/**
 * Union type for segment decorators
 */
export type ContentModelDecorator = ContentModelLink | ContentModelCode;
