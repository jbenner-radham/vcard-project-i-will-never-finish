'use strict';

module.exports = function demongoify(model = {}) {
    const document = model._doc || {};
    const isPublicProperty = (key) => !key.startsWith('_');
    const reducer = (accumulator, key) => ({...accumulator, [key]: document[key]});

    return Object.keys(document).filter(isPublicProperty).reduce(reducer, {});
};
