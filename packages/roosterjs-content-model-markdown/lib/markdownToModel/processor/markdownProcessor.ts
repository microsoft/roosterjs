import { readFencedCodeBlock } from '../utils/readFencedCodeBlock';
import { createFencedCodeBlock } from '../creators/createFencedCodeBlock';
import { createListFromMarkdown } from '../creators/createListFromMarkdown';
import { createBlockGroupFromMarkdown } from '../creators/createBlockGroupFromMarkdown';
import {
    createContentModelDocument,
    createDivider,
    createFormatContainer,
} from 'roosterjs-content-model-dom';
import { createParagraphFromMarkdown } from '../creators/createParagraphFromMarkdown';
import { createTableFromMarkdown } from '../creators/createTableFromMarkdown';
import { isMarkdownTable } from '../utils/isMarkdownTable';

import type { MarkdownToModelOptions } from '../types/MarkdownToModelOptions';
import type {
    ContentModelBlockType,
    ContentModelDocument,
    ContentModelFormatContainer,
    ContentModelListItem,
    ShallowMutableContentModelDocument,
} from 'roosterjs-content-model-types';

interface MarkdownContext {
    lastQuote?: ContentModelFormatContainer;
    lastList?: ContentModelListItem;
    listIndent?: number;
    emptyLineState?: 'notEmpty' | 'lineEnded' | 'empty';
    tableLines: string[];
}

