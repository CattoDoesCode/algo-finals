var nodes = new vis.DataSet();
var edges = new vis.DataSet();
var edgeObjects = []; // Array to store the edge labels
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
                callback(data);
            },
            addEdge: function (data, callback) {
                data.label = '0'; // Set the default value of the label to '0'
                edges.add(data);
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

function applyMSTColors() {
    var mst = calculateMST(createAdjacencyList(), edgeObjects);

    // Reset colors to original
    nodes.forEach(function (node) {
        nodes.update({ id: node.id, color: { border: 'black' }, borderWidth: 1 });
    });

    edges.forEach(function (edge) {
        edges.update({ id: edge.id, color: { color: 'black' }, width: 1 });
    });

    // Change border color and width of nodes and edges in the MST
    for (var m = 0; m < mst.length; m++) {
        var nodeLabel = Object.keys(mst[m])[0];
        var neighbors = mst[m][nodeLabel];

        // Find the corresponding node in the graph
        var node = nodes.get({
            filter: function (item) {
                return item.label === nodeLabel;
            }
        })[0];

        if (node) {
            // Change node border color to blue
            nodes.update({ id: node.id, color: { border: 'blue' }, borderWidth: 2 });

            // Change edges width and color to blue
            neighbors.forEach(function (neighborLabel) {
                var edge = edges.get({
                    filter: function (item) {
                        return (
                            (item.from === node.id && nodes.get(item.to).label === neighborLabel) ||
                            (item.to === node.id && nodes.get(item.from).label === neighborLabel)
                        );
                    }
                })[0];

                if (edge) {
                    edges.update({ id: edge.id, color: { color: 'blue' }, width: 2 });
                }
            });
        }
    }

    // Refresh the network to apply the color and width changes
    network.setData(data);
}


function changeColors() {
    var mstCheckbox = document.getElementById("mst");
    if (mstCheckbox.checked) {
        applyMSTColors();
    } else {
        resetColors();
    }
}

function resetColors() {
    nodes.forEach(function (node) {
        node.borderWidth = 1;
        node.color = { border: "black" };
    });
    edges.forEach(function (edge) {
        edge.width = 1;
        edge.color = { color: "black" };
    });

    nodes.update(nodes.get());
    edges.update(edges.get());
}