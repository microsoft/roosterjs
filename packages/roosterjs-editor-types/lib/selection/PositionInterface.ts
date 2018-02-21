interface PositionInterface {
    readonly node: Node;
    readonly offset: number;
    readonly isAtEnd: boolean;
    normalize: () => PositionInterface;
    equalTo: (pos: PositionInterface) => boolean;
    isAfter: (pos: PositionInterface) => boolean;
}

export default PositionInterface;
