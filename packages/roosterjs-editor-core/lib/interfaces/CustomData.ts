/**
 * Custom data stored in editor
 */
export default interface CustomData {
    value: any;
    disposer: (value: any) => void;
}

/**
 * Define the type of a set of custom data with an access key
 */
export type CustomDataSet = { [key: string]: CustomData };
