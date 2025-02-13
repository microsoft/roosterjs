import { createBlockGroupFromMarkdown } from '../creators/createBlockGroupFromMarkdown';
import { createContentModelDocument, createDivider } from 'roosterjs-content-model-dom';
import { createParagraphFromMarkdown } from '../creators/createParagraphFromMarkdown';
import { createTableFromMarkdown } from '../creators/createTableFromMarkdown';
import { isMarkdownTable } from '../utils/isMarkdownTable';

import type {
    ContentModelBlockType,
    ContentModelDocument,
    ContentModelFormatContainer,
    ShallowMutableContentModelDocument,
} from 'roosterjs-content-model-types';

const MarkdownPattern: Record<string, RegExp> = {
    heading: /^#{1,6} .*/,
    horizontal_line: /^---$/,
    blockquote: /^>\s.*$/,
    unordered_list: /^\s*[\*\-\+] .*/,
    ordered_list: /^\s*\d+\. .*/,
    paragraph: /^[^#\-\*\d\|].*/,
    table: /^\|.*\|$/,
};

const MarkdownBlockType: Record<string, ContentModelBlockType> = {
    heading: 'Paragraph',
    horizontal_line: 'Divider',
    paragraph: 'Paragraph',
    unordered_list: 'BlockGroup',
    ordered_list: 'BlockGroup',
    table: 'Table',
    blockquote: 'BlockGroup',
};

/**
 * @internal
 * Process markdown text and convert it to ContentModelDocument
 * @param text The markdown text
 * @returns The ContentModelDocument
 */

export function markdownProcessor(text: string): ContentModelDocument {
    const markdownText = text.split(/\r\n|\r|\\n|\n/).filter(line => line.trim().length > 0);
    markdownText.push(''); // Add an empty line to make sure the last block is processed
    const doc = createContentModelDocument();
    return convertMarkdownText(doc, markdownText);
}

function addMarkdownBlockToModel(
    model: ShallowMutableContentModelDocument,
    blockType: ContentModelBlockType,
    markdown: string,
    patternName: string,
    table: string[],
    quote: {
        lastQuote?: ContentModelFormatContainer;
    }
) {
    if (blockType !== 'Table' && table && table.length > 0) {
        if (table[1].trim().length > 0 && isMarkdownTable(table[1]) && table.length > 1) {
            const tableModel = createTableFromMarkdown(table);
            model.blocks.push(tableModel);
        } else {
            for (const line of table) {
                const paragraph = createParagraphFromMarkdown(line);
                model.blocks.push(paragraph);
            }
        }
        table.length = 0;
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
            const blockGroup = createBlockGroupFromMarkdown(markdown, patternName, quote.lastQuote);
            model.blocks.push(blockGroup);
            quote.lastQuote =
                blockGroup.blockGroupType === 'FormatContainer' ? blockGroup : undefined;
            break;
        case 'Table':
            table = table || [];
            table.push(markdown);
            break;
    }

    if (blockType !== 'BlockGroup') {
        quote.lastQuote = undefined;
    }
}

function convertMarkdownText(model: ContentModelDocument, lines: string[]): ContentModelDocument {
    const tableLines: string[] = [];
    const quoteModel: {
        lastQuote?: ContentModelFormatContainer;
    } = {
        lastQuote: undefined,
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
                        tableLines,
                        quoteModel
                    );
                    matched = true;
                    break;
                }
            }
        }

        if (!matched) {
            addMarkdownBlockToModel(model, 'Paragraph', line, 'paragraph', tableLines, quoteModel);
        }
    }
    return model;
}
