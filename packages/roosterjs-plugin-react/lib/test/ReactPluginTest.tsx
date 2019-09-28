import { test } from 'shelljs';

describe('ReactPlugin', () => {
    it('Does nothing when there is no mountpoint in the DOM');

    describe('when a new mountpoint is added to the document', () => {
        it('renders the component into the mountpoint');
        it('renders updates from the component into the mountpoint');
    });

    describe('when a mountpoint is moved from one part of the document to another', () => {
        it('renders the component into the new mountpoint');
        it('Uses the same component instance, preserving state');
    });

    describe('when a duplicate mountpoint is copied and pasted into the document', () => {
        it('creates a new ID for the mountpoint and sets it on the document');
        it('recognizes the original mountpoint, even if it is 2nd in document order');
        it('maintains component state on the original mountpoint');
        it('initializes a new component with fresh state');
        describe('when the copied component has sharable state', () => {
            it('initializes the copy of the component with the sharable state of the original');
        });
    });

    describe('when a component has sharable state', () => {
        it('initializes the component with that sharable state');
        it(
            'updates the serialzied sharable state on the mountpoint when the component asks it to update'
        );
    });

    describe('when a mountpoint is removed entirely from the document', () => {
        it('unmounts the react component from the shadow root');
    });

    describe('in darkmode', () => {
        it('transforms elements into their darkmode colours');
        it('transforms updates to elements into their darkmode colours');
    });
});
