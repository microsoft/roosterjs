import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';

/**
 * @internal
 */
export type DeepObjectStackType = 'deepClone' | 'delete';

/**
 * @internal
 */
export type ShallowObjectStackType = 'shallowClone' | 'empty';

/**
 * @internal
 */
export interface StackFormatOptions {
    segment?: ShallowObjectStackType;
    list?: DeepObjectStackType;
}

/**
 * @internal
 */
export function stackFormat(
    context: DomToModelContext,
    options: StackFormatOptions,
    callback: () => void
) {
    const { segmentFormat, listFormat } = context;
    const { segment, list } = options;
    const { listParent, levels } = listFormat;

    try {
        context.segmentFormat = stackFormatInternal(segmentFormat, segment);
        context.listFormat.listParent = stackFormatInternal(listParent, list);
        context.listFormat.levels = stackFormatInternal(levels, list);

        callback();
    } finally {
        context.segmentFormat = segmentFormat;
        context.listFormat.listParent = listParent;
        context.listFormat.levels = levels;
    }
}

function stackFormatInternal<T extends ContentModelFormatBase>(
    format: T,
    processType: ShallowObjectStackType | undefined
): T | {};

function stackFormatInternal<T extends Object>(
    format: T | undefined,
    processType: DeepObjectStackType | undefined
): T;

function stackFormatInternal<T>(
    format: T,
    processType: ShallowObjectStackType | DeepObjectStackType | undefined
): T | {} {
    return processType == 'empty'
        ? {}
        : processType == 'delete'
        ? undefined
        : processType == 'shallowClone'
        ? { ...format }
        : processType == 'deepClone'
        ? JSON.parse(JSON.stringify(format))
        : format;
}
