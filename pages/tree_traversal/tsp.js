function findOptimalPaths(adjacencyList, edgeLabels) {
    var weights = {}; // Mapping of edge weights
    var numNodes = adjacencyList.length;

    // Build the weights mapping
    edgeLabels.forEach(function (label) {
        var from = label.from;
        var to = label.to;
        weights[from] = weights[from] || {};
        weights[from][to] = parseInt(label.label);
    });

    var optimalPaths = []; // List of optimal paths
    var optimalWeight = Infinity;

    function tsp(currentNode, visited, path, weight) {
        visited[currentNode] = true;
        path.push(currentNode);

        if (path.length === numNodes + 1 && currentNode === 0 && weight < optimalWeight) {
            optimalPaths.push(path.slice());
            optimalWeight = weight;
        }

        if (weights[currentNode] === undefined) return;

        Object.keys(weights[currentNode]).forEach(function (neighbor) {
            if (!visited[neighbor]) {
                var newVisited = Object.assign({}, visited); // Create a copy of the visited object
                var newPath = path.slice(); // Create a copy of the path
                tsp(neighbor, newVisited, newPath, weight + weights[currentNode][neighbor]);
            }
        });
    }

    tsp(0, {}, [], 0);

    return {
        paths: optimalPaths,
        weight: optimalWeight
    };
}

// Sample input
var adjacencyList = [
    { 0: [1, 2, 3] },
    { 1: [0, 2, 3] },
    { 2: [0, 1, 3] },
    { 3: [0, 1, 2] }
];

var edgeLabels = [
    { from: 0, to: 1, label: '2' },
    { from: 0, to: 2, label: '8' },
    { from: 0, to: 3, label: '5' },
    { from: 1, to: 2, label: '3' },
    { from: 1, to: 3, label: '4' },
    { from: 2, to: 3, label: '7' },
];

// Call the function and print the result
var result = findOptimalPaths(adjacencyList, edgeLabels);
result.paths.forEach(function (path) {
    console.log('Optimal Path:', path.join(', '));
});
console.log('Total Weight:', result.weight);
