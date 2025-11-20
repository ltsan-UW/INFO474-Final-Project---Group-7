// viz_title.js
// Draw title-style screens for early active indexes (0 and 1)
(function () {
    window.VizLineGraphZoomed = {

        doneLoading: false,
        playerCounts: [],
        chosenYear: null,

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

        //rgba(219, 219, 219, 1)) <---- rgb color picker

        draw: function (p, manager, ai, progress) {
            if (!this.doneLoading){
                VizLineGraphZoomed.preload(manager);
            }

            var cx = (manager.offsetX || 0) + (manager.width || 600) / 2;
            var cy = (manager.offsetY || 0) + (manager.height || 520) / 3;

            p.fill("black");

            p.textSize(20);
            p.textFont("Tahoma");
            p.textStyle(p.BOLD);

            // STEP 1. BORDERS ----------------
            p.push()
            p.strokeCap(p.ROUND);
            p.stroke(187, 187, 187);
            p.strokeWeight(2);
            p.line(cx - 320, cy-100, cx - 320, cy + 320);
            p.line(cx-320,cy + 320, cx + 260, cy + 320);
            p.pop()

            //STEP 2. BUILD THE GRAPH
            p.push()
            p.strokeWeight(3);

            let pos = cx-320 + 193.3;
            let base = cy+320;

            let previousX = 0;
            let previousY = 0;
            let previousTickLength = 10;
            p.textSize(8.5);
            p.textAlign(p.CENTER, p.CENTER);

            let seasonIndex = 24 + 1;
            for (let i = seasonIndex; i < this.playerCounts.length; i++) {
                let obj = this.playerCounts[i];
                let percentage = 420 * (obj.Percentage/0.50);
                p.stroke(13, 170, 209);
                p.strokeWeight(4);
                
                //line logic
                if (previousX === 0){
                    p.line(pos, base - percentage, pos - 193.3, base);
                } else {
                    p.line(pos, base - percentage, previousX, previousY);
                }
                p.stroke(187, 187, 187)
                p.strokeWeight(2);

                //the little "ticks" showing every other season
                if (previousTickLength === 10){
                    p.line(pos, base - 15, pos, base);
                    previousTickLength = 15;
                    p.noStroke();
                    p.text(obj.Season, pos, base + 10);
                } else {
                    p.line(pos, base - 10, pos, base);
                    previousTickLength = 10;
                    p.noStroke();
                    p.text(obj.Season, pos, base + 10);
                }
                previousX = pos;
                previousY = base - percentage;
                pos += 193.3;
            }

            //lines for 25% and 50% for reference as well as text
            p.stroke(219, 219, 219);
            p.fill(180, 180, 180);
            p.line(cx-320, cy + 110, cx + 260 ,cy + 110);
            p.line(cx-320, cy-100, cx + 260, cy-100);
            p.noStroke();
            p.fill("black");
            p.text("25%", cx-340, cy+110);
            p.text("50%", cx-340, cy-100);
            p.pop();

            
            //STEP 3: SUPPORTING TEXT -----------------------

            p.text("Percentage of NBA players not from the United States", cx - 320, cy - 150);
            p.text("1996-2024", cx - 320, cy - 120);
            
        }
    };
})();