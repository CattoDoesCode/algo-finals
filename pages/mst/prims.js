function calculateMST(adjacencyList, edgeLabels) {
    console.log("adjacency list: ", adjacencyList);
    console.log("edge labels: ", edgeLabels);

    // Sort all edges with their weight in ascending order.
    var sortedEdges = edgeLabels.sort((a, b) => parseInt(a.label) - parseInt(b.label));

    // Initialize an empty array to store the minimum spanning tree (MST).
    var mst = [];

    // Helper function to find the parent of a node in a disjoint-set data structure.
    function findParent(parent, node) {
        if (parent[node] === node)
            return node;
        return findParent(parent, parent[node]);
    }

    // Iterate through each edge and add it to the MST if it doesn't create a cycle.
    var parent = [];

    // Initialize the parent array
    for (var i = 0; i < adjacencyList.length; i++) {
        parent[i] = i;
    }

    // Iterate through each edge
    for (var i = 0; i < sortedEdges.length; i++) {
        var edge = sortedEdges[i];
        var from = edge.from;
        var to = edge.to;
        var label = edge.label;

        var parentFrom = findParent(parent, from);
        var parentTo = findParent(parent, to);

        // Check if adding this edge will create a cycle
        if (parentFrom !== parentTo) {
            mst.push(edge);

            // Merge the two sets
            parent[parentTo] = parentFrom;
        }
    }

    // Construct the adjacency list for the MST using the edges in the MST array.
    var mstAdjacencyList = [];

    // Initialize the mstAdjacencyList
    for (var i = 0; i < adjacencyList.length; i++) {
        mstAdjacencyList[i] = {};
        mstAdjacencyList[i][i] = [];
    }

    // Add edges to the mstAdjacencyList
    for (var i = 0; i < mst.length; i++) {
        var edge = mst[i];
        var from = edge.from;
        var to = edge.to;

        mstAdjacencyList[from][from].push(to);
        mstAdjacencyList[to][to].push(from);
    }

    console.log("mst adajcency list: ", mstAdjacencyList);
    return mstAdjacencyList;
}
