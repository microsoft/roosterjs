export type MutableMarker = {
    readonly mutableMark: never;
};

export type NativeTypes = Range | Node | String | Number | Boolean | undefined | null;

export type ReadonlyContentModel<T> = T extends Array<infer U>
    ? ReadonlyArray<ReadonlyContentModel<U>>
    : T extends NativeTypes
    ? T
    : T extends Object
    ? {
          readonly [P in keyof T]: ReadonlyContentModel<T[P]>;
      }
    : T;

export type MutableContentModel<T> = T extends ReadonlyArray<infer U> | Array<infer U>
    ? MutableContentModel<U>[]
    : T extends NativeTypes
    ? T
    : T extends Object
    ? {
          -readonly [P in keyof T]: MutableContentModel<T[P]>;
      } &
          MutableMarker
    : T;
