import type { ContentModelCode, ReadonlyContentModelCode } from './ContentModelCode';
import type { ContentModelLink, ReadonlyContentModelLink } from './ContentModelLink';
import type { ContentModelListLevel, ReadonlyContentModelListLevel } from './ContentModelListLevel';

/**
 * Union type for segment decorators
 */
export type ContentModelDecorator = ContentModelLink | ContentModelCode | ContentModelListLevel;

/**
 * Union type for segment decorators (Readonly)
 */
export type ReadonlyContentModelDecorator =
    | ReadonlyContentModelLink
    | ReadonlyContentModelCode
    | ReadonlyContentModelListLevel;
