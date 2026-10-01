import type { ContentModelFormatContainer } from 'roosterjs-content-model-types';

/** Serialize source with a delimiter that cannot be closed by its body. */
export function serializeFencedCodeBlock(
    source: string,
    info: string = '',
    fence: string = '```'
): string {
    const marker = fence[0] == '~' || info.indexOf('`') >= 0 ? '~' : '`';
    let length = Math.max(3, /^`{3,}$|^~{3,}$/.test(fence) ? fence.length : 3);
    const runs = source.match(marker == '`' ? /`+/g : /~+/g) ?? [];
    runs.forEach(run => {
        length = Math.max(length, run.length + 1);
    });
    const delimiter = marker.repeat(length);
    // Info strings cannot introduce a second block.
    info = info.replace(/[\r\n]/g, ' ');
    return (
        delimiter +
        info +
        '\n' +
        source +
        (source && !source.endsWith('\n') ? '\n' : '') +
        delimiter
    );
}

/** @internal Read literal text, never apply inline Markdown formatting to code. */
export function createMarkdownCodeBlock(container: ContentModelFormatContainer): string {
    const source = container.blocks
        .map(block =>
            block.blockType == 'Paragraph'
                ? block.segments
                      .map(segment =>
                          segment.segmentType == 'Text'
                              ? segment.text
                              : segment.segmentType == 'Br'
                              ? block.segments.length == 1
                                  ? ''
                                  : '\n'
                              : ''
                      )
                      .join('')
                : ''
        )
        .join('\n');
    return serializeFencedCodeBlock(source, container.codeBlock?.info, container.codeBlock?.fence);
}
