/**
 * Format of underline
 */
export type UnderlineFormat = {
    /**
     * Whether it has underline
     */
    underline?: boolean;

    /**
     * Optional CSS style of the underline. Empty or omitted for the default solid underline.
     */
    underlineStyle?: '' | 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';
};
