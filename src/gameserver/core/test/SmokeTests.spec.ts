import { GameServer } from '../GameServer';

test(`GameServer initializes`, () => {
    expect(() => new GameServer({})).not.toThrowError();
});
