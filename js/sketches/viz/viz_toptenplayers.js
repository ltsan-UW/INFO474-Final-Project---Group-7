// viz_toptenplayers.js

(function () {
    window.VizTopTenPlayers = {

        doneLoading: false,
        top10: [],

        preload: function(manager){

            let season2020 = manager.data["2023-24"]; // 2023 Season is placeholder for data visualization

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
            p.square(cx, cx - 340, 20);

            p.textAlign(p.LEFT, p.CENTER);
            p.fill("black");
            p.text("USA", cx + 25, cx - 360);
            p.text("International", cx + 25, cx - 330);

            p.pop()

            // Circles
            p.push()

            p.fill("black");
            p.textSize(10);
            p.textFont("Tahoma");
            p.textStyle(p.BOLD);
            p.textAlign(p.CENTER);

            let mx = p.mouseX;
            let my = p.mouseY;
            let arrayCount = 0;
            for (y = 1; y <= 2; y++) {
                for (x = 1; x <= 5; x++) {
                    p.fill("black");
                    let curPlayer = this.top10[arrayCount];
                    p.textWrap(p.WORD);
                    p.textAlign(p.CENTER, p.BOTTOM);
                    p.text(curPlayer.name, (cx - 400) + (x * 120), (cy - 220) + (y * 150), 100, 30)
                    
                    p.stroke("black");
                    p.fill("white");
                    p.rectMode(p.CENTER);
                    p.rect((cx - 350) + (x * 120), (cy - 95) + (y * 150), 90, 35, 2);
                    p.rect((cx - 350) + (x * 120), (cy - 95) + (y * 150), 25, 35, 2);
                    p.rectMode(p.CORNER);

                    p.stroke("white");
                    p.fill("black");
                    p.text("PTS", (cx - 380) + (x * 120), (cy - 100) + (y * 150))
                    p.text("AST", (cx - 350) + (x * 120), (cy - 100) + (y * 150))
                    p.text("REB", (cx - 320) + (x * 120), (cy - 100) + (y * 150))
                    p.text(curPlayer.pts, (cx - 380) + (x * 120), (cy - 85) + (y * 150))
                    p.text(curPlayer.ast, (cx - 350) + (x * 120), (cy - 85) + (y * 150))
                    p.text(curPlayer.reb, (cx - 320) + (x * 120), (cy - 85) + (y * 150))

                    if (curPlayer.country == "USA") {
                        p.fill("blue")
                    } else {
                        p.fill("purple")
                    }
                    p.circle((cx - 350) + (x * 120), (cy - 150) + (y * 150), 50 + (curPlayer.VORP * 2));

                    let circleX = (cx - 350) + (x * 120);
                    let circleY = (cy - 150) + (y * 150);
                    let diameter = 50 + (curPlayer.VORP * 2);

                    let d = p.dist(mx, my, circleX, circleY);
                    if (d <= diameter / 2) {
                        // tooltip
                        p.push();
                        p.stroke(0);
                        p.fill(255);
                        let w = 180;
                        let h = 60;
                        // position tooltip so it doesn't overlap mouse exactly
                        let tx = mx + 12;
                        let ty = my - h / 2;
                        p.rect(tx, ty, w, h, 6);
                        p.noStroke();
                        p.fill(0);
                        p.textAlign(p.LEFT, p.TOP);
                        p.textSize(12);
                        p.text(curPlayer.name + "\nVORP: " + curPlayer.VORP + "\nPTS: " + curPlayer.pts + "  AST: " + curPlayer.ast + "  REB: " + curPlayer.reb, tx + 6, ty + 6);
                        p.pop();
                    }
                    
                    arrayCount++;
                }
            }
            //X COORD -280 left, 220 right
            //Y COORD -60 top, 280 bottom
            p.pop()
        }
    };
})();