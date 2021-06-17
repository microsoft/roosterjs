/**
 * Convert a named node map to an array
 * @param collection The map to convert
 */
export default function toArray(collection: NamedNodeMap): Attr[];

/**
 * Convert a named node map to an array
 * @param collection The map to convert
 */
export default function toArray(collection: DataTransferItemList): DataTransferItem[];

/**
 * Convert a collection to an array
 * @param collection The collection to convert
 */
export default function toArray<T extends Node>(collection: NodeListOf<T>): T[];

/**
 * Convert a collection to an array
 * @param collection The collection to convert
 */
export default function toArray<T extends Element>(collection: HTMLCollectionOf<T>): T[];

/**
 * Convert an array to an array.
 * This is to satisfy typescript compiler. For some cases the object can be a collection at runtime,
 * but the declaration is an array. e.g. ClipboardData.types
 * @param array The array to convert
 */
export default function toArray<T>(array: readonly T[]): T[];

export default function toArray(collection: any): any[] {
    return [].slice.call(collection);
}
