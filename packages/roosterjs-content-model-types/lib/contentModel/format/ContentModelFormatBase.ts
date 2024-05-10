/**
 * Base type of content model format.
 * All content model format should only have simple value type (string, number, boolean).
 * So that we can use a single level copy ({...object}) to easily clone a format object
 */
export type ContentModelFormatBase<
    V extends string | number | boolean | undefined | null =
        | string
        | number
        | boolean
        | undefined
        | null
> = {
    [key: string]: V;
};
