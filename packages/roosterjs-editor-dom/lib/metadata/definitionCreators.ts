import {
    Definition,
    DefinitionType,
    NumberDefinition,
    ArrayDefinition,
    BooleanDefinition,
    StringDefinition,
    ObjectDefinition,
} from 'roosterjs-editor-types';

/**
 * Create a number definition
 * @param value Optional value of the number
 * @param isOptional Whether this property is optional
 * @param minValue Optional minimum value
 * @param maxValue Optional maximum value
 * @returns The number definition object
 */
export function createNumberDefinition(
    value?: number,
    isOptional?: boolean,
    minValue?: number,
    maxValue?: number
): NumberDefinition {
    return {
        type: DefinitionType.Number,
        isOptional,
        value,
        maxValue,
        minValue,
    };
}

/**
 * Create a boolean definition
 * @param value Optional expected boolean value
 * @param isOptional  Whether this property is optional
 * @returns  The boolean definition object
 */
export function createBooleanDefinition(value?: boolean, isOptional?: boolean): BooleanDefinition {
    return {
        type: DefinitionType.Boolean,
        isOptional,
        value,
    };
}

/**
 * Create a string definition
 * @param value Optional expected string value
 * @param isOptional  Whether this property is optional
 * @returns  The string definition object
 */
export function createStringDefinition(value?: string, isOptional?: boolean): StringDefinition {
    return {
        type: DefinitionType.String,
        isOptional,
        value,
    };
}

/**
 * Create an array definition
 * @param itemDef Definition of each item of the related array
 * @param isOptional  Whether this property is optional
 * @returns  The array definition object
 */
export function createArrayDefinition<T>(
    itemDef: Definition<T>,
    isOptional?: boolean
): ArrayDefinition<T[]> {
    return {
        type: DefinitionType.Array,
        isOptional,
        itemDef,
    };
}

/**
 * Create an object definition
 * @param propertyDef Definition of each property of the related object
 * @param isOptional  Whether this property is optional
 * @returns  The object definition object
 */
export function createObjectDefinition<T extends Record<string, any>>(
    propertyDef: { [Key in keyof T]: Definition<T[Key]> },
    isOptional?: boolean
): ObjectDefinition<T> {
    return {
        type: DefinitionType.Object,
        isOptional,
        propertyDef,
    };
}
