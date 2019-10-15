import removeReactTagsOnExtractContent from '../util/removeReactTagsOnExtractContent';
import {
    REACT_COMPONENT_DATA_KEY,
    REACT_COMPONENT_INSTANCE_ID,
    REACT_COMPONENT_SHARABLE_STATE,
} from '../util/constants';

const encodeAttributeValue = (s: string): string => {
    const encoderDiv = document.createElement('DIV');
    encoderDiv.setAttribute('a', s);
    const attrVal = encoderDiv.outerHTML
        .replace('<div a="', '')
        .replace('"></div>', '')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/`/g, '&#96;')
        .replace(/"/g, '&#34;')
        .replace(/'/g, '&#39;');
    return attrVal;
};

describe('removeReactTagsOnExtractContent', () => {
    const runQuotedTests = (q: string) => {
        it(`removes ${REACT_COMPONENT_DATA_KEY} from an HTML string`, () => {
            const out = removeReactTagsOnExtractContent(
                `
                <div attr=${q}something${q} otherattr=${q}something-else${q}>
                    <span ${REACT_COMPONENT_DATA_KEY}=${q}my-component${q}></span>
                </div>
                `
            );

            expect(out).toBe(
                //tslint:disable-next-line:no-multiline-string
                `
                <div attr=${q}something${q} otherattr=${q}something-else${q}>
                    <span ></span>
                </div>
                `
            );
        });

        it(`removes ${REACT_COMPONENT_INSTANCE_ID} from an HTML string`, () => {
            const out = removeReactTagsOnExtractContent(
                `
                <div attr=${q}something${q} otherattr=${q}something-else${q}>
                    <span ${REACT_COMPONENT_INSTANCE_ID}=${q}1${q}></span>
                </div>
                `
            );

            expect(out).toBe(
                //tslint:disable-next-line:no-multiline-string
                `
                <div attr=${q}something${q} otherattr=${q}something-else${q}>
                    <span ></span>
                </div>
                `
            );
        });

        it(`removes ${REACT_COMPONENT_SHARABLE_STATE} from an HTML string`, () => {
            const out = removeReactTagsOnExtractContent(
                `
                <div attr=${q}something${q} otherattr=${q}something-else${q}>
                    <span ${REACT_COMPONENT_SHARABLE_STATE}=${q}SERIALIZED_STATE${q}></span>
                </div>
                `
            );

            expect(out).toBe(
                //tslint:disable-next-line:no-multiline-string
                `
                <div attr=${q}something${q} otherattr=${q}something-else${q}>
                    <span ></span>
                </div>
                `
            );
        });

        it(`removes ${REACT_COMPONENT_SHARABLE_STATE} from an HTML string, even if it has escaped inner content`, () => {
            const out = removeReactTagsOnExtractContent(
                `
                <div attr=${q}something${q} otherattr=${q}something-else${q}>
                    <span ${REACT_COMPONENT_SHARABLE_STATE}=${q}${encodeAttributeValue(
                    `<span>${q}HelloThisisInAnAttr"'\``
                )}${q}></span>
                </div>
                `
            );

            expect(out).toBe(
                //tslint:disable-next-line:no-multiline-string
                `
                <div attr=${q}something${q} otherattr=${q}something-else${q}>
                    <span ></span>
                </div>
                `
            );
        });
    };

    describe('with double quoted attributes', () => {
        runQuotedTests('"');
    });

    describe('with single-quoted attributes', () => {
        runQuotedTests("'");
    });

    describe('with no-quote attributes', () => {
        it(`removes ${REACT_COMPONENT_DATA_KEY} from an HTML string`, () => {
            const out = removeReactTagsOnExtractContent(
                `
                <div attr=something otherattr=something-else>
                    <span ${REACT_COMPONENT_DATA_KEY}=my-component></span>
                </div>
                `
            );

            expect(out).toBe(
                //tslint:disable-next-line:no-multiline-string
                `
                <div attr=something otherattr=something-else>
                    <span ></span>
                </div>
                `
            );
        });

        it(`removes ${REACT_COMPONENT_INSTANCE_ID} from an HTML string`, () => {
            const out = removeReactTagsOnExtractContent(
                `
                <div attr=something otherattr=something-else>
                    <span ${REACT_COMPONENT_INSTANCE_ID}=1></span>
                </div>
                `
            );

            expect(out).toBe(
                //tslint:disable-next-line:no-multiline-string
                `
                <div attr=something otherattr=something-else>
                    <span ></span>
                </div>
                `
            );
        });

        it(`removes ${REACT_COMPONENT_SHARABLE_STATE} from an HTML string`, () => {
            const out = removeReactTagsOnExtractContent(
                `
                <div attr=something otherattr=something-else>
                    <span ${REACT_COMPONENT_SHARABLE_STATE}=SERIALIZED_STATE></span>
                </div>
                `
            );

            expect(out).toBe(
                //tslint:disable-next-line:no-multiline-string
                `
                <div attr=something otherattr=something-else>
                    <span ></span>
                </div>
                `
            );
        });

        it(`removes ${REACT_COMPONENT_SHARABLE_STATE} from an HTML string, even if it has escaped inner content`, () => {
            const out = removeReactTagsOnExtractContent(
                `
                <div attr=something otherattr=something-else>
                    <span ${REACT_COMPONENT_SHARABLE_STATE}=${encodeAttributeValue(
                    '<span>\'"HelloThisisInAnAttr"`'
                )}></span>
                </div>
                `
            );

            expect(out).toBe(
                //tslint:disable-next-line:no-multiline-string
                `
                <div attr=something otherattr=something-else>
                    <span ></span>
                </div>
                `
            );
        });

        const SPACE_CHARS = ['\u0020', '\u0009', '\u000A', '\u000C', '\u000D'];
        for (let divider of SPACE_CHARS) {
            it(`delimits on ${encodeAttributeValue(divider)}`, () => {
                const out = removeReactTagsOnExtractContent(
                    `
                    <div attr=something otherattr=something-else>
                        <span ${REACT_COMPONENT_SHARABLE_STATE}=asd${divider}next-prop=1></span>
                    </div>
                    `
                );

                expect(out).toBe(
                    //tslint:disable-next-line:no-multiline-string
                    `
                    <div attr=something otherattr=something-else>
                        <span ${divider}next-prop=1></span>
                    </div>
                    `
                );
            });
        }
    });
});
