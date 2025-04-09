import { createBlockGroupFromMarkdown } from '../creators/createBlockGroupFromMarkdown';
import { createContentModelDocument, createDivider } from 'roosterjs-content-model-dom';
import { createParagraphFromMarkdown } from '../creators/createParagraphFromMarkdown';
import { createTableFromMarkdown } from '../creators/createTableFromMarkdown';
import { isMarkdownTable } from '../utils/isMarkdownTable';

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
    splitLinesPattern: string | RegExp
): ContentModelDocument {
    const markdownText = text.split(splitLinesPattern);
    markdownText.push(''); // Add an empty line to make sure the last block is processed
    const doc = createContentModelDocument();
    return convertMarkdownText(doc, markdownText);
}

function addMarkdownBlockToModel(
    model: ShallowMutableContentModelDocument,
    blockType: ContentModelBlockType,
    markdown: string,
    patternName: string,
    markdownContext: MarkdownContext
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
            const tableModel = createTableFromMarkdown(markdownContext.tableLines);
            model.blocks.push(tableModel);
        } else {
            for (const line of markdownContext.tableLines) {
                const paragraph = createParagraphFromMarkdown(line);
                model.blocks.push(paragraph);
            }
        }
        markdownContext.tableLines.length = 0;
    }

    if (patternName == 'space') {
        markdownContext.tableLines = [];
        markdownContext.lastQuote = undefined;
        markdownContext.lastList = undefined;
        return;
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
            const paragraph = createParagraphFromMarkdown(markdown);
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
                markdownContext.lastQuote
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

function convertMarkdownText(model: ContentModelDocument, lines: string[]): ContentModelDocument {
    const markdownContext: MarkdownContext = {
        lastQuote: undefined,
        lastList: undefined,
        tableLines: [],
    };
    for (const line of lines) {
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
                        markdownContext
                    );
                    matched = true;
                    break;
                }
            }
        }

        if (!matched) {
            addMarkdownBlockToModel(model, 'Paragraph', line, 'paragraph', markdownContext);
        }
    }
    return model;
}
