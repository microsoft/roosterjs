import {
    Definition,
    DefinitionType,
    NumberDefinition,
    ArrayDefinition,
    BooleanDefinition,
    StringDefinition,
    ObjectDefinition,
    ObjectPropertyDefinition,
} from 'roosterjs-editor-types';

/**
 * Create a number definition
 * @param isOptional Whether this property is optional
 * @param value Optional value of the number
 * @param minValue Optional minimum value
 * @param maxValue Optional maximum value
 * @returns The number definition object
 */
export function createNumberDefinition(
    isOptional?: boolean,
    value?: number,
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
 * @param isOptional  Whether this property is optional
 * @param value Optional expected boolean value
 * @returns  The boolean definition object
 */
export function createBooleanDefinition(isOptional?: boolean, value?: boolean): BooleanDefinition {
    return {
        type: DefinitionType.Boolean,
        isOptional,
        value,
    };
}

/**
 * Create a string definition
 * @param isOptional  Whether this property is optional
 * @param value Optional expected string value
 * @returns  The string definition object
 */
export function createStringDefinition(isOptional?: boolean, value?: string): StringDefinition {
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
    isOptional?: boolean,
    minLength?: number,
    maxLength?: number
): ArrayDefinition<T[]> {
    return {
        type: DefinitionType.Array,
        isOptional,
        itemDef,
        minLength,
        maxLength,
    };
}

/**
 * Create an object definition
 * @param propertyDef Definition of each property of the related object
 * @param isOptional  Whether this property is optional
 * @returns  The object definition object
 */
export function createObjectDefinition<T extends Object>(
    propertyDef: ObjectPropertyDefinition<T>,
    isOptional?: boolean
): ObjectDefinition<T> {
    return {
        type: DefinitionType.Object,
        isOptional,
        propertyDef,
    };
}
