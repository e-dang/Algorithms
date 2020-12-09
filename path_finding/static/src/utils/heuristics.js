function l1Norm(node1, node2) {
    return Math.abs(node1.row - node2.row) + Math.abs(node1.col - node2.col);
}

function l2Norm(node1, node2) {
    return Math.sqrt(Math.pow(node1.row - node2.row, 2) + Math.pow(node1.col - node2.col, 2));
}

module.exports = {
    l1Norm,
    l2Norm,
};
