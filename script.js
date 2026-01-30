// --------------------
// Map initialization
// --------------------

const map = L.map("map", {
    crs: L.CRS.Simple,
    minZoom: -3,
    maxZoom: 2
}).setView([0, 0], 0);

const bounds = [[0, 0], [6798, 9800]];

let mapImageOverlay = null;

// Default map image
setMapImage("Resources/faerun_map.jpg");

map.fitBounds(bounds);
map.setMaxBounds(bounds);
map.options.maxBoundsViscosity = 1.0;

// --------------------
// State
// --------------------

let savedMarkers = loadFromLocalStorage();
let markerMap = {}; // id -> Leaflet marker
let selectedMarker = null;

// --------------------
// Utilities
// --------------------

function persist() {
    localStorage.setItem("savedMarkers", JSON.stringify(savedMarkers));
}

function loadFromLocalStorage() {
    try {
        return JSON.parse(localStorage.getItem("savedMarkers")) || [];
    } catch {
        return [];
    }
}

function generateId() {
    return crypto.randomUUID();
}

// --------------------
// Map image handling
// --------------------

function setMapImage(src) {
    if (mapImageOverlay) {
        map.removeLayer(mapImageOverlay);
    }

    mapImageOverlay = L.imageOverlay(src, bounds, { opacity: 0.7 });
    mapImageOverlay.addTo(map);
}

// Load user supplied image
document.getElementById("mapImageInput")?.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setMapImage(reader.result);
    reader.readAsDataURL(file);
});

// --------------------
// Marker creation
// --------------------

function createMarker({ id, lat, lng, name, description }) {
    const marker = L.marker([lat, lng]).addTo(map);
    marker._id = id;

    marker.bindTooltip(name, { direction: "top" });
    marker.bindPopup(renderPopup(name, description, id));

    marker.on("click", () => {
        selectedMarker = marker;
    });

    markerMap[id] = marker;
}

function renderPopup(name, description, id) {
    return `
        <strong>${name}</strong><br>
        ${description}<br>
        <button onclick="editMarker('${id}')">Edit</button>
    `;
}

// --------------------
// Marker loading
// --------------------

function loadMarkers() {
    savedMarkers.forEach(createMarker);
}

document.addEventListener("DOMContentLoaded", loadMarkers);

// --------------------
// Marker adding
// --------------------

map.on("click", e => {
    const { lat, lng } = e.latlng;
    if (!withinBounds(lat, lng)) return;

    L.popup()
        .setLatLng([lat, lng])
        .setContent(`
            <strong>Add New Place</strong><br>
            <input id="placeName" placeholder="Place Name"><br>
            <textarea id="placeDescription" placeholder="Description"></textarea><br>
            <button onclick="saveMarker(${lat}, ${lng})">Add</button>
        `)
        .openOn(map);
});

function withinBounds(lat, lng) {
    return lat >= bounds[0][0] &&
           lat <= bounds[1][0] &&
           lng >= bounds[0][1] &&
           lng <= bounds[1][1];
}

function saveMarker(lat, lng) {
    const name = document.getElementById("placeName").value.trim();
    const description = document.getElementById("placeDescription").value.trim();

    if (!name || !description) {
        alert("Name and description required.");
        return;
    }

    const markerData = {
        id: generateId(),
        lat,
        lng,
        name,
        description
    };

    savedMarkers.push(markerData);
    createMarker(markerData);
    persist();

    map.closePopup();
}

// --------------------
// Editing markers
// --------------------

function editMarker(id) {
    const data = savedMarkers.find(m => m.id === id);
    if (!data) return;

    const marker = markerMap[id];

    marker.setPopupContent(`
        <strong>Edit Place</strong><br>
        <input id="editName" value="${data.name}"><br>
        <textarea id="editDesc">${data.description}</textarea><br>
        <button onclick="saveEdits('${id}')">Save</button>
    `).openPopup();
}

function saveEdits(id) {
    const data = savedMarkers.find(m => m.id === id);
    if (!data) return;

    data.name = document.getElementById("editName").value.trim();
    data.description = document.getElementById("editDesc").value.trim();

    const marker = markerMap[id];
    marker.bindTooltip(data.name);
    marker.setPopupContent(renderPopup(data.name, data.description, id));

    persist();
}

// --------------------
// Deleting markers
// --------------------

document.addEventListener("keydown", e => {
    if (e.key !== "Delete" || !selectedMarker) return;

    const id = selectedMarker._id;

    map.removeLayer(selectedMarker);
    delete markerMap[id];
    savedMarkers = savedMarkers.filter(m => m.id !== id);

    persist();
    selectedMarker = null;
});

// --------------------
// Search
// --------------------

function searchMarker() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    if (!query) return;

    const match = savedMarkers.find(m =>
        m.name.toLowerCase().includes(query)
    );

    if (!match) {
        alert("Place not found.");
        return;
    }

    const marker = markerMap[match.id];
    map.flyTo(marker.getLatLng(), 1.8, { duration: 1.5 });
    marker.openPopup();
}

// --------------------
// Save and load marker files
// --------------------

function downloadMarkers() {
    if (!savedMarkers.length) {
        alert("No markers to save.");
        return;
    }

    const blob = new Blob(
        [JSON.stringify({ version: 1, markers: savedMarkers }, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = document.getElementById("filenameInput").value.trim() || "markers.json";
    a.click();

    URL.revokeObjectURL(url);
}

document.getElementById("markerFileInput")?.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const data = JSON.parse(reader.result);
            if (!Array.isArray(data.markers)) throw new Error();

            clearMarkers();
            savedMarkers = data.markers;
            savedMarkers.forEach(createMarker);
            persist();
        } catch {
            alert("Invalid marker file.");
        }
    };

    reader.readAsText(file);
});

// --------------------
// Clear everything
// --------------------

function clearMarkers() {
    Object.values(markerMap).forEach(m => map.removeLayer(m));
    markerMap = {};
    savedMarkers = [];
    localStorage.removeItem("savedMarkers");
}