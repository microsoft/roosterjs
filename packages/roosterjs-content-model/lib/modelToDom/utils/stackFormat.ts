import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export function stackFormat(
    context: ModelToDomContext,
    tagName: string | null,
    callback: () => void
) {
    if (tagName) {
        const implicitFormat = context.implicitFormat;

        try {
            const newFormat = context.defaultImplicitFormatMap[tagName] || {};

            context.implicitFormat = {
                ...implicitFormat,
                ...newFormat,
            };

            callback();
        } finally {
            context.implicitFormat = implicitFormat;
        }
    } else {
        callback();
    }
}
