import { DOMCreator, EditorCore, Snapshot } from 'roosterjs-content-model-types';
import { restoreSnapshotHTML } from '../../../lib/coreApi/restoreUndoSnapshot/restoreSnapshotHTML';
import { wrap } from 'roosterjs-content-model-dom';

const domCreator: DOMCreator = {
    htmlToDOM: (html: string) => new DOMParser().parseFromString(html, 'text/html'),
};

describe('restoreSnapshotHTML', () => {
    let core: EditorCore;
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');

        core = {
            physicalRoot: div,
            logicalRoot: div,
            entity: {
                entityMap: {},
            },
            domCreator: domCreator,
        } as any;
    });

    it('Empty HTML', () => {
        const snapshot: Snapshot = {
            html: '',
        } as any;

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe('');
    });

    it('Simple HTML, no entity', () => {
        const snapshot: Snapshot = {
            html: '<div>test1</div><div><br></div><div>test2</div>',
        } as any;

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe('<div>test1</div><div><br></div><div>test2</div>');
    });

    it('Simple HTML, no entity, with trustHTMLHandler', () => {
        const snapshot: Snapshot = {
            html: '<div>test1</div>',
        } as any;

        const htmlToDOMSpy = spyOn(core.domCreator, 'htmlToDOM').and.callFake((html: string) =>
            new DOMParser().parseFromString(html + html, 'text/html')
        );

        restoreSnapshotHTML(core, snapshot);

        expect(htmlToDOMSpy).toHaveBeenCalledWith('<div>test1</div>');
        expect(div.innerHTML).toBe('<div>test1</div><div>test1</div>');
    });

    it('HTML with block entity at root level, cannot match', () => {
        const snapshot: Snapshot = {
            html: '<div>test1</div><div class="_Entity _EType_A _EId_B"><br></div><div>test2</div>',
        } as any;

        const entityWrapper = document.createElement('DIV');

        entityWrapper.id = 'div2';
        core.entity.entityMap.C = {
            element: entityWrapper,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div class="_Entity _EType_A _EId_B"><br></div><div>test2</div>'
        );
    });

    it('HTML with block entity at root level, can match', () => {
        const snapshot: Snapshot = {
            html: '<div>test1</div><div class="_Entity _EType_A _EId_B"><br></div><div>test2</div>',
        } as any;

        const entityWrapper = document.createElement('DIV');

        entityWrapper.id = 'div2';
        core.entity.entityMap.B = {
            element: entityWrapper,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe('<div>test1</div><div id="div2"></div><div>test2</div>');
        expect(div.childNodes[1]).toBe(entityWrapper);
    });

    it('HTML with block entity at root level, entity is already in editor', () => {
        const snapshot: Snapshot = {
            html: '<div>test1</div><div class="_Entity _EType_A _EId_B"><br></div><div>test2</div>',
        } as any;

        const entityWrapper = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper);
        div.appendChild(document.createTextNode('test2'));

        entityWrapper.id = 'div2';
        core.entity.entityMap.B = {
            element: entityWrapper,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe('<div>test1</div><div id="div2"></div><div>test2</div>');
        expect(div.childNodes[1]).toBe(entityWrapper);
    });

    it('HTML with block entity at root level, cannot persist, entity is already in editor', () => {
        const snapshot: Snapshot = {
            html: '<div>test1</div><div class="_Entity _EType_A _EId_B"><br></div><div>test2</div>',
        } as any;

        const entityWrapper = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper);
        div.appendChild(document.createTextNode('test2'));

        entityWrapper.id = 'div2';
        core.entity.entityMap.B = {
            element: entityWrapper,
            canPersist: false,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div class="_Entity _EType_A _EId_B"><br></div><div>test2</div>'
        );
        expect(div.childNodes[1]).not.toBe(entityWrapper);
    });

    it('HTML with double block entity at root level, entity is already in editor in the same order', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div>test2</div><div class="_Entity _EType_A _EId_B2"><br></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(entityWrapper2);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div>test2</div><div id="divB"></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the same order, continuous in original DOM', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div>test2</div><div class="_Entity _EType_A _EId_B2"><br></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper1);
        div.appendChild(entityWrapper2);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div>test2</div><div id="divB"></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the same order, continuous in snapshot', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div class="_Entity _EType_A _EId_B2"><br></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(entityWrapper2);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div id="divB"></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[2]).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div>test2</div><div class="_Entity _EType_A _EId_B2"><br></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper2);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div>test2</div><div id="divB"></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in original DOM', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div>test2</div><div class="_Entity _EType_A _EId_B2"><br></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper2);
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div>test2</div><div id="divB"></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in snapshot', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div class="_Entity _EType_A _EId_B2"><br></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper2);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div id="divB"></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[2]).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in both', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div class="_Entity _EType_A _EId_B2"><br></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper2);
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div id="divB"></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[2]).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in both, no other nodes', () => {
        const snapshot: Snapshot = {
            html:
                '<div class="_Entity _EType_A _EId_B1"><br></div><div class="_Entity _EType_A _EId_B2"><br></div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(entityWrapper2);
        div.appendChild(entityWrapper1);

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe('<div id="divA"></div><div id="divB"></div>');
        expect(div.childNodes[0]).toBe(entityWrapper1);
        expect(div.childNodes[1]).toBe(entityWrapper2);
    });

    it('HTML with inline entities', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div><span class="_Entity _EType_A _EId_B1"><br></span></div><div>test2</div>',
        } as any;

        const entityWrapper = document.createElement('span');

        entityWrapper.id = 'spanA';

        core.entity.entityMap.B1 = {
            element: entityWrapper,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div><span id="spanA"></span></div><div>test2</div>'
        );
        expect(div.childNodes[1].firstChild).toBe(entityWrapper);
    });

    it('HTML with inline entities, original entity node is in editor', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div><span class="_Entity _EType_A _EId_B1"><br></span></div><div>test2</div>',
        } as any;

        const entityWrapper = document.createElement('span');

        entityWrapper.id = 'spanA';

        core.entity.entityMap.B1 = {
            element: entityWrapper,
            canPersist: true,
        };

        div.appendChild(entityWrapper);

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div><span id="spanA"></span></div><div>test2</div>'
        );
        expect(div.childNodes[1].firstChild).toBe(entityWrapper);
    });

    it('HTML with block entity at root level, cannot match | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html: '<div>test1</div><div class="_Entity _EType_A _EId_B"><br></div><div>test2</div>',
        } as any;

        const entityWrapper = document.createElement('DIV');
        wrapInContainer(entityWrapper);

        entityWrapper.id = 'div2';
        core.entity.entityMap.C = {
            element: entityWrapper,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div class="_Entity _EType_A _EId_B"><br></div><div>test2</div>'
        );
    });

    it('HTML with block entity at root level, can match | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B"><br></div></div><div>test2</div>',
        } as any;

        const entityWrapper = document.createElement('DIV');
        const container = wrapInContainer(entityWrapper);

        entityWrapper.id = 'div2';
        core.entity.entityMap.B = {
            element: entityWrapper,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div class="_E_EBlockEntityContainer"><div id="div2"></div></div><div>test2</div>'
        );
        expect(div.childNodes[1]).toBe(container);
        expect(div.childNodes[1].firstChild).toBe(entityWrapper);
    });

    it('HTML with block entity at root level, entity is already in editor | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B"><br></div></div><div>test2</div>',
        } as any;

        const entityWrapper = document.createElement('DIV');
        const container = wrapInContainer(entityWrapper);

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(container);
        div.appendChild(document.createTextNode('test2'));

        entityWrapper.id = 'div2';
        core.entity.entityMap.B = {
            element: entityWrapper,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div class="_E_EBlockEntityContainer"><div id="div2"></div></div><div>test2</div>'
        );
        expect(div.childNodes[1]).toBe(container);
        expect(div.childNodes[1].firstChild).toBe(entityWrapper);
    });

    it('HTML with double block entity at root level, entity is already in editor in the same order | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B1"><br></div></div><div>test2</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const container1 = wrapInContainer(entityWrapper1);
        const entityWrapper2 = document.createElement('DIV');
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(container1);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(container2);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div class="_E_EBlockEntityContainer"><div id="divA"></div></div><div>test2</div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(container1);
        expect(div.childNodes[1].firstChild).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(container2);
        expect(div.childNodes[3].firstChild).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the same order, continuous in original DOM | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B1"><br></div></div><div>test2</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');
        const container1 = wrapInContainer(entityWrapper1);
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(container1);
        div.appendChild(container2);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div class="_E_EBlockEntityContainer"><div id="divA"></div></div><div>test2</div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(container1);
        expect(div.childNodes[1].firstChild).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(container2);
        expect(div.childNodes[3].firstChild).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the same order, continuous in snapshot | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B1"><br></div></div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');
        const container1 = wrapInContainer(entityWrapper1);
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(container1);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(container2);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div class="_E_EBlockEntityContainer"><div id="divA"></div></div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(container1);
        expect(div.childNodes[1].firstChild).toBe(entityWrapper1);
        expect(div.childNodes[2]).toBe(container2);
        expect(div.childNodes[2].firstChild).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B1"><br></div></div><div>test2</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');
        const container1 = wrapInContainer(entityWrapper1);
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(container2);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(container1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div class="_E_EBlockEntityContainer"><div id="divA"></div></div><div>test2</div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(container1);
        expect(div.childNodes[1].firstChild).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(container2);
        expect(div.childNodes[3].firstChild).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in original DOM | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B1"><br></div></div><div>test2</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');
        const container1 = wrapInContainer(entityWrapper1);
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(container2);
        div.appendChild(container1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div class="_E_EBlockEntityContainer"><div id="divA"></div></div><div>test2</div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(container1);
        expect(div.childNodes[1].firstChild).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(container2);
        expect(div.childNodes[3].firstChild).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in snapshot | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B1"><br></div></div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');
        const container1 = wrapInContainer(entityWrapper1);
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(container2);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(container1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div class="_E_EBlockEntityContainer"><div id="divA"></div></div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(container1);
        expect(div.childNodes[1].firstChild).toBe(entityWrapper1);
        expect(div.childNodes[2]).toBe(container2);
        expect(div.childNodes[2].firstChild).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in both | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B1"><br></div></div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');
        const container1 = wrapInContainer(entityWrapper1);
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(container2);
        div.appendChild(container1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div class="_E_EBlockEntityContainer"><div id="divA"></div></div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(container1);
        expect(div.childNodes[2]).toBe(container2);
        expect(div.childNodes[1].firstChild).toBe(entityWrapper1);
        expect(div.childNodes[2].firstChild).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in both, no other nodes | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B1"><br></div></div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');
        const container1 = wrapInContainer(entityWrapper1);
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(container2);
        div.appendChild(container1);

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div class="_E_EBlockEntityContainer"><div id="divA"></div></div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div>'
        );
        expect(div.childNodes[0]).toBe(container1);
        expect(div.childNodes[1]).toBe(container2);
        expect(div.childNodes[0].firstChild).toBe(entityWrapper1);
        expect(div.childNodes[1].firstChild).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the same order | blockEntityContainer and non container', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div>test2</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(container2);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div>test2</div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(container2);
        expect(div.childNodes[3].firstChild).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the same order, continuous in original DOM | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div>test2</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper1);
        div.appendChild(container2);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div>test2</div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(container2);
        expect(div.childNodes[3].firstChild).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the same order, continuous in snapshot | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(container2);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[2]).toBe(container2);
        expect(div.childNodes[2].firstChild).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div>test2</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(container2);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div>test2</div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(container2);
        expect(div.childNodes[3].firstChild).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in original DOM | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div>test2</div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(container2);
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div>test2</div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(container2);
        expect(div.childNodes[3].firstChild).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in snapshot | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(container2);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[2]).toBe(container2);
        expect(div.childNodes[2].firstChild).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in both | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(container2);
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[2]).toBe(container2);
        expect(div.childNodes[2].firstChild).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in both, no other nodes | blockEntityContainer', () => {
        const snapshot: Snapshot = {
            html:
                '<div class="_Entity _EType_A _EId_B1"><br></div><div class="_E_EBlockEntityContainer"><div class="_Entity _EType_A _EId_B2"><br></div></div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');
        const container2 = wrapInContainer(entityWrapper2);

        div.appendChild(container2);
        div.appendChild(entityWrapper1);

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
            canPersist: true,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
            canPersist: true,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div id="divA"></div><div class="_E_EBlockEntityContainer"><div id="divB"></div></div>'
        );
        expect(div.childNodes[0]).toBe(entityWrapper1);
        expect(div.childNodes[1]).toBe(container2);
        expect(div.childNodes[1].firstChild).toBe(entityWrapper2);
    });
});

function wrapInContainer(entity: HTMLElement) {
    const el = wrap(entity.ownerDocument, entity, 'div');
    el.className = '_E_EBlockEntityContainer';
    return el;
}
