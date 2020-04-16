import { ServiceManager } from '../ServiceManager';
import { DependencyLocator } from '../../../../mechanisms/DependencyLocator';

test(`Ensure ServiceManager construts`, () => {
    new ServiceManager(new DependencyLocator(), []);
});
