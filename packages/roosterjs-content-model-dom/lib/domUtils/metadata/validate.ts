import { getObjectKeys } from '../getObjectKeys';
import type { Definition } from 'roosterjs-content-model-types';

/**
 * @internal
 * Validate the given object with a type definition object
 * @param input The object to validate
 * @param def The type definition object used for validation
 * @returns True if the object passed the validation, otherwise false
 */
export function validate<T>(input: any, def: Definition<T>): input is T {
    let result = false;
    if ((def.isOptional && typeof input === 'undefined') || (def.allowNull && input === null)) {
        result = true;
    } else if (
        (!def.isOptional && typeof input === 'undefined') ||
        (!def.allowNull && input === null)
    ) {
        return false;
    } else {
        switch (def.type) {
            case 'string':
                result =
                    typeof input === 'string' &&
                    (typeof def.value === 'undefined' || input === def.value);
                break;

            case 'number':
                result =
                    typeof input === 'number' &&
                    (typeof def.value === 'undefined' || areSameNumbers(def.value, input)) &&
                    (typeof def.minValue === 'undefined' || input >= def.minValue) &&
                    (typeof def.maxValue === 'undefined' || input <= def.maxValue);
                break;

            case 'boolean':
                result =
                    typeof input === 'boolean' &&
                    (typeof def.value === 'undefined' || input === def.value);
                break;

            case 'array':
                result =
                    Array.isArray(input) &&
                    (typeof def.minLength === 'undefined' || input.length >= def.minLength) &&
                    (typeof def.maxLength === 'undefined' || input.length <= def.maxLength) &&
                    input.every(x => validate(x, def.itemDef));
                break;

            case 'object':
                result =
                    typeof input === 'object' &&
                    getObjectKeys(def.propertyDef).every(x =>
                        validate(input[x], def.propertyDef[x])
                    );
                break;
        }
    }

    return result;
}

function areSameNumbers(n1: number, n2: number) {
    return Math.abs(n1 - n2) < 1e-3;
}