const MarkdownPattern: Record<string, RegExp> = {
    heading: /^#{1,6} .*/,
    horizontal_line: /^---$/,
    table: /^\|.*\|\s*$/,
    blockquote: /^>\s.*$/,
    unordered_list: /^\s*[\*\-\+] .*/,
    ordered_list: /^\s*\d+\. .*/,
    space: /^\s*$/,
    paragraph: /^[^#\-\*\d\|].*/,
};

const MarkdownBlockType: Record<string, ContentModelBlockType> = {
    heading: 'Paragraph',
    horizontal_line: 'Divider',
    paragraph: 'Paragraph',
    unordered_list: 'BlockGroup',
    ordered_list: 'BlockGroup',
    table: 'Table',
    blockquote: 'BlockGroup',
    space: 'Paragraph',
};

/**
 * @internal
 * Process markdown text and convert it to ContentModelDocument
 * @param text The markdown text
 * @param splitLinesPattern The pattern to split lines. Default is /\r\n|\r|\\n|\n/
 * @returns The ContentModelDocument
 */

export function markdownProcessor(
    text: string,
    options: MarkdownToModelOptions
): ContentModelDocument {
    const splitLinesPattern = options.splitLinesPattern || /\r\n|\r|\n/;
    const emptyLine = options.emptyLine ?? 'merge';
    const markdownText = text.split(splitLinesPattern);

    const doc = createContentModelDocument();
    const model = convertMarkdownText(doc, markdownText, options);
    const lastBlock = model.blocks[model.blocks.length - 1];

    if (
        emptyLine != 'remove' &&
        lastBlock &&
        lastBlock.blockType == 'Paragraph' &&
        lastBlock.segments.every(x => x.segmentType == 'Br')
    ) {
        model.blocks.pop();
    }

    return model;
}

function addMarkdownBlockToModel(
    model: ShallowMutableContentModelDocument,
    blockType: ContentModelBlockType,
    markdown: string,
    patternName: string,
    markdownContext: MarkdownContext,
    options: MarkdownToModelOptions
) {
    if (blockType !== 'Table') {
        flushTable(model, markdownContext, options);
    }

    if (patternName == 'space') {
        if (
            markdownContext.tableLines.length > 0 ||
            markdownContext.lastQuote ||
            markdownContext.lastList
        ) {
            markdownContext.tableLines = [];
            markdownContext.lastQuote = undefined;
            markdownContext.lastList = undefined;

            return;
        }

        switch (options.emptyLine) {
            case 'remove':
                // no op, ignore this line
                return;
            case 'merge':
                switch (markdownContext.emptyLineState) {
                    case 'notEmpty':
                    default:
                        // Last line is not empty line, so this empty line is treated as the line end of last paragraph
                        markdownContext.emptyLineState = 'lineEnded';
                        return;

                    case 'lineEnded':
                        // We already see an empty line for paragraph ends, so this line is treated as a real empty line
                        markdownContext.emptyLineState = 'empty';

                        // Keep going, process as a normal paragraph
                        break;

                    case 'empty':
                        // Already processed empty line, so this one should be ignored
                        return;
                }
                break;
            case 'preserve':
            default:
                // no op, treat it as paragraph
                break;
        }
    } else {
        markdownContext.emptyLineState = 'notEmpty';
    }

    if (blockType == 'Paragraph' && (markdownContext.lastList || markdownContext.lastQuote)) {
        blockType = 'BlockGroup';
        patternName = markdownContext.lastList
            ? markdownContext.lastList.levels[0].listType == 'OL'
                ? 'ordered_list'
                : 'unordered_list'
            : 'blockquote';
    }

    switch (blockType) {
        case 'Paragraph':
            const paragraph = createParagraphFromMarkdown(markdown, options);
            model.blocks.push(paragraph);
            break;
        case 'Divider':
            const divider = createDivider('hr');
            model.blocks.push(divider);
            break;
        case 'BlockGroup':
            const blockGroup = createBlockGroupFromMarkdown(
                markdown,
                patternName,
                options,
                markdownContext.lastQuote,
                markdownContext.lastList
            );
            if (!markdownContext.lastQuote) {
                model.blocks.push(blockGroup);
            }
            markdownContext.lastQuote =
                blockGroup.blockGroupType == 'FormatContainer' ? blockGroup : undefined;
            markdownContext.lastList =
                blockGroup.blockGroupType == 'ListItem' ? blockGroup : undefined;
            break;
        case 'Table':
            markdownContext.tableLines = markdownContext.tableLines || [];
            markdownContext.tableLines.push(markdown);
            break;
    }

    if (blockType !== 'BlockGroup') {
        markdownContext.lastQuote = undefined;
        markdownContext.lastList = undefined;
    }
}

function convertMarkdownText(
    model: ContentModelDocument,
    lines: string[],
    options: MarkdownToModelOptions
): ContentModelDocument {
    const markdownContext: MarkdownContext = {
        lastQuote: undefined,
        lastList: undefined,
        tableLines: [],
    };
    for (let index = 0; index <= lines.length; ) {
        const fence =
            index < lines.length ? readContextFence(lines, index, markdownContext) : undefined;
        if (fence) {
            flushTable(model, markdownContext, options);
            const block =
                options.onFencedCodeBlock?.(fence.block) ?? createFencedCodeBlock(fence.block);
            let target:
                | ContentModelDocument
                | ContentModelFormatContainer
                | ContentModelListItem = model;
            if (fence.quoteDepth > 0) {
                for (let depth = 0; depth < fence.quoteDepth; depth++) {
                    const quote: ContentModelFormatContainer =
                        depth == 0 && markdownContext.lastQuote
                            ? markdownContext.lastQuote
                            : createFormatContainer('blockquote');
                    if (quote != markdownContext.lastQuote) {
                        target.blocks.push(quote);
                    }
                    target = quote;
                }
                markdownContext.lastQuote = target as ContentModelFormatContainer;
            } else {
                markdownContext.lastQuote = undefined;
            }
            if (fence.list) {
                const list = createListFromMarkdown(
                    fence.list,
                    /^ *\d/.test(fence.list) ? 'OL' : 'UL',
                    options
                );
                list.blocks = [];
                target.blocks.push(list);
                markdownContext.lastList = list;
                markdownContext.listIndent = fence.listIndent;
                target = list;
            } else if (fence.inList && markdownContext.lastList) {
                target = markdownContext.lastList;
            } else {
                markdownContext.lastList = undefined;
                markdownContext.listIndent = undefined;
            }
            target.blocks.push(block);
            markdownContext.emptyLineState = 'notEmpty';
            index = fence.end;
            if (fence.quoteDepth && !/^ {0,3}>/.test(lines[index] ?? '')) {
                markdownContext.lastQuote = undefined;
            }
            if (
                (fence.list || fence.inList) &&
                !(lines[index] ?? '').startsWith(' '.repeat(fence.listIndent))
            ) {
                markdownContext.lastList = undefined;
                markdownContext.listIndent = undefined;
            }
            continue;
        }
        // Preserve the legacy escaped-newline convention outside literal code only.
        const physicalLine = lines[index++] ?? '';
        for (const line of options.splitLinesPattern ? [physicalLine] : physicalLine.split(/\\n/)) {
            const listMarker = /^( *)(?:[-+*]|\d+\.) +/.exec(line);
            if (listMarker) {
                markdownContext.listIndent = listMarker[0].length;
            }
            let matched = false;
            for (const patternName in MarkdownPattern) {
                if (MarkdownPattern.hasOwnProperty(patternName)) {
                    const pattern = MarkdownPattern[patternName];
                    if (pattern.test(line)) {
                        addMarkdownBlockToModel(
                            model,
                            MarkdownBlockType[patternName],
                            line,
                            patternName,
                            markdownContext,
                            options
                        );
                        matched = true;
                        break;
                    }
                }
            }

            if (!matched) {
                addMarkdownBlockToModel(
                    model,
                    'Paragraph',
                    line,
                    'paragraph',
                    markdownContext,
                    options
                );
            }
        }
    }
    flushTable(model, markdownContext, options);
    return model;
}

function flushTable(
    model: ShallowMutableContentModelDocument,
    markdownContext: MarkdownContext,
    options: MarkdownToModelOptions
) {
    if (markdownContext.tableLines.length > 0) {
        if (
            markdownContext.tableLines.length > 2 &&
            markdownContext.tableLines[1].trim().length > 0 &&
            isMarkdownTable(markdownContext.tableLines[1]) &&
            markdownContext.tableLines.length > 1
        ) {
            const tableModel = createTableFromMarkdown(markdownContext.tableLines, options);
            model.blocks.push(tableModel);
        } else {
            for (const line of markdownContext.tableLines) {
                const paragraph = createParagraphFromMarkdown(line, options);
                model.blocks.push(paragraph);
            }
        }
        markdownContext.tableLines.length = 0;
    }
}

function readContextFence(lines: string[], index: number, context: MarkdownContext) {
    const original = lines[index];
    let opening = original;
    let quoteDepth = 0;
    while (/^ {0,3}> ?/.test(opening)) {
        opening = opening.replace(/^ {0,3}> ?/, '');
        quoteDepth++;
    }
    const listMatch = /^( *)(?:[-+*]|\d+\.) +/.exec(opening);
    const list = listMatch ? listMatch[0] : undefined;
    const listIndent = list?.length ?? context.listIndent ?? 0;
    const inList =
        !list && !!context.lastList && listIndent > 0 && opening.startsWith(' '.repeat(listIndent));
    const strip = (line: string, first: boolean): string | undefined => {
        for (let depth = 0; depth < quoteDepth; depth++) {
            if (!/^ {0,3}> ?/.test(line)) {
                return undefined;
            }
            line = line.replace(/^ {0,3}> ?/, '');
        }
        if (list || inList) {
            if (first && list) {
                return line.substring(list.length);
            }
            if (!line.trim()) {
                return '';
            }
            if (!line.startsWith(' '.repeat(listIndent))) {
                return undefined;
            }
            line = line.substring(listIndent);
        }
        return line;
    };
    let first = true;
    const result = readFencedCodeBlock(lines, index, line => {
        const value = strip(line, first);
        first = false;
        return value;
    });
    return result ? { ...result, quoteDepth, list, listIndent, inList } : undefined;
}
