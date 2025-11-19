// viz_toptenplayers.js

(function () {
    window.VizTopTenPlayers = {

        doneLoading: false,
        playerCounts: [],

        preload: function(manager){

            let season2020 = manager.data["2020-21"]; // 2020 Season is placeholder for data visualization
            console.log(season2020);

            // Find the VORP, PTS, AST, and REB for top ten players in each season
            let playerArray = [];
            for (let player in season2020){
                let playerStatsObj = season2020[player];
                console.log(playerStatsObj)
                playerArray.push(playerStatsObj);
            }

            playerArray.sort(function(a, b) {
                return parseFloat(b.VORP) - parseFloat(a.VORP);
            });
            console.log(playerArray);

            this.doneLoading = true;
        },
        
        
        
        draw: function (p, manager, ai, progress) {
            if (!this.doneLoading){
                VizTopTenPlayers.preload(manager);
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

        }
    };
})();