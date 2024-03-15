/**
 * Types of definitions, used by Definition type
 */
export type DefinitionType =
    /**
     * Boolean type definition, represents a boolean type value
     */
    | 'boolean'

    /**
     * Number type definition, represents a number type value
     */
    | 'number'

    /**
     * String type definition, represents a string type value
     */
    | 'string'

    /**
     * Array type definition, represents an array with a given item type
     */
    | 'array'

    /**
     * Object type definition, represents an object with the given property types
     */
    | 'object';
