import * as textMutationObserver from '../../../lib/corePlugin/cache/textMutationObserver';
import { DomIndexer, TextMutationObserver } from 'roosterjs-content-model-types';
import { DomIndexerImpl } from '../../../lib/corePlugin/cache/domIndexerImpl';

describe('TextMutationObserverImpl', () => {
    let domIndexer: DomIndexer;
    let onSkipMutation: jasmine.Spy;
    let observer: TextMutationObserver;

    beforeEach(() => {
        domIndexer = new DomIndexerImpl();
        onSkipMutation = jasmine.createSpy('onSkipMutation');
    });

    afterEach(() => {
        observer?.stopObserving();
    });

    it('init', () => {
        const div = document.createElement('div');
        const onMutation = jasmine.createSpy('onMutation');
        textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        expect(onMutation).not.toHaveBeenCalled();
    });

    it('not text change', async () => {
        const div = document.createElement('div');
        const onMutation = jasmine.createSpy('onMutation');

        observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        div.appendChild(document.createElement('br'));

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(1);
        expect(onMutation).toHaveBeenCalledWith(false);
    });

    it('text change', async () => {
        const div = document.createElement('div');
        const text = document.createTextNode('test');

        div.appendChild(text);

        const onMutation = jasmine.createSpy('onMutation');
        const observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        text.nodeValue = '1';

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(1);
        expect(onMutation).toHaveBeenCalledWith(true);
    });

    it('text change in deeper node', async () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        const text = document.createTextNode('test');

        span.appendChild(text);
        div.appendChild(span);

        const onMutation = jasmine.createSpy('onMutation');
        const observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        text.nodeValue = '1';

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(1);
        expect(onMutation).toHaveBeenCalledWith(true);
    });

    it('text and non-text change', async () => {
        const div = document.createElement('div');
        const text = document.createTextNode('test');

        div.appendChild(text);

        const onMutation = jasmine.createSpy('onMutation');
        const observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        text.nodeValue = '1';
        div.appendChild(document.createElement('br'));

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(1);
        expect(onMutation).toHaveBeenCalledWith(false);

        observer.stopObserving();
    });

    it('flush mutation', async () => {
        const div = document.createElement('div');
        const text = document.createTextNode('test');

        div.appendChild(text);

        const onMutation = jasmine.createSpy('onMutation');
        const observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        text.nodeValue = '1';
        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledWith(true);
    });

    it('flush mutation without change', async () => {
        const div = document.createElement('div');
        const text = document.createTextNode('test');

        div.appendChild(text);

        const onMutation = jasmine.createSpy('onMutation');
        const observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();
        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).not.toHaveBeenCalled();
    });
});
