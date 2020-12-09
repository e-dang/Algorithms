function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

module.exports = {
    sleep,
    getRandom,
};
