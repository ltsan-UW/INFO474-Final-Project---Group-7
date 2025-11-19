// viz_title.js
// Draw title-style screens for early active indexes (0 and 1)
(function () {
    window.VizLineGraphFull = {

        doneLoading: false,
        playerCounts: [],

        preload: function(manager){

            //Find the % of international players for all seasons
            for (let season in manager.data){
                let usaCount = 0; 
                let interCount = 0;
                let curSeason = manager.data[season];
                for (let player in curSeason){
                    let playerObj = curSeason[player];
                    if (playerObj.country !== "USA"){
                        interCount++;
                    } else {
                        usaCount++;
                    }
                }
                let total = interCount + usaCount;
                let interPerc = interCount/total;
                this.playerCounts.push({
                    Season: season,
                    Percentage: interPerc.toFixed(2)
                })
            }

            for (let i = 0; i < 4; i++){
                let current = this.playerCounts.pop();
                this.playerCounts.unshift(current);
            }
            console.log(this.playerCounts);
            this.doneLoading = true;
        },

        //rgb(209, 13, 13)) <---- rgb color picker

        draw: function (p, manager, ai, progress) {
            if (!this.doneLoading){
                VizLineGraphFull.preload(manager);
            }

            var cx = (manager.offsetX || 0) + (manager.width || 600) / 2;
            var cy = (manager.offsetY || 0) + (manager.height || 520) / 3;

            p.fill("black");

            p.textSize(20);

            // STEP 1. BORDERS 
            p.push()
            p.strokeCap(p.SQUARE);
            p.stroke(187, 187, 187);
            p.strokeWeight(2);
            p.line(cx - 320, cy-100, cx - 320, cy + 320);
            p.line(cx-320,cy + 320, cx + 260, cy + 320);
            p.pop()

            //STEP 2. DEFINING "TICK" LOCATIONS
            p.push()
            p.strokeCap(p.SQUARE);
            p.stroke(209, 13, 13);
            p.strokeWeight(3);

            // 640 / 28
            let pos = cx-320 + 20.6;
            let base = cy+320;
            //let previousX = 0;
            //let previousY = 0;
            for (let i = 0; i < this.playerCounts.length; i++) {
                let obj = this.playerCounts[i];
                let percentage = (420) * obj.Percentage;
                p.line(pos, base - percentage, pos, base);
                pos += 20.6;
            }
            p.pop();


        }
    };
})();