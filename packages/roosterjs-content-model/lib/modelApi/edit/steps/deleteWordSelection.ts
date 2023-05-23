import { ContentModelSegment } from '../../../publicTypes/segment/ContentModelSegment';
import { EditContext, EditStep } from './EditStep';
import { isPunctuation, isSpace } from '../findDelimiter';

const enum DeleteWordState {
    Start,
    WaitForSpaceOrText,
    WaitForPunctuationOrSpace,
    WaitForTextOrPunctuationForText,
    WaitForTextOrPunctuationForSpace,
    WaitForText,
    End,
}

interface CharInfo {
    isSpace: boolean;
    isPunctuation: boolean;
}

function* iterateSegments(
    segments: ContentModelSegment[],
    markerIndex: number,
    forward: boolean,
    context: EditContext
): Generator<CharInfo, null, boolean> {
    const step = forward ? 1 : -1;

    for (let i = markerIndex + step; i >= 0 && i < segments.length; i += step) {
        const segment = segments[i];

        switch (segment.segmentType) {
            case 'Text':
                for (
                    let j = forward ? 0 : segment.text.length - 1;
                    j >= 0 && j < segment.text.length;
                    j += step
                ) {
                    const c = segment.text[j];
                    if (
                        yield {
                            isPunctuation: isPunctuation(c),
                            isSpace: isSpace(c),
                        }
                    ) {
                        segment.text = segment.text.substring(0, j) + segment.text.substring(j + 1);
                        j -= step;
                        context.isChanged = true;
                    }
                }
                break;

            case 'Image':
                if (
                    yield {
                        isPunctuation: true, // Treat image as punctuation since they have the same behavior.
                        isSpace: false,
                    }
                ) {
                    segments.splice(i, 1);
                    i -= step;
                    context.isChanged = true;
                }
                break;

            case 'SelectionMarker':
                break;

            default:
                return null;
        }
    }

    return null;
}

/**
 * @internal
 */
export const deleteWordSelection: EditStep = (context, options) => {
    if (context.insertPoint && !context.isChanged && options.deleteWord) {
        const { marker, paragraph } = context.insertPoint;
        const startIndex = paragraph.segments.indexOf(marker);

        if (options.direction == 'forward') {
            let iterator = iterateSegments(paragraph.segments, startIndex, true, context);
            let curr = iterator.next();

            for (let state = DeleteWordState.Start; state != DeleteWordState.End && !curr.done; ) {
                const { isPunctuation: punctuation, isSpace: space } = curr.value;
                switch (state) {
                    case DeleteWordState.Start:
                        state = space
                            ? DeleteWordState.WaitForTextOrPunctuationForSpace
                            : punctuation
                            ? DeleteWordState.WaitForSpaceOrText
                            : DeleteWordState.WaitForPunctuationOrSpace;
                        curr = iterator.next(true /*delete*/);
                        break;

                    case DeleteWordState.WaitForSpaceOrText:
                        if (punctuation) {
                            curr = iterator.next(true /*delete*/);
                        } else if (space) {
                            state = DeleteWordState.WaitForTextOrPunctuationForText;
                            curr = iterator.next(true /*delete*/);
                        } else {
                            state = DeleteWordState.End;
                        }
                        break;

                    case DeleteWordState.WaitForPunctuationOrSpace:
                        if (punctuation) {
                            state = DeleteWordState.End;
                        } else if (space) {
                            state = DeleteWordState.WaitForTextOrPunctuationForText;
                            curr = iterator.next(true /*delete*/);
                        } else {
                            curr = iterator.next(true /*delete*/);
                        }
                        break;

                    case DeleteWordState.WaitForTextOrPunctuationForText:
                        if (punctuation || !space) {
                            state = DeleteWordState.End;
                        } else {
                            curr = iterator.next(true /*delete*/);
                        }
                        break;

                    case DeleteWordState.WaitForTextOrPunctuationForSpace:
                        if (punctuation) {
                            state = DeleteWordState.WaitForText;
                            curr = iterator.next(true /*delete*/);
                        } else if (space) {
                            curr = iterator.next(true /*delete*/);
                        } else {
                            state = DeleteWordState.End;
                        }
                        break;

                    case DeleteWordState.WaitForText:
                        if (space || punctuation) {
                            curr = iterator.next(true /*delete*/);
                        } else {
                            state = DeleteWordState.End;
                        }
                }
            }
        } else if (options.direction == 'backward') {
        }
    }
};
