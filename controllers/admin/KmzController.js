const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const xml2js = require('xml2js');

exports.checkLatLngInKMZ = (req, res) => {
    const { lat, lng } = req.body;
    
    const directoryPath = path.join(__dirname, '../../kmz_files'); // Adjust the path as needed

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }

        files = files.filter(file => path.extname(file) === '.kmz');
        let found = false;

        files.forEach((file, index) => {
            const filePath = path.join(directoryPath, file);
            const zip = new AdmZip(filePath);
            const kmlFile = zip.getEntries().find(entry => entry.entryName.endsWith('.kml'));

            if (kmlFile) {
                const kmlContent = zip.readAsText(kmlFile);

                xml2js.parseString(kmlContent, (err, result) => {
                    if (err) {
                        return res.status(500).send('Error parsing KML: ' + err);
                    }

                    // Ensure the structure of the parsed KML file
                    try {
                        const placemarks = result.kml.Document[0].Placemark;
                       console.log(placemarks);
                        if (placemarks && placemarks.length > 0) {
                            for (let placemark of placemarks) {
                                const coordinatesStr = placemark.Point[0].coordinates[0];
                                console.log(Point[0]);
                                const coordinates = coordinatesStr.split(',');
                                   console.log(coordinates);
                                if (parseFloat(coordinates[1]) === parseFloat(lat) && parseFloat(coordinates[0]) === parseFloat(lng)) {
                                    found = true;
                                    res.send({ filename: file });
                                    return;
                                }
                            }
                        }
                    } catch (parseError) {
                        console.error('Error extracting coordinates:', parseError);
                    }

                    // If it's the last file and still not found
                    if (index === files.length - 1 && !found) {
                        console.log("s");
                        res.send({ message: 'not found' });
                    }
                });
            } else if (index === files.length - 1 && !found) {
                console.log("ss");
                res.send({ message: 'not found' });
            }
        });

        if (!files.length) {
            console.log("ss");
            res.send({ message: 'not found' });
        }
    });
};
