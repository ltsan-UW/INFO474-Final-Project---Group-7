// data_loader.js
// Simple data loading and TSV parsing module. Exposes DataLoader.loadTSV(url)
(function () {
    function parseTSV(text) {
        var lines = (text || '').trim().split(/\r?\n/);
        if (!lines || lines.length === 0) return [];
        var header = lines[0].split('\t');
        var rows = lines.slice(1);
        return rows.map(function (line) {
            var parts = line.split('\t');
            var word = (parts[0] || '').replace(/^"|"$/g, '');
            var time = parseFloat(parts[1]);
            var filler = parts[2] ? (parts[2].trim() === '1' || parts[2].trim() === 'true') : false;
            return { word: word, time: time, filler: filler, min: Math.floor(time / 60) };
        });
    }

    function loadTSV(url) {
        return fetch(url).then(function (r) { return r.text(); }).then(function (text) {
            return parseTSV(text);
        });
    }

    // Written semi by chatGPT. Parses text from csv to JSON, since we can't use the p5js load table outside of the sketch.
    // We use this to get the usable json file of data.
    function csvTextToJSON(csvText) {

        // Helper function to parse a CSV line correctly with quotes. Written by chatGPT
        function parseCSVLine(line) {
            const result = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"' && line[i - 1] !== '\\') {
                    inQuotes = !inQuotes; // toggle quotes
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim().replace(/^"|"$/g, ''));
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current.trim().replace(/^"|"$/g, ''));
            return result;
        }

        const lines = csvText.trim().split(/\r?\n/);
        if (lines.length < 2) return {};

        // Parse header
        const header = parseCSVLine(lines[0]);
        const dataRows = lines.slice(1);

        const obj = {};

        for (let line of dataRows) {
            const values = parseCSVLine(line);

            const row = {};
            header.forEach((h, i) => {
                row[h] = values[i];
            });

            let season = row["season"];
            let name = row["normalized_name"];
            if (!obj[season]) obj[season] = {};

            obj[season][name] = {
                name: name,
                age: Number(row["age"]),
                height: Number(row["player_height"]),
                weight: Number(row["player_weight"]),
                college: row["college"],
                country: row["country"],
                draft_year: row["draft_year"],
                draft_round: row["draft_round"],
                draft_number: row["draft_number"],
                pts: Number(row["pts"]),
                reb: Number(row["reb"]),
                ast: Number(row["ast"]),
                "Pos": row["Pos.x"],
                "MP": Number(row["MP.x"]),
                "GP": Number(row["G.x"]),
                "eFG%": Number(row["eFG."]),
                "3PM": Number(row["X3P"]),
                "3PA": Number(row["X3PA"]),
                "3P%": Number(row["X3P."]),
                "3PAr": Number(row["X3PAr"]),
                "2P": Number(row["X2P"]),
                "2PA": Number(row["X2PA"]),
                "2P%": Number(row["X2P."]),
                "FT": Number(row["FT"]),
                "FTA": Number(row["FTA"]),
                "FT%": Number(row["FT."]),
                "PER": Number(row["PER"]),
                "TS%": Number(row["TS."]),
                "TRB": Number(row["TRB."]),
                "AST": Number(row["AST."]),
                "TOV": Number(row["TOV."]),
                "USG": Number(row["USG."]),
                "WS": Number(row["WS"]),
                "VORP": Number(row["VORP"]),
                "BPM": Number(row["BPM"]),
                season: season
            };
        }
        return obj;
    }

    function loadCSV(url) {
        return fetch(url)
            .then(res => res.text())
            .then((data) => {
                return csvTextToJSON(data);
            })
    }

    window.DataLoader = {
        parseTSV: parseTSV,
        loadTSV: loadTSV,
        loadCSV: loadCSV
    };

    // Shared preprocess helper: normalize rows into the shape sketches expect.
    // Accepts an array of objects {word, time, filler, min} (as returned by parseTSV)
    // and returns an array with guaranteed types and an index property.
    window.DataLoader.preprocess = function (data) {
        data = data || [];
        return data.map(function (d, i) {
            return {
                word: (d.word || '').replace(/^"|"$/g, ''),
                filler: !!d.filler,
                time: +d.time || 0,
                min: (typeof d.min === 'number') ? d.min : Math.floor((+d.time || 0) / 60),
                index: i
            };
        });
    };
})();
