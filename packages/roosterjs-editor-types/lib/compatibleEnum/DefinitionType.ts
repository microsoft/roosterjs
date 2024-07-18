/**
 * Types of definitions, used by Definition type
 */
// eslint-disable-next-line etc/no-const-enum
export enum CompatibleDefinitionType {
    /**
     * Boolean type definition, represents a boolean type value
     */
    Boolean,

    /**
     * Number type definition, represents a number type value
     */
    Number,

    /**
     * String type definition, represents a string type value
     */
    String,

    /**
     * Array type definition, represents an array with a given item type
     */
    Array,

    /**
     * Object type definition, represents an object with the given property types
     */
    Object,

    /**
     * Customize type definition, represents a customized type with a validator function
     */
    Customize,
}
