import { Map } from '../types/maps';

function nativeClone<T>(source: Map<T>, existingObj?: Map<T>): Map<T> {
    return Object.assign(existingObj || {}, source);
}

function customClone<T>(source: Map<T>, existingObj?: Map<T>): Map<T> {
    let result: Map<T> = existingObj || {};
    if (source) {
        for (let key of Object.keys(source)) {
            result[key] = source[key];
        }
    }
    return result;
}

const cloneObject = Object.assign ? nativeClone : customClone;

export default cloneObject;
