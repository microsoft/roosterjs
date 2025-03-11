type HeadingLevelTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const HeaderFontSizes: Record<HeadingLevelTags, string> = {
    h1: '2em',
    h2: '1.5em',
    h3: '1.17em',
    h4: '1em',
    h5: '0.83em',
    h6: '0.67em',
};

/**
 * @internal
 */
export const headingLevels = [
    { prefix: '# ', tagName: 'h1', fontSize: HeaderFontSizes.h1 },
    { prefix: '## ', tagName: 'h2', fontSize: HeaderFontSizes.h2 },
    { prefix: '### ', tagName: 'h3', fontSize: HeaderFontSizes.h3 },
    { prefix: '#### ', tagName: 'h4', fontSize: HeaderFontSizes.h4 },
    { prefix: '##### ', tagName: 'h5', fontSize: HeaderFontSizes.h5 },
    { prefix: '###### ', tagName: 'h6', fontSize: HeaderFontSizes.h6 },
];

/**
 * @internal
 */
export const MarkdownHeadings: Record<string, string> = {
    h1: '# ',
    h2: '## ',
    h3: '### ',
    h4: '#### ',
    h5: '##### ',
    h6: '###### ',
};
