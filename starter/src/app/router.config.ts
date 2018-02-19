import { UIRouter, Category, StateDeclaration } from '@uirouter/core';

function logRegisteredStates(registeredstates: StateDeclaration[]) {
    let message: string = '=============  Registered Ui-Router states: ==============\n';

    for (const state of registeredstates) {
        message += 'State : ' + state.name;
        message += ' [';
        message += 'parent: ' + state.parent;
        message += ', url: ' + state.url;
        message += ', abstract: ' + state.abstract;
        message += ']\n';
    }
    message += '=======================================================';
    console.log(message);
}

export function routerConfigFn(router: UIRouter) {
    router.trace.enable(Category.TRANSITION);

    logRegisteredStates(router.stateService.get());
}

export function routerChildConfigFn(router: UIRouter) {
    logRegisteredStates(router.stateService.get());
}
