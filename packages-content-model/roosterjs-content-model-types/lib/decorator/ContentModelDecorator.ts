import { ContentModelCode } from './ContentModelCode';
import { ContentModelLink } from './ContentModelLink';
import { ContentModelListLevel } from './ContentModelListLevel';

/**
 * Union type for segment decorators
 */
export type ContentModelDecorator = ContentModelLink | ContentModelCode | ContentModelListLevel;
