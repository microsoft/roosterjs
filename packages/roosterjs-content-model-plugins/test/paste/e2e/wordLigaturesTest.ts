import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word ligatures', () => {
    const id = 'word-ligatures';
    const text = 'office affinity efficient offline';
    const disabled = '"liga" 0, "clig" 0, "hlig" 0, "dlig" 0';
    let editor: IEditor;

    beforeEach(() => {
        editor = initEditor(id);
    });

    afterEach(() => {
        editor.dispose();
        document.getElementById(id)?.remove();
    });

    const pasteRun = (style: string, content = text, sheet = '') => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"><style>${sheet}</style></head>
                <body><!--StartFragment--><p><span class="WordRun" style="font-family:Calibri;font-size:24pt;${style}">${content}</span></p>
                <!--EndFragment--></body></html>`,
        });
        return document.getElementById(id)!;
    };

    const textElement = (root: HTMLElement, value = text) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
            if (node.textContent?.includes(value) && node.parentElement) return node.parentElement;
        }
        throw new Error('Pasted text not found: ' + value);
    };

    const width = (element: HTMLElement) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return range.getBoundingClientRect().width;
    };

    const references = () => {
        const element = document.createElement('span');
        element.style.cssText = 'font:24pt Calibri;position:fixed;left:-10000px;white-space:pre';
        element.textContent = text;
        document.body.appendChild(element);
        element.style.fontFeatureSettings = 'normal';
        const normal = width(element);
        element.style.fontFeatureSettings = disabled;
        const none = width(element);
        element.style.fontFeatureSettings = 'normal';
        element.style.fontVariantLigatures = 'none';
        const cssNone = width(element);
        element.remove();
        expect(Math.abs(normal - none)).toBeGreaterThan(1);
        return { normal, none, cssNone };
    };

    const features = (element: HTMLElement) => {
        const result: Record<string, number> = {};
        const value = getComputedStyle(element).fontFeatureSettings;
        for (const match of value.matchAll(/"([^"]{4})"\s*(\d+|on|off)?/g)) {
            result[match[1]] =
                match[2] == 'off' ? 0 : match[2] == 'on' || !match[2] ? 1 : Number(match[2]);
        }
        return result;
    };

    it('preserves disabled Word ligatures and their actual glyph metrics', () => {
        const reference = references();
        const run = textElement(pasteRun('mso-ligatures:none'));

        expect(features(run)).toEqual({ liga: 0, clig: 0, hlig: 0, dlig: 0 });
        expect(getComputedStyle(run).fontVariantLigatures).toBe('normal');
        expect(width(run)).toBeCloseTo(reference.none, 1);
    });

    it('represents supplied standard and contextual ligatures explicitly', () => {
        const run = textElement(pasteRun('mso-ligatures:standardcontextual'));
        expect(features(run)).toEqual({ liga: 1, clig: 1, hlig: 0, dlig: 0 });
    });

    it('restores ligatures in a nested run with its own Word setting', () => {
        const root = pasteRun(
            'mso-ligatures:none',
            'Disabled<span style="mso-ligatures:standardcontextual">Enabled</span>'
        );

        expect(features(textElement(root, 'Disabled')).liga).toBe(0);
        expect(features(textElement(root, 'Enabled')).liga).toBe(1);
    });

    it('keeps explicit standard CSS authoritative', () => {
        const reference = references();
        const run = textElement(
            pasteRun('mso-ligatures:standardcontextual;font-variant-ligatures:none')
        );

        expect(getComputedStyle(run).fontVariantLigatures).toBe('none');
        expect(width(run)).toBeCloseTo(reference.cssNone, 1);
    });

    it('preserves a supplied Word stylesheet declaration', () => {
        const run = textElement(pasteRun('', text, '.WordRun{mso-ligatures:none}'));

        expect(features(run)).toEqual({ liga: 0, clig: 0, hlig: 0, dlig: 0 });
    });

    it('does not mistake a font shorthand reset for explicit ligature CSS', () => {
        const run = textElement(pasteRun('font:24pt Calibri;mso-ligatures:none'));
        expect(features(run)).toEqual({ liga: 0, clig: 0, hlig: 0, dlig: 0 });
    });

    it('preserves native ligatures alongside supplied small caps', () => {
        const run = textElement(pasteRun('font-variant:small-caps;mso-ligatures:none'));
        expect(features(run)).toEqual({ liga: 0, clig: 0, hlig: 0, dlig: 0 });
    });

    it('keeps inherited native ligatures when only small caps change', () => {
        const root = pasteRun(
            'mso-ligatures:none',
            'Parent<span style="font-variant:small-caps">Child</span>'
        );
        expect(features(textElement(root, 'Child'))).toEqual({
            liga: 0,
            clig: 0,
            hlig: 0,
            dlig: 0,
        });
    });

    it('preserves inherited native features for CSS inherit and unset', () => {
        const root = pasteRun(
            'mso-ligatures:none',
            'Parent<span style="font-variant-ligatures:inherit">Inherited</span><span style="font-variant-ligatures:unset">Unset</span>'
        );
        expect(features(textElement(root, 'Inherited'))).toEqual({
            liga: 0,
            clig: 0,
            hlig: 0,
            dlig: 0,
        });
        expect(features(textElement(root, 'Unset'))).toEqual({
            liga: 0,
            clig: 0,
            hlig: 0,
            dlig: 0,
        });
    });

    it('resolves generic CSS inheritance without depending on source DOM nesting', () => {
        const root = pasteRun(
            'font-variant-ligatures:none',
            'Parent<span style="font-variant-ligatures:inherit">Inherited</span><span style="font-variant-ligatures:unset">Unset</span>'
        );
        expect(getComputedStyle(textElement(root, 'Inherited')).fontVariantLigatures).toBe('none');
        expect(getComputedStyle(textElement(root, 'Unset')).fontVariantLigatures).toBe('none');
    });

    it('keeps an explicit ligature component of the font-variant shorthand authoritative', () => {
        const run = textElement(pasteRun('font-variant:none;mso-ligatures:standardcontextual'));
        expect(getComputedStyle(run).fontVariantLigatures).toBe('none');
        expect(features(run).liga).toBeUndefined();
    });

    it('does not guess ligature flags for an unknown Word keyword', () => {
        const run = textElement(pasteRun('mso-ligatures:unknown'));

        expect(getComputedStyle(run).fontVariantLigatures).toBe('normal');
    });

    it('lets inline Word metadata override a Word stylesheet setting', () => {
        const run = textElement(
            pasteRun('mso-ligatures:standardcontextual', text, '.WordRun{mso-ligatures:none}')
        );

        expect(features(run).liga).toBe(1);
    });

    it('keeps standard stylesheet CSS authoritative over Word metadata', () => {
        const run = textElement(
            pasteRun(
                'mso-ligatures:standardcontextual',
                text,
                '.WordRun{font-variant-ligatures:none}'
            )
        );

        expect(getComputedStyle(run).fontVariantLigatures).toBe('none');
    });

    it('changes contextual ligatures without modifying contextual alternates', () => {
        const run = textElement(
            pasteRun("mso-ligatures:contextual;font-feature-settings:'calt' 0")
        );

        expect(features(run)).toEqual({ liga: 0, clig: 1, hlig: 0, dlig: 0, calt: 0 });
    });

    it('does not treat normal extra feature settings as resetting native variants', () => {
        const run = textElement(pasteRun('mso-ligatures:none;font-feature-settings:normal'));

        expect(features(run)).toEqual({ liga: 0, clig: 0, hlig: 0, dlig: 0 });
    });

    it('lets an explicit standard feature override the corresponding native flag', () => {
        const run = textElement(pasteRun("mso-ligatures:none;font-feature-settings:'liga' 1"));

        expect(features(run)).toEqual({ liga: 1, clig: 0, hlig: 0, dlig: 0 });
    });

    it('disables native ligatures with spacing and restores them at zero spacing', () => {
        const root = pasteRun(
            'mso-ligatures:all;letter-spacing:1pt',
            'Spaced<span style="letter-spacing:0px">Zero</span><span style="letter-spacing:-1pt">Condensed</span>'
        );

        expect(features(textElement(root, 'Spaced'))).toEqual({
            liga: 0,
            clig: 0,
            hlig: 0,
            dlig: 0,
        });
        expect(features(textElement(root, 'Zero'))).toEqual({ liga: 1, clig: 1, hlig: 1, dlig: 1 });
        expect(features(textElement(root, 'Condensed'))).toEqual({
            liga: 0,
            clig: 0,
            hlig: 0,
            dlig: 0,
        });
    });

    it('preserves unrelated inherited features while replacing inherited ligature flags', () => {
        const root = pasteRun(
            "mso-ligatures:none;font-feature-settings:'calt' 0, 'liga' 0, 'ss01' 1",
            'Disabled<span style="mso-ligatures:standardcontextual">Enabled</span>'
        );

        expect(features(textElement(root, 'Enabled'))).toEqual({
            liga: 1,
            clig: 1,
            hlig: 0,
            dlig: 0,
            calt: 0,
            ss01: 1,
        });
    });
});
