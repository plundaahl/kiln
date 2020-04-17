import { DependencyLocator } from '../../../../mechanisms/DependencyLocator';
import { ServerManager } from '..';

test(`Ensure ServerManager constructs`, () => {
    new ServerManager(
        new DependencyLocator(),
        [],
    );
});
