import type { DefinitionType } from './DefinitionType';

/**
 * A type template to get item type of an array
 */
export type ArrayItemType<T extends any[]> = T extends (infer U)[] ? U : never;

/**
 * Base interface of property definition
 */
export interface DefinitionBase<T extends DefinitionType> {
    /**
     * Type of this property
     */
    type: T;

    /**
     * Whether this property is optional
     */
    isOptional?: boolean;

    /**
     * Whether this property is allowed to be null
     */
    allowNull?: boolean;
}

/**
 * String property definition. This definition can also be used for string based enum property
 */
export interface StringDefinition extends DefinitionBase<'string'> {
    /**
     * An optional value of this property. When specified, the given property must have exactly same value of this value
     */
    value?: string;
}

/**
 * Number property definition. This definition can also be used for number based enum property
 */
export interface NumberDefinition extends DefinitionBase<'number'> {
    /**
     * An optional value of this property. When specified, the given property must have same value of this value
     */
    value?: number;

    /**
     * An optional minimum value of this property. When specified, the given property must be greater or equal to this value
     */
    minValue?: number;

    /**
     * An optional maximum value of this property. When specified, the given property must be less or equal to this value
     */
    maxValue?: number;
}

/**
 * Boolean property definition
 */
export interface BooleanDefinition extends DefinitionBase<'boolean'> {
    /**
     * An optional value of this property. When specified, the given property must have same value of this value
     */
    value?: boolean;
}

/**
 * Array property definition.
 */
export interface ArrayDefinition<T extends any[]> extends DefinitionBase<'array'> {
    /**
     * Definition of each item of this array. All items of the given array must have the same type. Otherwise, use CustomizeDefinition instead.
     */
    itemDef: Definition<ArrayItemType<T>>;

    /**
     * An optional minimum length of this array. When specified, the given array must have at least this value of items
     */
    minLength?: number;

    /**
     * An optional maximum length of this array. When specified, the given array must have at most this value of items
     */
    maxLength?: number;
}

/**
 * Object property definition type used by Object Definition
 */
export type ObjectPropertyDefinition<T extends Object> = {
    [Key in keyof T]: Definition<T[Key]>;
};

/**
 * Object property definition.
 */
export interface ObjectDefinition<T extends Object> extends DefinitionBase<'object'> {
    /**
     * A key-value map to specify the definition of each possible property of this object
     */
    propertyDef: ObjectPropertyDefinition<T>;
}

/**
 * A combination of all definition types
 */
export type Definition<T> = T extends any[]
    ? ArrayDefinition<T>
    : T extends Record<string, any>
    ? ObjectDefinition<T>
    : T extends String
    ? StringDefinition
    : T extends Number
    ? NumberDefinition
    : T extends Boolean
    ? BooleanDefinition
    : never;
