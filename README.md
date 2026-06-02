# Interactive Maps

Interactive Maps is a browser-based tool for adding, editing, searching, saving, and loading markers on a custom map image. It is designed for tabletop games, worldbuilding, campaign maps, or any image-based map where users want to track points of interest.

The project uses Leaflet with a simple image-based coordinate system instead of a real-world geographic map.

## Features

- Interactive image map powered by Leaflet
- Default fantasy map image
- Upload a custom map image
- Click the map to add markers
- Add a place name and description for each marker
- Edit existing marker names and descriptions
- Select a marker and press Delete to remove it
- Search markers by place name
- Fly to matching markers when searching
- Save marker data to a JSON file
- Load marker data from a JSON file
- Clear all markers from the map
- Persist markers and the selected map image with browser `localStorage`

## Technologies Used

- HTML
- CSS
- JavaScript
- Leaflet

## Project Structure

```text
Interactive-Maps/
├── index.html
├── script.js
├── styles.css
└── Resources/
    ├── faerun_map.jpg
    └── favicon-32x32.png
```

## How It Works

The app initializes a Leaflet map using `L.CRS.Simple`, which makes it suitable for static images instead of latitude and longitude maps. A map image is placed inside fixed bounds, and markers are saved using their image-coordinate positions.

Marker data is stored in memory and persisted in `localStorage`. Users can also export the marker list as a JSON file and import it again later.

## Running Locally

Clone the repository:

```bash
git clone https://github.com/TheKingofHearts777/Interactive-Maps.git
cd Interactive-Maps
```

Open `index.html` in your browser.

You can also run a simple local server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Usage

1. Open the app in a browser.
2. Click anywhere on the map to create a new marker.
3. Enter a place name and description.
4. Click **Add** to save the marker.
5. Click a marker to view its details.
6. Click **Edit** in a marker popup to update its details.
7. Select a marker and press **Delete** to remove it.
8. Use the search box to find markers by place name.
9. Use **Save Markers to File** to export marker data as JSON.
10. Use the JSON marker upload input to import saved marker data.
11. Use the map image upload input to replace the default map image.

## Marker JSON Format

Exported marker files use this general structure:

```json
{
  "version": 1,
  "markers": [
    {
      "id": "generated-id",
      "lat": 1234.56,
      "lng": 7890.12,
      "name": "Example Place",
      "description": "A short description of the location."
    }
  ]
}
```

## Data Storage

The app uses browser `localStorage` for persistence.

Stored keys include:

```text
savedMarkers
savedMapImage
```

Clearing browser storage may remove saved markers and the selected custom map image.

## Deployment

This project can be hosted on any static hosting service, including GitHub Pages.

To deploy with GitHub Pages:

1. Open the repository settings on GitHub.
2. Go to **Pages**.
3. Select the `main` branch.
4. Use the root directory as the source.
5. Save the settings.

## Future Improvements

Possible improvements include:

- Marker categories or custom marker icons
- Marker color selection
- Better mobile layout for the side panel
- Export and import custom map images with marker files
- Confirmation before clearing all markers
- Multiple map profiles
- Drag-and-drop marker repositioning
- Better HTML escaping for user-entered marker text

## Author

Dylan Brodie

## License
