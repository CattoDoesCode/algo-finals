var nodes = new vis.DataSet();
var edges = new vis.DataSet();
var edgeObjects = []; // Array to store the edge objects
var network;
var data; // Declare the data variable here

function createAdjacencyList() {
    var adjacencyList = [];
    nodes.forEach(function (node) {
        var neighbors = edges
            .get({
                filter: function (edge) {
                    return edge.from === node.id || edge.to === node.id;
                }
            })
            .map(function (edge) {
                var neighbor = edge.from === node.id ? edge.to : edge.from;
                return nodes.get(neighbor).label;
            });

        var entry = {};
        entry[node.label] = neighbors;
        adjacencyList.push(entry);
    });

    return adjacencyList;
}

function updateEdgeInfo(edgeId, label, fromId, toId) {
    var fromNode = nodes.get(fromId).label;
    var toNode = nodes.get(toId).label;
    var edgeObject = {
        'from': fromNode,
        'to': toNode,
        'label': label
    };

    // Remove previous entry of the same edge
    edgeObjects = edgeObjects.filter(function (edge) {
        return !(edge.from === fromNode && edge.to === toNode);
    });

    // Push the updated edge object to the array
    edgeObjects.push(edgeObject);

    return edgeObject;
}

document.addEventListener("DOMContentLoaded", function () {
    var container = document.getElementById("graph-container");
    data = { nodes: nodes, edges: edges }; // Assign the data here
    var options = {
        layout: {
            randomSeed: 1
        },
        physics: false,
        manipulation: {
            enabled: true,
            addNode: function (data, callback) {
                nodes.add(data);
                createAdjacencyList();
                callback(data);
            },
            addEdge: function (data, callback) {
                data.label = '0'; // Set the default value of the label to '0'
                edges.add(data);
                createAdjacencyList();
                updateEdgeInfo(data.id, data.label, data.from, data.to);
                callback(data);
            },
            deleteNode: true,
            deleteEdge: true,
            editNode: function (data, callback) {
                var label = prompt('Enter new label for the node:', data.label);
                if (label !== null) {
                    data.label = label;
                }
                callback(data);
            }
        },
        edges: {
            smooth: false,
            color: {
                color: 'black',
                highlight: 'lightblue' // Set the highlight color to blue
            }
        },
        nodes: {
            borderWidth: 1,
            borderWidthSelected: 1,
            color: {
                border: 'black',
                background: 'white'
            }
        }
    };
    network = new vis.Network(container, data, options);

    // Add event listener for edge double-click
    network.on("doubleClick", function (params) {
        if (params.edges.length === 1 && params.nodes.length === 0) {
            var edgeId = params.edges[0];
            var edge = edges.get(edgeId);
            var label = prompt('Enter new label for the edge:', edge.label);
            if (label !== null) {
                edge.label = label;
                edges.update(edge);
                updateEdgeInfo(edgeId, label, edge.from, edge.to);
            }
        }
    });
});

function getMST() {
    // Adjacency list
    var adjacencyList = [
        { 0: [1, 7] },
        { 1: [0, 2, 7] },
        { 2: [1, 3, 5, 8] },
        { 3: [2, 4, 5] },
        { 4: [3, 5] },
        { 5: [2, 3, 4, 6] },
        { 6: [5, 7, 8] },
        { 7: [0, 1, 6, 8] },
        { 8: [2, 6, 7] },
    ];

    // Labels for the edges
    var edgeLabels = [
        { from: 0, to: 1, label: '4' },
        { from: 0, to: 7, label: '8' },
        { from: 1, to: 2, label: '8' },
        { from: 1, to: 7, label: '11' },
        { from: 2, to: 3, label: '7' },
        { from: 2, to: 5, label: '4' },
        { from: 2, to: 8, label: '2' },
        { from: 3, to: 4, label: '9' },
        { from: 3, to: 5, label: '14' },
        { from: 4, to: 5, label: '10' },
        { from: 5, to: 6, label: '2' },
        { from: 6, to: 7, label: '1' },
        { from: 6, to: 8, label: '6' },
        { from: 7, to: 8, label: '7' },
    ];
    calculateMST(adjacencyList, edgeLabels);
}