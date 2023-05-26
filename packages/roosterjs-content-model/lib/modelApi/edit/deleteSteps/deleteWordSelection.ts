import { ContentModelParagraph } from '../../../publicTypes/block/ContentModelParagraph';
import { isPunctuation, isSpace, normalizeText } from '../../../domUtils/stringUtil';
import { isWhiteSpacePreserved } from '../../common/isWhiteSpacePreserved';
import {
    DeleteResult,
    DeleteSelectionContext,
    DeleteSelectionStep,
} from '../utils/DeleteSelectionStep';

const enum DeleteWordState {
    Start,
    Punctuation,
    Text,
    NonText,
    Space,
    End,
}

interface CharInfo {
    text: boolean;
    space: boolean;
    punctuation: boolean;
}

function getDeleteWordSelection(direction: 'forward' | 'backward'): DeleteSelectionStep {
    return context => {
        const { marker, paragraph } = context.insertPoint;
        const startIndex = paragraph.segments.indexOf(marker);
        const deleteNext = direction == 'forward';

        let iterator = iterateSegments(paragraph, startIndex, deleteNext, context);
        let curr = iterator.next();

        for (let state = DeleteWordState.Start; state != DeleteWordState.End && !curr.done; ) {
            const { punctuation, space, text } = curr.value;

            // This is a state machine of how to delete a whole word together with space and punctuations.
            // For a full state machine chart, see
            // Forward delete: https://github.com/microsoft/roosterjs/blob/master/assets/design-charts/ForwardDeleteWord.png
            // Backward delete: https://github.com/microsoft/roosterjs/blob/master/assets/design-charts/BackwardDeleteWord.png
            switch (state) {
                case DeleteWordState.Start:
                    state = space
                        ? DeleteWordState.Space
                        : punctuation
                        ? DeleteWordState.Punctuation
                        : DeleteWordState.Text;
                    curr = iterator.next(true /*delete*/);
                    break;

                case DeleteWordState.Punctuation:
                    if (deleteNext && space) {
                        state = DeleteWordState.NonText;
                        curr = iterator.next(true /*delete*/);
                    } else if (punctuation) {
                        curr = iterator.next(true /*delete*/);
                    } else {
                        state = DeleteWordState.End;
                    }
                    break;

                case DeleteWordState.Text:
                    if (deleteNext && space) {
                        state = DeleteWordState.NonText;
                        curr = iterator.next(true /*delete*/);
                    } else if (text) {
                        curr = iterator.next(true /*delete*/);
                    } else {
                        state = DeleteWordState.End;
                    }
                    break;

                case DeleteWordState.NonText:
                    if (punctuation || !space) {
                        state = DeleteWordState.End;
                    } else {
                        curr = iterator.next(true /*delete*/);
                    }
                    break;

                case DeleteWordState.Space:
                    if (space) {
                        curr = iterator.next(true /*delete*/);
                    } else if (punctuation) {
                        state = deleteNext ? DeleteWordState.NonText : DeleteWordState.Punctuation;
                        curr = iterator.next(true /*delete*/);
                    } else {
                        state = deleteNext ? DeleteWordState.End : DeleteWordState.Text;
                    }
                    break;
            }
        }
    };
}

function* iterateSegments(
    paragraph: ContentModelParagraph,
    markerIndex: number,
    forward: boolean,
    context: DeleteSelectionContext
): Generator<CharInfo, null, boolean> {
    const step = forward ? 1 : -1;
    const segments = paragraph.segments;
    const preserveWhiteSpace = isWhiteSpacePreserved(paragraph);

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
                    const punctuation = isPunctuation(c);
                    const space = isSpace(c);
                    const text = !punctuation && !space;

                    if (yield { punctuation, space, text }) {
                        let newText = segment.text;

                        newText = newText.substring(0, j) + newText.substring(j + 1);

                        if (!preserveWhiteSpace) {
                            newText = normalizeText(newText, forward);
                        }

                        context.deleteResult = DeleteResult.Range;

                        if (newText) {
                            segment.text = newText;

                            if (step > 0) {
                                j -= step;
                            }
                        } else {
                            segments.splice(i, 1);

                            if (step > 0) {
                                i -= step;
                            }

                            break;
                        }
                    }
                }
                break;

            case 'Image':
                if (
                    yield { punctuation: true, space: false, text: false } // Treat image as punctuation since they have the same behavior.
                ) {
                    segments.splice(i, 1);

                    if (step > 0) {
                        i -= step;
                    }

                    context.deleteResult = DeleteResult.Range;
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
export const forwardDeleteWordSelection = getDeleteWordSelection('forward');

/**
 * @internal
 */
export const backwardDeleteWordSelection = getDeleteWordSelection('backward');
