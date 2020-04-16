import { DependencyLocator } from '../../../../mechanisms/DependencyLocator';
import { TypedIdentifier } from '../../../../mechanisms/TypedIdentifier';
import { AgentLayerManager } from '../AgentLayerManager';
import { IAgentManager } from '../IAgentManager';
import { IPostWorldUpdateListener } from '../IPostWorldUpdateListener';
import { IPreWorldUpdateListener } from '../IPreWorldUpdateListener';

const locator = new DependencyLocator();
const agentLayerManager = new AgentLayerManager(locator, ['core.System']);

const preWorldUpdateListenerA: IPreWorldUpdateListener = { onPreWorldUpdate: () => { } };
const preWorldUpdateListenerB: IPreWorldUpdateListener = { onPreWorldUpdate: () => { } };
const preWorldUpdateListenerC: IPreWorldUpdateListener = { onPreWorldUpdate: () => { } };
const postWorldUpdateListenerA: IPostWorldUpdateListener = { onPostWorldUpdate: () => { } };
const postWorldUpdateListenerB: IPostWorldUpdateListener = { onPostWorldUpdate: () => { } };

const preWULIdentifierA = new TypedIdentifier<IPreWorldUpdateListener>('preWorldUpdatelistenerA');
const preWULIdentifierB = new TypedIdentifier<IPreWorldUpdateListener>('preWorldUpdatelistenerB');
const preWULIdentifierC = new TypedIdentifier<IPreWorldUpdateListener>('preWorldUpdatelistenerC');
const postWULIdentifierA = new TypedIdentifier<IPostWorldUpdateListener>('postWorldUpdatelistenerA');
const postWULIdentifierB = new TypedIdentifier<IPostWorldUpdateListener>('postWorldUpdatelistenerB');

beforeAll(() => {
    agentLayerManager.registerModule(() => preWorldUpdateListenerA, preWULIdentifierA);
    agentLayerManager.registerModule(() => preWorldUpdateListenerB, preWULIdentifierB);
    agentLayerManager.registerModule(() => preWorldUpdateListenerC, preWULIdentifierC);
    agentLayerManager.registerModule(() => postWorldUpdateListenerA, postWULIdentifierA);
    agentLayerManager.registerModule(() => postWorldUpdateListenerB, postWULIdentifierB);
    agentLayerManager.initModules();
});


describe(`getPreWorldUpdateListeners`, () => {
    test(`Should return all modules that implement #onPreWorldUpdate`, () => {
        const preWorldUpdateListeners = agentLayerManager.getPreWorldUpdateListeners();
        expect(preWorldUpdateListeners).toContain(preWorldUpdateListenerA);
        expect(preWorldUpdateListeners).toContain(preWorldUpdateListenerB);
        expect(preWorldUpdateListeners).toContain(preWorldUpdateListenerC);
    });

    test(`Should omit all modules that do not implement #onPostWorldUpdate`, () => {
        const preWorldUpdateListeners = agentLayerManager.getPreWorldUpdateListeners();
        expect(preWorldUpdateListeners).not.toContain(postWorldUpdateListenerA);
        expect(preWorldUpdateListeners).not.toContain(postWorldUpdateListenerB);
    });
});

describe(`getPostWorldUpdateListeners`, () => {
    test(`Should return all modules that implement #onPostWorldUpdate`, () => {
        const postWorldUpdateListeners = agentLayerManager.getPostWorldUpdateListeners();
        expect(postWorldUpdateListeners).toContain(postWorldUpdateListenerA);
        expect(postWorldUpdateListeners).toContain(postWorldUpdateListenerB);
    });

    test(`Should omit all modules that do not implement #onPreWorldUpdate`, () => {
        const postWorldUpdateListeners = agentLayerManager.getPostWorldUpdateListeners();
        expect(postWorldUpdateListeners).not.toContain(preWorldUpdateListenerA);
        expect(postWorldUpdateListeners).not.toContain(preWorldUpdateListenerB);
        expect(postWorldUpdateListeners).not.toContain(preWorldUpdateListenerC);
    });
});
