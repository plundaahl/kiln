import { TypedIdentifier } from '../TypedIdentifier';

test(`toString correctly strips out Symbol( )`, () => {
    const foo = 'Foo';
    const magicalService = 'MagicalService';
    const i = 'I';

    const identifierA = new TypedIdentifier<any>(foo);
    const identifierB = new TypedIdentifier<any>(magicalService);
    const identifierC = new TypedIdentifier<any>(i);

    expect(identifierA.toString()).toBe(foo);
    expect(identifierB.toString()).toBe(magicalService);
    expect(identifierC.toString()).toBe(i);
});

test(`toString errors if name is empty`, () => {
    expect(() => new TypedIdentifier<any>('')).toThrow();
});
