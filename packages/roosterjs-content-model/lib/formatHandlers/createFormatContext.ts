import { FormatContext } from '../publicTypes/format/FormatContext';

/**
 * @internal
 */
export function createFormatContext(
    isDarkMode: boolean = false,
    zoomScale: number = 1,
    isRightToLeft: boolean = false,
    getDarkColor?: (lightColor: string) => string
): FormatContext {
    return {
        isDarkMode,
        zoomScale,
        isRightToLeft,
        getDarkColor,
    };
}
