import type { IdGenerator } from 'roosterjs-content-model-types';

export class IdGeneratorImpl implements IdGenerator {
    private static prefixNum = 0;
    private nextId = 0;

    constructor(private prefix: string) {
        IdGeneratorImpl.prefixNum++;
    }

    generate() {
        return `${this.prefix}_${IdGeneratorImpl.prefixNum}_${this.nextId++}`;
    }
}
