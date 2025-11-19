// viz_toptenplayers.js

(function () {
    window.VizTopTenPlayers = {

        doneLoading: false,
        top10: [],

        preload: function(manager){

            let season2020 = manager.data["2020-21"]; // 2020 Season is placeholder for data visualization

            // Pushes all of the players into playerArray in preparation for sorting
            let playerArray = [];
            for (let player in season2020){
                let playerStatsObj = season2020[player];
                playerArray.push(playerStatsObj); 
            }

            // Sorts all players in player from highest to lowest based on VORP
            playerArray.sort(function(a, b) {
                return parseFloat(b.VORP) - parseFloat(a.VORP); 
            });

            // Adds the stats of the top 10 players by VORP to the 'top10' array
            this.top10 = playerArray.slice(0, 10);
            console.log(this.top10);
            this.doneLoading = true;
        },
        
        
        
        draw: function (p, manager, ai, progress) {
            if (!this.doneLoading){
                VizTopTenPlayers.preload(manager);
            }

            var cx = (manager.offsetX || 0) + (manager.width || 600) / 2;
            var cy = (manager.offsetY || 0) + (manager.height || 520) / 3;

            // // Visualization Borders
            // p.push()
            // p.strokeCap(p.ROUND);
            // p.stroke(187, 187, 187);
            // p.strokeWeight(2);
            // p.line(cx - 320, cy - 100, cx - 320, cy + 320); // Left border
            // p.line(cx - 320, cy + 320, cx + 260, cy + 320); // Bottom border
            // p.line(cx - 320, cy + -100, cx + 260, cy + -100); // Top border
            // p.line(cx + 260, cy - 100, cx + 260, cy + 320); // Right border
            //     // Left-most X-coord = -320
            //     // Right-most X-coord = 260
            //     // Top-most Y-coord = -100
            //     // Bottom-most Y-coord = 320
            // p.pop()

            // Title
            p.push()

            p.fill("black");
            p.textSize(18);
            p.textFont("Tahoma");
            p.textStyle(p.BOLD);
            p.text("NBA " + this.top10[0].season + "\nInternational vs Domestic \nTop 10 players by VORP", cx - 275, cx - 350);

            p.pop()

            // Key
            p.push()

            p.fill("black");
            p.textSize(12);
            p.textFont("Tahoma");
            p.textStyle(p.BOLD);

            p.fill("blue");
            p.square(cx, cx - 370, 20);
            p.fill("purple");
            p.square(cx, cx - 330, 20);

            p.textAlign(p.LEFT, p.CENTER);
            p.fill("black");
            p.text("USA", cx + 25, cx - 360);
            p.text("International", cx + 25, cx - 320);

            p.pop()

            // Circles
            p.push()

            p.fill("black");
            p.textSize(10);
            p.textFont("Tahoma");
            p.textStyle(p.BOLD);
            p.textAlign(p.CENTER);

            let arrayCount = 0;
            for (y = 1; y <= 2; y++) {
                for (x = 1; x <= 5; x++) {
                    p.fill("black");
                    let curPlayer = this.top10[arrayCount];
                    p.text(curPlayer.name, (cx - 350) + (x * 120), (cy - 190) + (y * 150))
                    p.text("PTS | AST | REB \n" + curPlayer.VORP + "     " + curPlayer.ast + "     " + curPlayer.reb, (cx - 350) + (x * 120), (cy - 100) + (y * 150))
                    if (curPlayer.country == "USA") {
                        p.fill("blue")
                    } else {
                        p.fill("purple")
                    }
                    p.circle((cx - 350) + (x * 120), (cy - 150) + (y * 150), 50 + (curPlayer.VORP * 2));
                    arrayCount++;
                }
            }
            //X COORD -280 left, 220 right
            //Y COORD -60 top, 280 bottom
            p.pop()
        }
    };
})();