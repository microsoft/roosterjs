function reduceObject<T>(object: any, callback: (key: string) => boolean): T {
    if (!object) {
        return object;
    }

    return Object.keys(object).reduce((result: any, key: string) => {
        if (callback(key)) {
            result[key] = object[key];
        }
        return result;
    }, {} as T);
}

export function getDataAndAriaProps<T>(props: any): T {
    return reduceObject(
        props || {},
        propName => propName.indexOf('data-') === 0 || propName.indexOf('aria-') === 0
    );
}
