// add country flags


(function () {

    window.VizVorpPlayersSplit = {
        doneLoading: false,
        maxPlayers: 0,
        circlesVorpPS: null,
        negativeLines: null,
        mouseClick: false,

        preload: function (manager, p) {

            let midX = (manager.offsetX || 0) + (manager.width || 600) / 2;
            let midY = (manager.offsetY || 0) + (manager.height || 520) / 2 + 40;
            let seasonData = manager.data[manager.currentSeason];
            this.maxPlayers = Object.keys(seasonData).length;
            const vorpMapWorse = 10;
            const vorpMapBest = 10.6 / 2.5;

            function createCluster(centerX, centerY, prevCircles, minVORP, maxVORP, p, bigRadius, scatterStrength, seperateNegatives) {
                let newCircles = {};
                let negativeLine = null;
                let negGap = 50;

                let maxY = bigRadius * 2;
                let count = 0;
                let yCurrDistance = -bigRadius + 10;
                let rowCount = 1;
                while (count < prevCircles.length && yCurrDistance < maxY) {
                    let maxR = Math.sqrt(bigRadius * bigRadius - yCurrDistance * yCurrDistance);
                    let maxX = Math.sqrt(bigRadius * bigRadius - yCurrDistance * yCurrDistance) * 2;
                    let xCurrDistance = 0;
                    let largestR = 1;
                    let minR = 13 * vorpMapBest;
                    while (count < prevCircles.length && xCurrDistance < maxX) {

                        let currCircle = prevCircles[count];
                        let newR = p.map(currCircle.VORP, minVORP, maxVORP, 0.5, currCircle.r * vorpMapBest);
                        let gap = p.map(p.constrain(newR, 0.5, 10), 0.5, 13, 0.1, 2.5 * scatterStrength);
                        let y = (centerY - yCurrDistance + (Math.random() * gap * 2 - gap));
                        let newY = seperateNegatives ? (currCircle.VORP <= 0 ? y - negGap : y) : y;
                        let x = -maxR + xCurrDistance + (Math.random() * gap * 2 - gap);
                        let newX = (rowCount % 2 == 1) ? centerX + x : centerX - x;
                        if (seperateNegatives && negativeLine == null && currCircle.VORP <= 0) {
                            console.log("negline loaded")
                            negativeLine = { x: centerX - maxR, y: newY + negGap / 2, x2: centerX + maxR };
                        }
                        newCircles[currCircle.name] = {
                            x: newX,
                            y: newY,
                            r: newR,
                            VORP: currCircle.VORP,
                            name: currCircle.name,
                            international: currCircle.international,
                            country: currCircle.country
                        };
                        if (largestR < newR) largestR = newR;
                        if (minR > newR) minR = newR;
                        minR = newR;
                        xCurrDistance += newR;
                        count++;
                    }
                    console.log(minR + " | " + largestR)
                    yCurrDistance += (minR > 30) ? minR : (largestR + minR) / 2;
                    rowCount++;
                }

                return { circles: newCircles, negativeLine: negativeLine };
            }


            // load all players circles data from viz 1 and/or 2 if null
            if (!manager.circlesPS || Object.keys(manager.circlesPS).length === 0) {
                if (!manager.circlesAP || Object.keys(manager.circlesAP).length === 0) {
                    let newCircles = VizAllPlayers.createCirclesAP(midX, midY, seasonData, manager.circleSize.r, manager.circleSize.spacing, manager.circleScatterStrength)
                    manager.setCirclesAP(newCircles);

                    // load flag images if null
                    if (manager.flagImages === null) {
                        let flags = VizAllPlayers.createFlagImages(newCircles, p);
                        manager.setFlagImages(flags);
                    }
                }
                let newCircles = VizPlayersSplit.createPlayersSplitClusters(midX, midY, manager.circlesAP, manager.circleSize.r, manager.circleSize.spacing, manager.circleScatterStrength)
                manager.setCirclesPS(newCircles);
            }

            const vorpValues = Object.values(seasonData).map(player => player.VORP);

            const maxVORP = Math.max(...vorpValues);
            const minVORP = Math.min(...vorpValues);


            const intPrevCircles = Object.values(manager.circlesPS.int)
                .sort((a, b) => b.VORP - a.VORP);  // highest → lowest

            const usaPrevCircles = Object.values(manager.circlesPS.usa)
                .sort((a, b) => b.VORP - a.VORP);  // highest → lowest

            // this finds the median of both international and usa.
            // function medianPositiveVORP(arr) {
            //     // keep only items with VORP > 0
            //     const positives = arr.filter(x => x.VORP > 0);

            //     const n = positives.length;
            //     if (n === 0) return null;

            //     const mid = Math.floor(n / 2);

            //     if (n % 2 === 1) {
            //         return positives[mid].VORP;  // odd → middle VORP
            //     } else {
            //         return (positives[mid - 1].VORP + positives[mid].VORP) / 2;
            //     }
            // }

            // const intMedianVORP = medianPositiveVORP(intPrevCircles);
            // const usaMedianVORP = medianPositiveVORP(usaPrevCircles);
            // console.log(intMedianVORP);
            // console.log(usaMedianVORP);

            //const intTotalVORP = intPrevCircles.reduce((sum, c) => sum + p.map(c.VORP, minVORP, maxVORP, 11 / vorpMapWorse, 11 * vorpMapBest) * p.map(c.VORP, minVORP, maxVORP, 11 / vorpMapWorse, 11 * vorpMapBest) * Math.PI, 0);
            const usaMappedTotalVORP = usaPrevCircles.reduce((sum, c) => sum + p.map(c.VORP, minVORP, maxVORP, 0.5, 13 * vorpMapBest) * p.map(c.VORP, minVORP, maxVORP, 11 / vorpMapWorse, 11 * vorpMapBest) * Math.PI, 0);

            // const usaTotalVORP = usaPrevCircles.reduce((sum, c) => sum + ((c.VORP > 0) ? c.VORP : 0), 0);
            // const intTotalVORP = intPrevCircles.reduce((sum, c) => sum + ((c.VORP > 0) ? c.VORP : 0), 0);

            const usaBigRadius = Math.sqrt(usaMappedTotalVORP / 2 / Math.PI);
            // let intValues = createCluster(midX / 2, midY, r, spacing, intPrevCircles, minVORP, maxVORP, p, Math.sqrt(intTotalVORP / 2 / Math.PI));
            // let usaValues = createCluster(midX / 4 * 5.5, midY, r, spacing, usaPrevCircles, minVORP, maxVORP, p, Math.sqrt(usaTotalVORP / 2 / Math.PI));
            let intValues = createCluster(midX - usaBigRadius * 0.9 - 15, midY - 8.5 - 20, intPrevCircles, minVORP, maxVORP, p, usaBigRadius * 0.85, manager.circleScatterStrength, true);
            let usaValues = createCluster(midX + usaBigRadius * 0.9 + 15, midY - 20, usaPrevCircles, minVORP, maxVORP, p, usaBigRadius * 0.85, manager.circleScatterStrength, true);

            console.log(intValues)
            this.circlesVorpPS = { int: intValues.circles, usa: usaValues.circles };
            this.negativeLines = { int: intValues.negativeLine, usa: usaValues.negativeLine };

            this.doneLoading = true;
        },

        draw: function (p, manager, ai, progress) {
            if (!this.doneLoading) {
                this.preload(manager, p);
            }

            p.noFill();

            VizAllPlayers.drawHeader(p, manager.currentSeason, manager, this.maxPlayers);

            p.strokeWeight(1);
            p.stroke('grey')
            p.fill('lightgrey');

            let hoverCircle = null;


            //Draw circles: usa, then international
            for (let circle in this.circlesVorpPS.usa) {
                let playerCircle = this.circlesVorpPS.usa[circle];
                let newX = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, manager.circlesPS.usa[playerCircle.name].x, playerCircle.x);
                let newY = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, manager.circlesPS.usa[playerCircle.name].y, playerCircle.y);
                let newR = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, manager.circlesPS.usa[playerCircle.name].r, playerCircle.r);
                playerCircle = { ...playerCircle, x: newX, y: newY, r: newR };

                VizAllPlayers.drawCircle(playerCircle, p, manager.flagImages);

                if (p.dist(p.mouseX, p.mouseY, newX, newY) < (newR / 2 + 5)) {
                    hoverCircle = playerCircle;
                }
            }
            for (let circle in this.circlesVorpPS.int) {
                let playerCircle = this.circlesVorpPS.int[circle];
                let newX = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, manager.circlesPS.int[playerCircle.name].x, playerCircle.x);
                let newY = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, manager.circlesPS.int[playerCircle.name].y, playerCircle.y);
                let newR = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, manager.circlesPS.int[playerCircle.name].r, playerCircle.r);
                playerCircle = { ...playerCircle, x: newX, y: newY, r: newR };

                VizAllPlayers.drawCircle(playerCircle, p, manager.flagImages);

                if (p.dist(p.mouseX, p.mouseY, newX, newY) < (newR / 2 + 5)) {
                    hoverCircle = playerCircle;
                }
            }

            // Written with AI: Function to draw a dashed line between two points
            function dashedLine(p, x1, y1, x2, y2, dashLength = 5, gapLength = 5) {
                // Calculate total distance between points
                let distance = p.dist(x1, y1, x2, y2);

                // Calculate direction vector
                let dx = (x2 - x1) / distance;
                let dy = (y2 - y1) / distance;

                // Loop through and draw dashes
                let progress = 0;
                while (progress < distance) {
                    let xStart = x1 + dx * progress;
                    let yStart = y1 + dy * progress;
                    progress += dashLength;
                    if (progress > distance) progress = distance;
                    let xEnd = x1 + dx * progress;
                    let yEnd = y1 + dy * progress;
                    p.line(xStart, yStart, xEnd, yEnd);
                    progress += gapLength;
                }
            }

            let transparency = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, 0, 255);
            p.strokeWeight(5);
            p.stroke(211, 211, 211, transparency);
            if (this.negativeLines.usa !== null) {
                let usaLine = this.negativeLines.usa;
                dashedLine(p, usaLine.x, usaLine.y, usaLine.x2, usaLine.y, 5, 10);
            }
            if (this.negativeLines.int !== null) {
                let intLine = this.negativeLines.int;
                dashedLine(p, intLine.x, intLine.y, intLine.x2, intLine.y, 5, 10);
                p.strokeWeight(0);
                p.fill(150, 150, 150, transparency);
                p.textSize(10);
                p.textWrap(p.WORD);
                p.text("Players above line have ≤ 0 VORP", intLine.x - 70, intLine.y - 50, 60);

                p.strokeWeight(1);
                p.stroke('grey');
                p.textSize(18);
            }


            // Hover
            if (hoverCircle !== null && p.dist(p.mouseX, p.mouseY, hoverCircle.x, hoverCircle.y) > (hoverCircle.r / 2 + 5)) {
                hoverCircle = null;
            }
            VizAllPlayers.handleHover(hoverCircle, p, manager, true);



            let midX = (manager.offsetX || 0) + (manager.width || 600) / 2;
            let midY = (manager.offsetY || 0) + (manager.height || 520) / 2;

            p.textAlign(p.CENTER, p.CENTER);
            p.textWrap(p.WORD);
            p.fill(150, 150, 150);
            p.textSize(16);

            // original text location
            let ogX1 = midX + 115 - 65;
            let ogY1 = midY + 235 - 20;
            let newX = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, ogX1, midX + 155 - 65);
            let newY = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, ogY1, midY + 180);
            p.text("249.8 total positive VORP", newX, newY, 130, 50);

            //-44.6
            //-12.9

            let ogX2 = midX - 200 - 65;
            let ogY2 = midY + 145 - 20;
            newX = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, ogX2, midX - 155 - 65);
            newY = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, ogY2, midY + 180);
            p.text("107.6 total positive VORP", newX, newY, 130, 50);

            p.textWrap(p.WORD);
            p.fill(150, 150, 150, transparency);
            p.textSize(10);
            p.text("-44.6 total negative VORP", midX + 155, midY - 120);
            p.text("-12.9 total negative VORP", midX - 155, midY - 45);
            p.textAlign(p.LEFT, p.BASELINE);

            p.noStroke();
            p.fill('black');
        }
    };

})();