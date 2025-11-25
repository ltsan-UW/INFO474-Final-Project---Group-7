(function () {

    window.VizPlayersSplit = {
        doneLoading: false,
        maxPlayers: 0,
        currentSeason: null,
        intCircles: null,
        usaCircles: null,
        mouseClick: false,
        clickedCircle: null,

        preload: function(manager) {

            function createCluster(centerX, centerY, r, spacing, prevCircles) {
                let newCircles = {};

                let minBigRadius = Math.sqrt(prevCircles.length * spacing * spacing / Math.PI);
                let bigRadius = minBigRadius;
                let maxCountRows = Math.floor(bigRadius * 2 / spacing) //get the max amount of rows possible with spacing
                let minSpacingY = bigRadius * 2 / maxCountRows;
                let gap = spacing - r;
                let count = 0;
                for(let row = 0; row <= maxCountRows; row++) {
                    let y = minSpacingY / 2 + row * minSpacingY - bigRadius;
                    let maxX = Math.sqrt(bigRadius * bigRadius - y * y);
                    let maxCountCols = Math.floor(maxX * 2 / spacing);
                    let minSpacingX = (maxCountCols != 0 ? maxX * 2 / maxCountCols : 0);
                    for(let i = 0; i <= maxCountCols; i++) {
                        if(count + 1 > prevCircles.length) break;
                        newCircles[prevCircles[count].name] = {
                            x: centerX - maxX + (minSpacingX * i) + (Math.random() * gap * 2 - gap),
                            y: centerY - y + (Math.random() * gap * 2 - gap),
                            r: prevCircles[count].r,
                            VORP: prevCircles[count].VORP,
                            name: prevCircles[count].name,
                            international: prevCircles[count].international,
                            country: prevCircles[count].country
                        };
                        count++;
                    }
                }
                return [newCircles, bigRadius];
            }

            let testSeasons = ["1996-97", "2015-16", "2020-21", "2021-22"];
            this.currentSeason = testSeasons[2] // will change to be determined by manager

            // load all players circles data from viz 1 if null
            if(!manager.circlesAP || Object.keys(manager.circlesAP).length === 0) {
                let seasonData = manager.data[this.currentSeason];
                this.maxPlayers = Object.keys(seasonData).length;
                let midX = (manager.offsetX || 0) + (manager.width || 600) / 2;
                let midY = (manager.offsetY || 0) + (manager.height || 520) / 2 + 40;

                let newCircles = VizAllPlayers.createCirclesAP(midX, midY, seasonData)
                manager.setCirclesAP(newCircles);
            }

            const circlesArray = Object.values(manager.circlesAP);
            this.maxPlayers = circlesArray.length;
            const intPrevCircles = circlesArray.filter(player => player.international);
            const usaPrevCircles = circlesArray.filter(player => !player.international);

            let midX = (manager.offsetX || 0) + (manager.width || 600) / 2;
            let midY = (manager.offsetY || 0) + (manager.height || 520) / 2 + 40;
            let r = 11;
            let spacing = 15;
            let intValues = createCluster(midX / 2, midY, r, spacing, intPrevCircles);
            let usaValues = createCluster(midX / 3 * 4, midY, r, spacing, usaPrevCircles);
            this.intCircles = intValues[0];
            this.usaCircles = usaValues[0];

            this.doneLoading = true;
        },

        draw: function (p, manager, ai, progress) {
            if(!this.doneLoading) {
                this.preload(manager);
            }


            p.noStroke();
            p.fill('black');

            p.textSize(20);
            p.textStyle(p.BOLD);
            p.text('NBA Season ' + this.currentSeason, manager.offsetX + 5, manager.offsetY + 35);
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
            for(let circle in this.usaCircles) {
                let playerCircle = this.usaCircles[circle];
                let newX = p.map(progress, 0.5, 1, manager.circlesAP[playerCircle.name].x, playerCircle.x);
                let newY = p.map(progress, 0.5, 1, manager.circlesAP[playerCircle.name].y, playerCircle.y);

                p.fill('blue');
                p.circle(newX, newY, playerCircle.r);
                if (p.dist(p.mouseX, p.mouseY, newX, newY) < (playerCircle.r / 2 + 5)) {
                    this.clickedCircle = {...playerCircle, x: newX, y: newY};
                }
            }
            for(let circle in this.intCircles) {
                let playerCircle = this.intCircles[circle];
                let newX = p.map(progress, 0.5, 1, manager.circlesAP[playerCircle.name].x, playerCircle.x);
                let newY = p.map(progress, 0.5, 1, manager.circlesAP[playerCircle.name].y, playerCircle.y);

                p.fill('pink');
                p.circle(newX, newY, playerCircle.r);
                if (p.dist(p.mouseX, p.mouseY, newX, newY) < (playerCircle.r / 2 + 5)) {
                    this.clickedCircle = {...playerCircle, x: newX, y: newY};
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

            // let bigRadius = manager.height * 0.46 - 2;
            // let maxSpacing = Math.sqrt(p.PI * bigRadius * bigRadius / this.maxPlayers);
            // let r = maxSpacing * 0.7;
            // console.log(maxSpacing)
            // let spacing = maxSpacing;
            // let maxCountRows = Math.floor(bigRadius * 2 / spacing) //get the max amount of rows possible with spacing
            // let minSpacingY = bigRadius * 2 / maxCountRows;
            // p.randomSeed(999);
            // let gap = spacing - r;
            // let count = 0;
            // for(let row = 0; row <= maxCountRows; row++) {
            //     let y = minSpacingY / 2 + row * minSpacingY - bigRadius;
            //     let maxX = Math.sqrt(bigRadius * bigRadius - y * y);
            //     let maxCountCols = Math.floor(maxX * 2 / spacing);
            //     let minSpacingX = (maxCountCols != 0 ? maxX * 2 / maxCountCols : 0);
            //     for(let i = 0; i <= maxCountCols; i++) {
            //         if(count + 1 > this.maxPlayers) break;
            //         p.circle(midX - maxX + (minSpacingX * i) + p.random(-gap, gap), midY - y + p.random(-gap, gap), r);
            //         count++;
            //     }
            // }


            p.noStroke();
            p.fill('black');
        }
    };

})();