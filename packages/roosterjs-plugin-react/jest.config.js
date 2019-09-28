module.exports = {
    transform: {
        'ts(x)?$': 'ts-jest',
    },
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.json',
        },
    },
};
