import { ContentModelDocument, ContentModelEntity } from 'roosterjs-content-model-types';
import { Preset } from './Preset';

function createMathEntity(latex: string, id: string): ContentModelEntity {
    const wrapper = document.createElement('div');

    wrapper.setAttribute('data-latex', latex);
    // The MathPlugin re-renders the content from data-latex when this entity appears,
    // but we also show the raw LaTeX as a fallback in case the plugin is turned off.
    wrapper.textContent = latex;

    return {
        blockType: 'Entity',
        segmentType: 'Entity',
        format: {},
        entityFormat: {
            entityType: 'Math',
            isReadonly: true,
            id,
        },
        wrapper,
    };
}

function createMathPreset(buttonName: string, id: string, latex: string[]): Preset {
    const content: ContentModelDocument = {
        blockGroupType: 'Document',
        blocks: [
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: buttonName,
                        format: { fontWeight: 'bold' },
                    },
                ],
                format: {},
            },
            ...latex.map((tex, index) => createMathEntity(tex, `${id}_${index}`)),
            {
                blockType: 'Paragraph',
                segments: [{ segmentType: 'Br', format: {} }],
                format: {},
            },
        ],
        format: {},
    };

    return { buttonName, id, content };
}

export const mathQuadratic = createMathPreset('Math: Quadratic Formula', 'mathQuadratic', [
    'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
]);

export const mathEuler = createMathPreset('Math: Euler\u2019s Identity', 'mathEuler', [
    'e^{i\\pi} + 1 = 0',
]);

export const mathIntegral = createMathPreset('Math: Gaussian Integral', 'mathIntegral', [
    '\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}',
]);

export const mathSummation = createMathPreset('Math: Basel Problem', 'mathSummation', [
    '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}',
]);

export const mathMatrix = createMathPreset('Math: Matrix', 'mathMatrix', [
    'A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}',
]);

export const mathShowcase = createMathPreset('Math: Showcase', 'mathShowcase', [
    'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    'e^{i\\pi} + 1 = 0',
    '\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}',
    '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}',
]);
