import type { ContentModelCode, ReadonlyContentModelCode } from './ContentModelCode';
import type { ContentModelData, ReadonlyContentModelData } from './ContentModelData';
import type { ContentModelLink, ReadonlyContentModelLink } from './ContentModelLink';
import type { ContentModelListLevel, ReadonlyContentModelListLevel } from './ContentModelListLevel';

/**
 * Union type for segment decorators
 */
export type ContentModelDecorator =
    | ContentModelLink
    | ContentModelCode
    | ContentModelData
    | ContentModelListLevel;

/**
 * Union type for segment decorators (Readonly)
 */
export type ReadonlyContentModelDecorator =
    | ReadonlyContentModelLink
    | ReadonlyContentModelCode
    | ReadonlyContentModelData
    | ReadonlyContentModelListLevel;
