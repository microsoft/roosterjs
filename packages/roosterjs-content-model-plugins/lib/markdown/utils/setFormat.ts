import { createText } from 'roosterjs-content-model-dom';
import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-core';

import {
    ContentModelSegmentFormat,
    ContentModelText,
    IEditor,
} from 'roosterjs-content-model-types';

export interface Markdown {
    character: string;
    format: ContentModelSegmentFormat;
}

export function setFormat(editor: IEditor, character: string, format: ContentModelSegmentFormat) {
    editor.formatContentModel(
        (model, context) => {
            const selectedSegmentsAndParagraphs = getSelectedSegmentsAndParagraphs(
                model,
                false /*includeFormatHolder*/
            );

            if (selectedSegmentsAndParagraphs.length > 0 && selectedSegmentsAndParagraphs[0][1]) {
                const marker = selectedSegmentsAndParagraphs[0][0];
                context.newPendingFormat = {
                    ...marker.format,
                    strikethrough: !!marker.format.strikethrough,
                    italic: !!marker.format.italic,
                    fontWeight: marker.format?.fontWeight ? 'bold' : undefined,
                };

                const paragraph = selectedSegmentsAndParagraphs[0][1];
                if (marker.segmentType == 'SelectionMarker') {
                    const markerIndex = paragraph.segments.indexOf(marker);
                    let previousCharacterSegment: ContentModelText | undefined = undefined;
                    let index = markerIndex;
                    if (markerIndex > 0 && paragraph.segments[markerIndex - 1]) {
                        const segmentBeforeMarker = paragraph.segments[markerIndex - 1];
                        if (
                            segmentBeforeMarker.segmentType == 'Text' &&
                            segmentBeforeMarker.text[segmentBeforeMarker.text.length - 1] ==
                                character
                        ) {
                            for (let i = markerIndex - 1; i >= 0; i--) {
                                const previousSegment = paragraph.segments[i];
                                if (
                                    previousSegment &&
                                    previousSegment.segmentType == 'Text' &&
                                    previousSegment.text.indexOf(character) > -1 &&
                                    !(
                                        i == markerIndex - 1 &&
                                        previousSegment.text.indexOf(character) ==
                                            previousSegment.text.length - 1
                                    )
                                ) {
                                    previousCharacterSegment = previousSegment;
                                    index = i;
                                    break;
                                }
                            }
                            if (previousCharacterSegment && index < markerIndex) {
                                const textSegments = previousCharacterSegment.text.split(character);
                                previousCharacterSegment.text = textSegments[0];
                                const formattedSegment = createText(textSegments[1], marker.format);
                                paragraph.segments.splice(index + 1, 0, formattedSegment);

                                for (let i = index + 1; i <= markerIndex; i++) {
                                    if (paragraph.segments[i].segmentType == 'Text') {
                                        paragraph.segments[i].format = {
                                            ...paragraph.segments[i].format,
                                            ...format,
                                        };
                                    }
                                }

                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        },
        {
            changeSource: 'SetFormat',
        }
    );
}
