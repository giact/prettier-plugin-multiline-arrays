import {BuiltInParserName, format as prettierFormat, LiteralUnion} from 'prettier';
import {elementsPerLineTrigger, parserName} from './metadata/package-phrases';
import {repoConfig} from './metadata/prettier-config-for-tests';

// const plugins = repoConfig.plugins?.map((entry) => {
//     if (entry === './dist') {
//         return '';
//     } else if (typeof entry === 'string') {
//         return entry;
//         // return entry.replace('./node_modules', join(process.cwd(), 'node_modules'));
//     } else {
//         return entry;
//     }
// }) || ['.'];

console.log({plugins: repoConfig.plugins});

function format(
    code: string,
    parser: LiteralUnion<BuiltInParserName, string> = parserName,
): string {
    return prettierFormat(code, {
        ...repoConfig,
        // parser,
        filepath: 'blah.ts',
        plugins: ['.', ...(repoConfig.plugins ?? [])],
    });
}

const tests: {name: string; code: string; expected?: string; parser?: string; force?: true}[] = [
    {
        name: 'comment at end of argument list with multiline array parser',
        // prettier-ignore
        code: `
            export function hasProperty<ObjectGeneric extends object, KeyGeneric extends PropertyKey>(
                inputObject: ObjectGeneric,
                inputKey: KeyGeneric,
                // @ts-ignore this type signature is actually exactly what I want
            ): inputObject is ObjectGeneric extends Record<KeyGeneric, any>
                ? Extract<ObjectGeneric, {[SubProperty in KeyGeneric]: unknown}>
                : Record<KeyGeneric, unknown> {
                return inputKey in inputObject;
            }
        `,
    },
    {
        name: 'array elements with dots',
        // prettier-ignore
        code: `
            parentDoc[childIndex] = [
                doc.builders.hardlineWithoutBreakParent,
                doc.builders.breakParent,
            ];
        `,
    },
    {
        // caused a max call stack exceeded error once
        name: 'single object element with multiline template',
        // prettier-ignore
        code: `
        
        
        
        
            const stuff = [
            
            
                {
                    innerStuff: \`
                        const myVar: object = {a: 'where', b: 'everywhere'};
                    \`,
                },
            ];
        `,
        // prettier-ignore
        expected: `
            const stuff = [
                {
                    innerStuff: \`
                        const myVar: object = {a: 'where', b: 'everywhere'};
                    \`,
                },
            ];
        `,
    },
    {
        name: 'comment at end of argument list with normal parser',
        // prettier-ignore
        code: `
            export function hasProperty<ObjectGeneric extends object, KeyGeneric extends PropertyKey>(
                inputObject: ObjectGeneric,
                inputKey: KeyGeneric,
                // @ts-ignore this type signature is actually exactly what I want
            ): inputObject is ObjectGeneric extends Record<KeyGeneric, any>
                ? Extract<ObjectGeneric, {[SubProperty in KeyGeneric]: unknown}>
                : Record<KeyGeneric, unknown> {
                return inputKey in inputObject;
            }
        `,
        parser: 'typescript',
    },
    {
        name: 'long function definition with multiline array parser',
        // prettier-ignore
        code: `
            export async function selectFiles(
                inputProperties: OpenDialogProperty[] = [
                    OpenDialogProperty.multiSelections,
                    OpenDialogProperty.openFile,
                    OpenDialogProperty.openDirectory,
                ],
            ): Promise<undefined | string[]> {}
        `,
    },
    {
        name: 'long function definition with normal parser',
        // prettier-ignore
        code: `
            export async function selectFiles(
                inputProperties: OpenDialogProperty[] = [
                    OpenDialogProperty.multiSelections,
                    OpenDialogProperty.openFile,
                    OpenDialogProperty.openDirectory,
                ],
            ): Promise<undefined | string[]> {}
        `,
        parser: 'typescript',
    },
    {
        name: 'comment after end of block with multiline array parser',
        // prettier-ignore
        code: `
            if (thing) {
            }
            // otherwise we are editing currently existing songs
            else {
            }
        `,
    },
    {
        name: 'should still sort imports with normal parser',
        // prettier-ignore
        code: `
            import {notUsed} from 'blah';
            const thingie = ['a', 'b'];
        `,
        expected: `
            const thingie = ['a', 'b'];
        `,
        parser: 'typescript',
        force: true,
    },
    {
        name: 'should still sort imports with multiline parser',
        // prettier-ignore
        code: `
            import {notUsed} from 'blah';
            const thingie = [
                'a',
                'b',
            ];
        `,
        expected: `
            const thingie = [
                'a',
                'b',
            ];
        `,
        force: true,
    },
    {
        name: 'comment after end of block with normal parser',
        // prettier-ignore
        code: `
            if (thing) {
            }
            // otherwise we are editing currently existing songs
            else {
            }
        `,
        parser: 'typescript',
    },
    {
        name: 'deep array call should include trailing comma still',
        // prettier-ignore
        code: `
            expect(createArrayValidator(typeofValidators.boolean)([3, 4])).toBe(false);
        `,
        // prettier-ignore
        expected: `
            expect(
                createArrayValidator(typeofValidators.boolean)([
                    3,
                    4,
                ]),
            ).toBe(false);
        `,
    },
    {
        name: 'not arrays but callbacks with multiline array parser',
        // prettier-ignore
        code: `
            expose({
                versions: process.versions,
                apiRequest: async (
                    details: ApiRequestDetails<ApiRequestType>,
                ): Promise<ApiFullResponse<ApiRequestType>> => {
                    async function waitForResponse(): Promise<ApiFullResponse<ApiRequestType>> {
                        return new Promise((resolve) => {
                            ipcRenderer.once(
                                getApiResponseEventName(details.type, requestId),
                                (event, data) => {
                                    resolve(data);
                                },
                            );
                        });
                    }
                },
            });
        `,
    },
    {
        name: 'not arrays but callbacks with normal parser',
        // prettier-ignore
        code: `
            expose({
                versions: process.versions,
                apiRequest: async (
                    details: ApiRequestDetails<ApiRequestType>,
                ): Promise<ApiFullResponse<ApiRequestType>> => {
                    async function waitForResponse(): Promise<ApiFullResponse<ApiRequestType>> {
                        return new Promise((resolve) => {
                            ipcRenderer.once(
                                getApiResponseEventName(details.type, requestId),
                                (event, data) => {
                                    resolve(data);
                                },
                            );
                        });
                    }
                },
            });
        `,
        parser: 'typescript',
    },
    {
        name: 'function parameters',
        // prettier-ignore
        code: `
            doTheThing('a', 'b', 'c');
        `,
    },
    {
        name: 'config object',
        // prettier-ignore
        code: `
            const config = {
                directories: {
                    output: 'dist',
                    buildResources: 'build-resources',
                },
                files: [
                    'packages/**/dist/**',
                ],
                extraMetadata: {
                    version: viteVersion,
                },
            };
        `,
    },
    {
        name: 'nested single-line objects on multiple lines',
        // prettier-ignore
        code: `
            const nested = [
                {success: true, filePath: ''},
                {success: false, error: 'hello there', filePath: ''},
                {success: false, error: '', filePath: ''},
            ];
        `,
    },
    {
        name: 'nested single-line objects all on one line',
        // prettier-ignore
        code: `
            const nested = [{success: true, filePath: ''}, {success: false, error: 'hello there', filePath: ''}, {success: false, error: '', filePath: ''}];
        `,
        // prettier-ignore
        expected: `
            const nested = [
                {success: true, filePath: ''},
                {success: false, error: 'hello there', filePath: ''},
                {success: false, error: '', filePath: ''},
            ];
        `,
    },
    {
        name: 'nested multi-line objects',
        // prettier-ignore
        code: `
            const nested = [{
                success: true, filePath: ''}, {
                    success: false, error: 'hello there', filePath: ''}, {
                        success: false, error: '', filePath: ''}];
        `,
        // prettier-ignore
        expected: `
            const nested = [
                {
                    success: true,
                    filePath: '',
                },
                {
                    success: false,
                    error: 'hello there',
                    filePath: '',
                },
                {
                    success: false,
                    error: '',
                    filePath: '',
                },
            ];
        `,
    },
    {
        name: 'multiple arrays and even one with a trigger comment',
        // prettier-ignore
        code: `
            const varNoLine = ['a', 'b'];
            const varOneNewLine = [
                'a', 'b',
            ];
            const nestedArray = [
                'q', 'r',
                ['s', 't'],
            ];
            /**
             * ${elementsPerLineTrigger} 2 1
             * 3
             */
            const setNumberPerLine = [
                'a', 'b',
                'c',
                'd',
                'e',
            ];

        `,
        // prettier-ignore
        expected: `
            const varNoLine = [
                'a',
                'b',
            ];
            const varOneNewLine = [
                'a',
                'b',
            ];
            const nestedArray = [
                'q',
                'r',
                [
                    's',
                    't',
                ],
            ];
            /**
             * ${elementsPerLineTrigger} 2 1
             * 3
             */
            const setNumberPerLine = [
                'a', 'b',
                'c',
                'd', 'e',
            ];
        `,
    },
    {
        name: 'array with single line trigger comment',
        // prettier-ignore
        code: `
        // ${elementsPerLineTrigger} 2 1 3
        const setNumberPerLine = [
            'a', 'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
        ];`,
        // prettier-ignore
        expected: `
            // ${elementsPerLineTrigger} 2 1 3
            const setNumberPerLine = [
                'a', 'b',
                'c',
                'd', 'e', 'f',
                'g', 'h',
                'i',
                'j', 'k',
            ];
        `,
    },
    {
        name: 'array with line trigger comment using commas',
        // prettier-ignore
        code: `
        // ${elementsPerLineTrigger} 2, 1, 3
        const setNumberPerLine = [
            'a', 'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
        ];`,
        // prettier-ignore
        expected: `
            // ${elementsPerLineTrigger} 2, 1, 3
            const setNumberPerLine = [
                'a', 'b',
                'c',
                'd', 'e', 'f',
                'g', 'h',
                'i',
                'j', 'k',
            ];
        `,
    },
    {
        name: 'array with JSDoc style trigger comment spread across multiple lines',
        // prettier-ignore
        code: `
            /**
            * ${elementsPerLineTrigger} 2 1
            * 3
            */
            const setNumberPerLine = [
                'a', 'b',
                'c',
                'd',
                'e',
            ];`,
        // prettier-ignore
        expected: `
            /**
             * ${elementsPerLineTrigger} 2 1
             * 3
             */
            const setNumberPerLine = [
                'a', 'b',
                'c',
                'd', 'e',
            ];
        `,
    },
    {
        name: 'nested array',
        // prettier-ignore
        code: `
            const nestedArray = [
                'q', 'r',
                ['s', 't'],
            ];`,
        // prettier-ignore
        expected: `
            const nestedArray = [
                'q',
                'r',
                [
                    's',
                    't',
                ],
            ];
        `,
    },
    {
        name: 'empty array',
        // prettier-ignore
        code: `
            const myVar1: string[] = [];
        `,
    },
    {
        name: 'single element array on one line',
        // prettier-ignore
        code: `let anotherThing: string[] = ['1 1'];`,
        // prettier-ignore
        expected: `
            let anotherThing: string[] = [
                '1 1',
            ];
        `,
    },
    {
        name: 'single element array on multiple lines',
        // prettier-ignore
        code: `
            let anotherThing: string[] = ['1 1'
            ];`,
        // prettier-ignore
        expected: `
            let anotherThing: string[] = [
                '1 1',
            ];
        `,
    },
    {
        name: 'multiple different styled arrays all together',
        // prettier-ignore
        code: `
            const myVar2: string[] = [];
            let anotherThing: string[] = ['1 1'];
            let anotherThing2: string[] = ['1 1'
            ];
            const also: string[] = [
                '2, 1',
                '2, 2',
            ];`,
        // prettier-ignore
        expected: `
            const myVar2: string[] = [];
            let anotherThing: string[] = [
                '1 1',
            ];
            let anotherThing2: string[] = [
                '1 1',
            ];
            const also: string[] = [
                '2, 1',
                '2, 2',
            ];
        `,
    },
    {
        name: 'single element string array with type definition',
        // prettier-ignore
        code: `const myVar: string[] = ['hello'];`,
        // prettier-ignore
        expected: `
            const myVar: string[] = [
                'hello',
            ];
        `,
    },
    {
        name: 'double element string array with type definition',
        // prettier-ignore
        code: `const myVar: string[] = ['hello', 'there'];`,
        // prettier-ignore
        expected: `
            const myVar: string[] = [
                'hello',
                'there',
            ];
        `,
    },
    {
        name: 'non-array string assignment',
        // prettier-ignore
        code: `
            const myVar:string=
            'hello';`,
        // prettier-ignore
        expected: `
            const myVar: string = 'hello';
        `,
    },
    {
        name: 'non-array single line object assignment',
        // prettier-ignore
        code: `
            const myVar: object = {a: 'here', b: 'there'};
        `,
    },
    {
        name: 'non-array multi-line object assignment',
        // prettier-ignore
        code: `
            const myVar: object = {
                a: 'here',
                b: 'there',
            };
        `,
    },
    // the following test caught that path.getValue() can return undefined.
    {
        name: 'array with an earlier function definition',
        // prettier-ignore
        code: `
            function doStuff() {}

            const what = ['a', 'b'];



        `,
        // prettier-ignore
        expected: `
            function doStuff() {}

            const what = [
                'a',
                'b',
            ];
        `,
    },
    {
        name: 'array with function definition inside of it',
        // prettier-ignore
        code: `
            const what = ['a', function doStuff() {}];
        `,
        // prettier-ignore
        expected: `
            const what = [
                'a',
                function doStuff() {},
            ];
        `,
    },
    {
        name: 'original parser with single line object assignment',
        // prettier-ignore
        code: `
            const myVar: object = {a: 'where', b: 'everywhere'};
        `,
        parser: 'typescript',
    },
    {
        name: 'original parser with multi-line object assignment',
        // prettier-ignore
        code: `
            const myVar: object = {
                a: 'where',
                b: 'everywhere',
            };
        `,
        parser: 'typescript',
    },
];

let forced = false;

function removeIndent(input: string): string {
    return input
        .replace(/^\s*\n\s*/, '')
        .replace(/\n {12}/g, '\n')
        .replace(/\n\s+$/, '\n');
}

let allPassed = true;

describe('plugin formatting', () => {
    tests.forEach((test) => {
        const testCallback = () => {
            try {
                const inputCode = removeIndent(test.code);
                const expected = removeIndent(test.expected ?? test.code);
                const formatted = format(inputCode, test.parser);
                expect(formatted).toBe(expected);
                if (formatted !== expected) {
                    allPassed = false;
                }
            } catch (error) {
                allPassed = false;
                throw error;
            }
        };

        if (test.force) {
            forced = true;
            fit(test.name, testCallback);
        } else {
            it(test.name, testCallback);
        }
    });

    if (forced) {
        fit('forced tests should not remain in the code', () => {
            if (allPassed) {
                expect(forced).toBe(false);
            }
        });
    }
});
