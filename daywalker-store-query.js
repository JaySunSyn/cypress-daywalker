
function byTag(store, tagName) {
    return store.data.tags[tagName];
}

function byClass(store, classes) {
    // .foo.moo => ["", "foo", "moo"]
    const classList = classes.split('.');
    classList.shift();

    let firstClassInstances = store.classes[classList.shift()];
    return classList.map(cls => {
        return firstClassInstances.filter(instance => instances.includes(instance));
    });
};

module.exports = {
    byTag,
    byClass,
}