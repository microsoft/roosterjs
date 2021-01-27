/**
 * A type-safe wrapper for Array.prototype.push.apply()
 * @param mainArray The main array to push items into
 * @param itemsArray The items to push to main array
 */
export default function arrayPush<T>(mainArray: T[], itemsArray: T[]) {
    Array.prototype.push.apply(mainArray, itemsArray);
}
