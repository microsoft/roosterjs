import { createBlockGroupFromMarkdown } from '../creators/createBlockGroupFromMarkdown';
import { createContentModelDocument, createDivider } from 'roosterjs-content-model-dom';
import { createMathEntity } from '../creators/createMathEntity';
import { createParagraphFromMarkdown } from '../creators/createParagraphFromMarkdown';
import { createTableFromMarkdown } from '../creators/createTableFromMarkdown';
import { isBlockMathClose, parseBlockMathOpen } from '../utils/mathUtils';
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
    emptyLineState?: 'notEmpty' | 'lineEnded' | 'empty';
    tableLines: string[];
    mathCloseDelimiter?: string;
    mathLines?: string[];
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
    rawOptions: MarkdownToModelOptions
): ContentModelDocument {
    // When math is enabled, ensure a Document is available for creating entity wrappers,
    // without referencing the restricted global `document`.
    const options: MarkdownToModelOptions =
        rawOptions.math && !rawOptions.document
            ? { ...rawOptions, document: new DOMParser().parseFromString('', 'text/html') }
            : rawOptions;

    const splitLinesPattern = options.splitLinesPattern || /\r\n|\r|\\n|\n/;
    const emptyLine = options.emptyLine ?? 'merge';
    const markdownText = text.split(splitLinesPattern);

    markdownText.push(''); // Add an empty line to make sure the last block is processed

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
    if (
        blockType !== 'Table' &&
        markdownContext.tableLines &&
        markdownContext.tableLines.length > 0
    ) {
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
        case 'Entity':
            if (options.document) {
                model.blocks.push(
                    createMathEntity(markdown, true /*isBlock*/, options.document, options.entities)
                );
            }
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
    for (const line of lines) {
        if (options.math && handleBlockMathLine(model, line, markdownContext, options)) {
            continue;
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

    // Flush an unterminated math block, if any
    if (markdownContext.mathCloseDelimiter != undefined) {
        addMarkdownBlockToModel(
            model,
            'Entity',
            (markdownContext.mathLines || []).join('\n'),
            'math',
            markdownContext,
            options
        );
        markdownContext.mathCloseDelimiter = undefined;
        markdownContext.mathLines = undefined;
    }

    return model;
}

/**
 * Handle a single line while tracking multi-line block math state.
 * @returns true when the line was consumed as (part of) block math and needs no further processing
 */
function handleBlockMathLine(
    model: ContentModelDocument,
    line: string,
    markdownContext: MarkdownContext,
    options: MarkdownToModelOptions
): boolean {
    if (markdownContext.mathCloseDelimiter != undefined) {
        if (isBlockMathClose(line, markdownContext.mathCloseDelimiter)) {
            addMarkdownBlockToModel(
                model,
                'Entity',
                (markdownContext.mathLines || []).join('\n'),
                'math',
                markdownContext,
                options
            );
            markdownContext.mathCloseDelimiter = undefined;
            markdownContext.mathLines = undefined;
        } else {
            (markdownContext.mathLines = markdownContext.mathLines || []).push(line);
        }

        return true;
    }

    const mathOpen = parseBlockMathOpen(line);

    if (mathOpen) {
        if (mathOpen.singleLineLatex != undefined) {
            addMarkdownBlockToModel(
                model,
                'Entity',
                mathOpen.singleLineLatex,
                'math',
                markdownContext,
                options
            );
        } else {
            markdownContext.mathCloseDelimiter = mathOpen.closeDelimiter;
            markdownContext.mathLines = [];
        }

        return true;
    }

    return false;
}
