// add country flags


(function () {

    window.VizVorpPlayersSplit = {
        doneLoading: false,
        maxPlayers: 0,
        circlesVorpPS: null,
        mouseClick: false,
        clickedCircle: null,
        temp: 0,

        preload: function(manager, p) {

            let midX = (manager.offsetX || 0) + (manager.width || 600) / 2;
            let midY = (manager.offsetY || 0) + (manager.height || 520) / 2 + 40;
            let seasonData = manager.data[manager.currentSeason];
            this.maxPlayers = Object.keys(seasonData).length;
            const vorpMapWorse = 8;
            const vorpMapBest = 4;

            function createCluster(centerX, centerY, r, spacing, prevCircles, minVORP, maxVORP, p, bigRadius) {
                let newCircles = {};

                let maxY = bigRadius * 2;
                let gap = 3;
                let count = 0;
                let yCurrDistance = -bigRadius;
                while(yCurrDistance < maxY) {
                    let maxR = Math.sqrt(bigRadius * bigRadius - yCurrDistance * yCurrDistance);
                    let maxX = Math.sqrt(bigRadius * bigRadius - yCurrDistance * yCurrDistance) * 2;
                    let xCurrDistance = 0;
                    let largestR = 1;
                    while(xCurrDistance < maxX) {
                        if(count + 1 > prevCircles.length) break;
                        let currCircle = prevCircles[count];
                        let newR = p.map(currCircle.VORP, minVORP, maxVORP, currCircle.r / vorpMapWorse, currCircle.r * vorpMapBest);
                        newCircles[currCircle.name] = {
                            x: centerX - maxR + xCurrDistance +  (Math.random() * gap * 2 - gap),
                            y: centerY - yCurrDistance + (Math.random() * gap * 2 - gap),
                            r: newR,
                            VORP: currCircle.VORP,
                            name: currCircle.name,
                            international: currCircle.international,
                            country: currCircle.country
                        };
                        if(largestR < newR) largestR = newR;
                        xCurrDistance += newR * 1.1;
                        count++;
                    }
                    yCurrDistance += largestR * 1.1;
                }




                return newCircles;
            }


            // load all players circles data from viz 1 and/or 2 if null
            if(!manager.circlesPS || Object.keys(manager.circlesPS).length === 0) {
                if(!manager.circlesAP || Object.keys(manager.circlesAP).length === 0) {
                    let newCircles = VizAllPlayers.createCirclesAP(midX, midY, seasonData, manager.circleSize.r, manager.circleSize.spacing)
                    manager.setCirclesAP(newCircles);
                    let flags = VizAllPlayers.createFlagImages(newCircles, p);
                    manager.setFlagImages(flags);
                }
                let newCircles = VizPlayersSplit.createPlayersSplitClusters(midX, midY, manager.circlesAP, manager.circleSize.r, manager.circleSize.spacing)
                manager.setCirclesPS(newCircles);
            }

            const vorpValues = Object.values(seasonData).map(player => player.VORP);

            const maxVORP = Math.max(...vorpValues);
            const minVORP = Math.min(...vorpValues);


            const intPrevCircles = Object.values(manager.circlesPS.int)
                .sort((a, b) => b.VORP - a.VORP);  // highest → lowest

            const usaPrevCircles = Object.values(manager.circlesPS.usa)
                .sort((a, b) => b.VORP - a.VORP);  // highest → lowest

            const intTotalVORP = intPrevCircles.reduce((sum, c) => sum + p.map(c.VORP, minVORP, maxVORP, 11 / vorpMapWorse, 11 * vorpMapBest) * p.map(c.VORP, minVORP, maxVORP, 11 / vorpMapWorse, 11 * vorpMapBest) * Math.PI, 0);
            const usaTotalVORP = usaPrevCircles.reduce((sum, c) => sum + p.map(c.VORP, minVORP, maxVORP, 11 / vorpMapWorse, 11 * vorpMapBest) * p.map(c.VORP, minVORP, maxVORP, 11 / vorpMapWorse, 11 * vorpMapBest) * Math.PI, 0);

            let r = manager.circleSize.r;
            let spacing = manager.circleSize.spacing;
            // let intValues = createCluster(midX / 2, midY, r, spacing, intPrevCircles, minVORP, maxVORP, p, Math.sqrt(intTotalVORP / 2 / Math.PI));
            // let usaValues = createCluster(midX / 4 * 5.5, midY, r, spacing, usaPrevCircles, minVORP, maxVORP, p, Math.sqrt(usaTotalVORP / 2 / Math.PI));
            let intValues = createCluster(midX / 2, midY + 20, r, spacing, intPrevCircles, minVORP, maxVORP, p, Math.sqrt(intTotalVORP / 2 / Math.PI));
            let usaValues = createCluster(midX / 4 * 5.5, midY + Math.sqrt(intTotalVORP / 2 / Math.PI) - Math.sqrt(usaTotalVORP / 2 / Math.PI) + 30, r, spacing, usaPrevCircles, minVORP, maxVORP, p, Math.sqrt(usaTotalVORP / 2 / Math.PI));

            this.temp = Math.sqrt(usaTotalVORP / 2 / Math.PI);
            this.circlesVorpPS = {int: intValues, usa: usaValues};

            this.doneLoading = true;
        },

        draw: function (p, manager, ai, progress) {
            if(!this.doneLoading) {
                this.preload(manager, p);
            }



            let midX = (manager.offsetX || 0) + (manager.width || 600) / 2;
            let midY = (manager.offsetY || 0) + (manager.height || 520) / 2 + 40;
            p.noFill();
            p.strokeWeight(2);
            p.stroke('black')
            //p.circle(midX / 4 * 5.5, midY - 20, this.temp * 2 + 30);

            p.noStroke();
            p.fill('black');


            p.textSize(20);
            p.textStyle(p.BOLD);
            p.text('NBA Season ' + manager.currentSeason, manager.offsetX + 5, manager.offsetY + 35);
            p.textSize(18);
            p.textStyle(p.NORMAL);
            p.text('Total Players: ' + this.maxPlayers, manager.offsetX + 5, manager.offsetY + 55);


            // p.circle(manager.offsetX + manager.width / 2, manager.offsetY + manager.height / 2, bigRadius * 2);

            // p.line(xStart, yEnd, xStart, yStart);
            // p.line(xEnd, yEnd, xEnd, yStart);

            //let pixelsToMeter = xDistance / 13.42;

            // let midX = (manager.offsetX || 0) + (manager.width || 600) / 2;
            // let midY = (manager.offsetY || 0) + (manager.height || 520) / 2 + 40;
            // let yStart = manager.offsetY;
            // let yEnd = manager.offsetY + manager.height;
            // let xStart = manager.offsetX;
            // let xEnd = manager.offsetX + manager.width;

            // let xDistance = xEnd - xStart;
            // let pixelsToMeter = xDistance / 15;
            // p.strokeWeight(2);
            // p.stroke('grey')
            // p.noFill();
            // p.line(xStart, yEnd, xEnd, yEnd);
            // // p.line(xStart, yEnd, xStart, yEnd - 10 * pixelsToMeter);
            // // p.line(xEnd, yEnd, xEnd, yEnd - 10 * pixelsToMeter);
            // p.line(xStart + pixelsToMeter * 0.9, yEnd, xStart + pixelsToMeter * 0.9, yEnd - 3.04* pixelsToMeter);
            // p.line(xEnd - pixelsToMeter * 0.9, yEnd, xEnd - pixelsToMeter * 0.9, yEnd - 3.04 * pixelsToMeter);
            // p.arc(midX, yEnd - 3.04 * pixelsToMeter, xDistance - pixelsToMeter * 0.9 * 2, 5.5 * pixelsToMeter * 2, p.PI, p.TWO_PI)
            // p.line(midX - 4.9 * pixelsToMeter / 2, yEnd, midX - 4.9 * pixelsToMeter / 2, yEnd - 4.6 * pixelsToMeter);
            // p.line(midX + 4.9 * pixelsToMeter / 2, yEnd, midX + 4.9 * pixelsToMeter / 2, yEnd - 4.6 * pixelsToMeter);
            // p.line(midX - 4.9 * pixelsToMeter / 2, yEnd - 4.6 * pixelsToMeter, midX + 4.9 * pixelsToMeter / 2, yEnd - 4.6 * pixelsToMeter);
            // p.arc(midX, yEnd - 4.6 * pixelsToMeter, 3.65 * pixelsToMeter, 1.8 * pixelsToMeter * 2, p.PI, p.TWO_PI)
            // p.stroke('lightgrey')
            // p.arc(midX, yEnd - 4.6 * pixelsToMeter, 3.65 * pixelsToMeter, 1.8 * pixelsToMeter * 2, p.TWO_PI, p.PI)


            p.strokeWeight(1);
            p.stroke('grey')
            p.fill('lightgrey');

            // for(let circle in manager.circlesAP) {
            //     let playerCircle = manager.circlesAP[circle];
            //     if(playerCircle.international) p.fill('pink');
            //     else p.fill('blue');
            //     p.circle(playerCircle.x, playerCircle.y, playerCircle.r);
            //     if (p.dist(p.mouseX, p.mouseY, playerCircle.x, playerCircle.y) < (playerCircle.r / 2 + 5)) {
            //         this.clickedCircle = playerCircle;
            //     }
            // }
            for(let circle in this.circlesVorpPS.usa) {
                let playerCircle = this.circlesVorpPS.usa[circle];
                let newX = p.map(progress, 0.5, 1, manager.circlesPS.usa[playerCircle.name].x, playerCircle.x);
                let newY = p.map(progress, 0.5, 1, manager.circlesPS.usa[playerCircle.name].y, playerCircle.y);
                let newR = p.map(progress, 0.5, 1, manager.circlesPS.usa[playerCircle.name].r, playerCircle.r);

                p.circle(newX, newY, newR);
                if(manager.flagImages.has(playerCircle.country)) {

                    // Written with AI
                    // --- create circular clip ---
                    p.drawingContext.save();
                    p.drawingContext.beginPath();
                    p.drawingContext.arc(newX, newY, newR / 2, 0, Math.PI * 2);
                    p.drawingContext.clip();

                    // --- draw image inside circle ---
                    // Make the image exactly fill the circle
                    p.image(manager.flagImages.get(playerCircle.country), newX - newR / 2, newY - newR / 2, newR, newR);

                    p.drawingContext.restore();
                }

                if (p.dist(p.mouseX, p.mouseY, playerCircle.x, playerCircle.y) < (playerCircle.r / 2 + 5)) {
                    this.clickedCircle = {...playerCircle, r: newR};
                }
            }
            for(let circle in this.circlesVorpPS.int) {
                let playerCircle = this.circlesVorpPS.int[circle];
                let newX = p.map(progress, 0.5, 1, manager.circlesPS.int[playerCircle.name].x, playerCircle.x);
                let newY = p.map(progress, 0.5, 1, manager.circlesPS.int[playerCircle.name].y, playerCircle.y);
                let newR = p.map(progress, 0.5, 1, manager.circlesPS.int[playerCircle.name].r, playerCircle.r);

                p.circle(newX, newY, newR);
                if(manager.flagImages.has(playerCircle.country)) {

                    // Written with AI
                    // --- create circular clip ---
                    p.drawingContext.save();
                    p.drawingContext.beginPath();
                    p.drawingContext.arc(newX, newY, newR / 2, 0, Math.PI * 2);
                    p.drawingContext.clip();

                    // --- draw image inside circle ---
                    // Make the image exactly fill the circle
                    p.image(manager.flagImages.get(playerCircle.country), newX - newR / 2, newY - newR / 2, newR, newR);

                    p.drawingContext.restore();
                }

                if (p.dist(p.mouseX, p.mouseY, newX, newY) < (newR / 2 + 5)) {
                    this.clickedCircle = {...playerCircle, r: newR};
                }
            }



            p.fill('white');
            p.rect(manager.offsetX + manager.width - 250 - 5, manager.offsetY + 15, 250, 50);
            // p.line(manager.offsetX + manager.width, manager.offsetY, manager.offsetX + manager.width, manager.offsetY + manager.height);
            // p.line(manager.offsetX, manager.offsetY + manager.height, manager.offsetX, manager.offsetY);

            p.fill('black');
            p.textAlign(p.CENTER, p.CENTER);
            if(this.clickedCircle != null) {
                p.fill('red')
                p.circle(this.clickedCircle.x, this.clickedCircle.y, this.clickedCircle.r + 5);
                p.fill('black');
                p.noStroke();
                p.text(this.clickedCircle.name, manager.offsetX + manager.width - 125 - 5, manager.offsetY + 40);
                if (p.dist(p.mouseX, p.mouseY, this.clickedCircle.x, this.clickedCircle.y) > (this.clickedCircle.r / 2 + 5)) {
                    this.clickedCircle = null;
                }
            } else {
                p.noStroke();
                p.fill('grey');
                p.text("Hover over a player", manager.offsetX + manager.width - 125 - 5, manager.offsetY + 40);

            }
            p.textAlign(p.LEFT, p.BASELINE);

            p.noStroke();
            p.fill('black');
        }
    };

})();