import { GameServerCore } from '../GameServerCore';

test(`GameServer initializes`, () => {
    expect(() => new GameServerCore({})).not.toThrowError();
});
