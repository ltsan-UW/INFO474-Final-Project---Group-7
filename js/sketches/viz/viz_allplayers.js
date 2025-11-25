(function () {

    window.VizAllPlayers = {
        doneLoading: false,
        maxPlayers: 0,
        currentSeason: null,
        mouseClick: false,
        clickedCircle: null,

        preload: function(manager) {
            let testSeasons = ["1996-97", "2015-16", "2020-21", "2021-22"];
            this.currentSeason = testSeasons[2] // will change to be determined by manager
            let seasonData = manager.data[this.currentSeason];
            this.maxPlayers = Object.keys(seasonData).length;
            let midX = (manager.offsetX || 0) + (manager.width || 600) / 2;
            let midY = (manager.offsetY || 0) + (manager.height || 520) / 2 + 40;


            let newCircles = this.createCirclesAP(midX, midY, seasonData)
            manager.setCirclesAP(newCircles);

            // // Click function. Written with AI, I didn't wanna mess with using a onClick function and going through the instance stuff
            // document.querySelector('canvas').addEventListener('click', (e) => {
            //     this.mouseClick = !this.mouseClick;
            // });

            this.doneLoading = true;
        },

        createCirclesAP: function(centerX, centerY, seasonData) {
            let playerNames = Object.keys(seasonData);
            let maxPlayers = playerNames.length;
            let circles = {}

            // This formula commented out uses a constant bigRadius circle size to define the size of the circles
            //let bigRadius = manager.height * 0.46 - 2;
            //let maxSpacing = Math.sqrt(Math.PI * bigRadius * bigRadius / maxPlayers);
            //let r = maxSpacing * 0.7;

            // This formula uses a constant radius and spacing player circle size to define the size of the big circle
            let r = 11;
            let spacing = 15;
            let minBigRadius = Math.sqrt(maxPlayers * spacing * spacing / Math.PI);
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
                    if(count + 1 > maxPlayers) break;
                    circles[playerNames[count]] = {
                        x: centerX - maxX + (minSpacingX * i) + (Math.random() * gap * 2 - gap),
                        y: centerY - y + (Math.random() * gap * 2 - gap),
                        r: r,
                        VORP: seasonData[playerNames[count]].VORP,
                        name: seasonData[playerNames[count]].name,
                        international: (seasonData[playerNames[count]].country !== 'USA'),
                        country: seasonData[playerNames[count]].country
                    };
                    count++;
                }
            }
            return circles;
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

            // let yStart = midY - bigRadius;
            // let yEnd = midY + bigRadius + 20;
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

            for(let circle in manager.circlesAP) {
                let playerCircle = manager.circlesAP[circle];
                p.circle(playerCircle.x, playerCircle.y, playerCircle.r);
                if (p.dist(p.mouseX, p.mouseY, playerCircle.x, playerCircle.y) < (playerCircle.r / 2 + 5)) {
                    this.clickedCircle = playerCircle;
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
        },
    };

})();