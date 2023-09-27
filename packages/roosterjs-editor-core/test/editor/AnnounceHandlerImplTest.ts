import AnnounceHandlerImpl from '../../lib/editor/AnnounceHandlerImpl';

describe('AnnounceHandlerImpl', () => {
    let announceHandler: AnnounceHandlerImpl;

    beforeEach(() => {
        announceHandler = new AnnounceHandlerImpl(document);
    });

    afterEach(() => {
        announceHandler.dispose();
    });

    describe('announce', () => {
        it('should announce the provided text', () => {
            const announceData = {
                text: 'Announcement text',
                defaultStrings: undefined,
                formatStrings: [],
            } as any;
            announceHandler.announce(announceData);

            const ariaLiveElement = announceHandler.getAriaLiveElement();
            expect(ariaLiveElement?.textContent).toEqual(announceData.text);
        });

        it('should format and announce the provided text', () => {
            const announceData = {
                text: 'Hello, {0}!',
                defaultStrings: undefined,
                formatStrings: ['World'],
            } as any;
            announceHandler.announce(announceData);

            const ariaLiveElement = announceHandler.getAriaLiveElement();
            expect(ariaLiveElement?.textContent).toEqual('Hello, World!');
        });

        it('should format and announce the provided text 2', () => {
            const announceData = {
                text: '{0}, {1}!',
                defaultStrings: undefined,
                formatStrings: ['Hello', 'World'],
            } as any;
            announceHandler.announce(announceData);

            const ariaLiveElement = announceHandler.getAriaLiveElement();
            expect(ariaLiveElement?.textContent).toEqual('Hello, World!');
        });
    });

    describe('dispose', () => {
        it('should dispose the ariaLiveElement', () => {
            announceHandler.dispose();
            expect(announceHandler.getAriaLiveElement()).toBeUndefined();
        });
    });
});
