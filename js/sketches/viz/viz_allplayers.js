(function () {

    window.VisAllPlayers = {
        doneLoading: false,
        seed: null,
        seasonData: null,
        currentSeason: null,

        preload: function(manager) {
            this.currentSeason = "2020-21"; //will change to be determined by manager
            this.seed = Math.random() * 10;
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
            p.text('NBA Season ' + this.currentSeason, manager.offsetX, manager.offsetY + 35);
            p.textSize(18);
            p.textStyle(p.NORMAL);
            p.text('Total Players: ' + maxPlayers, manager.offsetX, manager.offsetY + 55);


            let bigRadius = manager.height * 2 / 5 - 2;
            // p.circle(manager.offsetX + manager.width / 2, manager.offsetY + manager.height / 2, bigRadius * 2);

            let midX = (manager.offsetX || 0) + (manager.width || 600) / 2;
            let midY = (manager.offsetY || 0) + (manager.height || 520) / 2;
            let yStart = midY - bigRadius;
            let yEnd = midY + bigRadius;
            let xStart = midX - bigRadius;
            let xEnd = midX + bigRadius;
            // p.line(xStart, yEnd, xStart, yStart);
            // p.line(xEnd, yEnd, xEnd, yStart);


            p.strokeWeight(1);
            p.stroke('grey')
            p.fill('lightgrey');
            let spacing = 20;
            let maxCountRows = Math.floor(bigRadius * 2 / spacing) //get the max amount of rows possible with spacing
            let minSpacingY = bigRadius * 2 / maxCountRows;
            p.randomSeed(this.seed);
            let r = 13;
            let gap = spacing - r;
            for(let row = 0; row <= maxCountRows; row++) {
                let y = minSpacingY / 2 + row * minSpacingY - bigRadius;
                let maxX = Math.sqrt(bigRadius * bigRadius - y * y);
                let maxCountCols = Math.floor(maxX * 2 / spacing);
                let minSpacingX = (maxCountCols != 0 ? maxX * 2 / maxCountCols : 0);
                for(let i = 0; i <= maxCountCols; i++) {
                    p.circle(midX - maxX + (minSpacingX * i) + p.random(-gap, gap), midY + y + p.random(-gap, gap), r);
                }
            }
        }

    };

})();