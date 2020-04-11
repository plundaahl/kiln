import { GameServerCore } from './core';
import {
    IBundle,
} from './core';

export class GameServer {
    constructor(params: {
        bundles?: IBundle[]
    }) {
        const { bundles } = params;
        new GameServerCore({
            bundles,
        });
    }
}
