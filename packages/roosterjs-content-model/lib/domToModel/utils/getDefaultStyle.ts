type DefaultFormatParserType =
    | Partial<CSSStyleDeclaration>
    | ((e: HTMLElement) => Partial<CSSStyleDeclaration>);

const FontSizes = ['10px', '13px', '16px', '18px', '24px', '32px', '48px'];

function getFontSize(size: string | null) {
    const intSize = parseInt(size || '');

    if (Number.isNaN(intSize)) {
        return undefined;
    } else if (intSize < 1) {
        return FontSizes[0];
    } else if (intSize > FontSizes.length) {
        return FontSizes[FontSizes.length - 1];
    } else {
        return FontSizes[intSize - 1];
    }
}

const DefaultStyleMap: Record<string, DefaultFormatParserType> = {
    B: {
        fontWeight: 'bold',
    },
    EM: {
        fontStyle: 'italic',
    },
    FONT: e => {
        return {
            fontFamily: e.getAttribute('face') || undefined,
            fontSize: getFontSize(e.getAttribute('size')),
            color: e.getAttribute('color') || undefined,
        };
    },
    I: {
        fontStyle: 'italic',
    },
    S: {
        textDecoration: 'line-through',
    },
    STRIKE: {
        textDecoration: 'line-through',
    },
    STRONG: {
        fontWeight: 'bold',
    },
    U: {
        textDecoration: 'underline',
    },
};

/**
 * @internal
 */
export function getDefaultStyle(element: HTMLElement): Partial<CSSStyleDeclaration> {
    const style = DefaultStyleMap[element.tagName];
    return style ? (typeof style === 'function' ? style(element) : style) : {};
}
