module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files
    },
    transformIgnorePatterns: ['/node_modules/(?!(axios)/)'],
    moduleNameMapper: {
        '^axios$': require.resolve('axios'),
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
