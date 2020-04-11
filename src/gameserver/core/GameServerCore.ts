import {
    Framework, IBundle,
} from './framework';

export class GameServerCore {
    private readonly framework: Framework;

    constructor(params: {
        bundles?: IBundle[]
    }) {
        this.framework = new Framework({
            bundles: [
                // later: add in core.bundles
                ...(params.bundles || [])
            ],
        });
    }
}
