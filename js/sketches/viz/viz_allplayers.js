(function () {

    window.VisAllPlayers = {
        doneLoading: false,
        seed: null,
        seasonData: null,
        currentSeason: null,

        preload: function(manager) {
            let testSeasons = ["1996-97", "2015-16", "2020-21", "2021-22"];
            this.currentSeason = testSeasons[2] // will change to be determined by manager
            this.seed = Math.random() * 10; // can be set to static
            this.seasonData = manager.data[this.currentSeason];
            this.doneLoading = true;
        },

        draw: function (p, manager, ai, progress) {
            if(!this.doneLoading) {
                VisAllPlayers.preload(manager);
            }

            let maxPlayers = Object.keys(this.seasonData).length;

            p.noStroke();
            p.fill('black');

            p.textSize(20);
            p.textStyle(p.BOLD);
            p.text('NBA Season ' + this.currentSeason, manager.offsetX + 5, manager.offsetY + 35);
            p.textSize(18);
            p.textStyle(p.NORMAL);
            p.text('Total Players: ' + maxPlayers, manager.offsetX + 5, manager.offsetY + 55);


            let bigRadius = manager.height * 0.46 - 2;
            // p.circle(manager.offsetX + manager.width / 2, manager.offsetY + manager.height / 2, bigRadius * 2);

            let midX = (manager.offsetX || 0) + (manager.width || 600) / 2;
            let midY = (manager.offsetY || 0) + (manager.height || 520) / 2 + 40;
            // p.line(xStart, yEnd, xStart, yStart);
            // p.line(xEnd, yEnd, xEnd, yStart);

            //let pixelsToMeter = xDistance / 13.42;

            let yStart = midY - bigRadius;
            let yEnd = midY + bigRadius + 20;
            let xStart = manager.offsetX;
            let xEnd = manager.offsetX + manager.width;

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
            let maxSpacing = Math.sqrt(p.PI * bigRadius * bigRadius / maxPlayers);
            let r = maxSpacing * 0.7;
            console.log(maxSpacing)
            let spacing = maxSpacing;
            let maxCountRows = Math.floor(bigRadius * 2 / spacing) //get the max amount of rows possible with spacing
            let minSpacingY = bigRadius * 2 / maxCountRows;
            p.randomSeed(this.seed);
            let gap = spacing - r;
            let count = 0;
            for(let row = 0; row <= maxCountRows; row++) {
                let y = minSpacingY / 2 + row * minSpacingY - bigRadius;
                let maxX = Math.sqrt(bigRadius * bigRadius - y * y);
                let maxCountCols = Math.floor(maxX * 2 / spacing);
                let minSpacingX = (maxCountCols != 0 ? maxX * 2 / maxCountCols : 0);
                for(let i = 0; i <= maxCountCols; i++) {
                    if(count + 1 > maxPlayers) break;
                    p.circle(midX - maxX + (minSpacingX * i) + p.random(-gap, gap), midY - y + p.random(-gap, gap), r);
                    count++;
                }
            }

            p.noStroke();
            p.fill('black');
        }

    };

})();