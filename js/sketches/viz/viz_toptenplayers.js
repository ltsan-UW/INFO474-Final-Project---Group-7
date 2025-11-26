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
            this.isHovering = -1;
            this.doneLoading = true;
        },
        
        draw: function (p, manager, ai, progress) {
            if (!this.doneLoading){
                VizTopTenPlayers.preload(manager);
            }

            var cx = (manager.offsetX || 0) + (manager.width || 600) / 2;
            var cy = (manager.offsetY || 0) + (manager.height || 520) / 3;

            // Title
            p.push()

            p.fill("black");
            p.textSize(18);
            p.textFont("Tahoma");
            p.textStyle(p.BOLD);
            p.text("NBA " + this.top10[0].season + "\nInternational vs Domestic \nTop 10 players by VORP", cx - 275, cx - 350);

            p.pop()


            // Instructions
            p.push()

            p.fill("black");
            p.textSize(16);
            p.textFont("Tahoma");
            p.text("Guess the nationality of the top 10 players of the season.\nHover over each individual card or hold down the\n'Show All' button to reveal their name and nationality.", cx - 275, cx + 115);

            p.pop()

            // KEY
            p.push()

            p.fill("black");
            p.textSize(12);
            p.textFont("Tahoma");
            p.textStyle(p.BOLD);

            // Legend Box
            p.fill("white");
            p.stroke("black");
            p.rectMode(p.CENTER);
            p.rect(cx + 115, cx - 325, 250, 90, 2);
            p.rectMode(p.CORNER);
            p.fill("black");
            p.stroke("white");

            // Legend Title
            p.textSize(16);
            p.text("Legend", cx, cx - 350);
            p.textSize(12);

            // Legend Keys, USA and International
            p.fill("blue");
            p.square(cx, cx - 340, 20);
            p.fill("purple");
            p.square(cx, cx - 310, 20);

            // Legend Text
            p.textAlign(p.LEFT, p.CENTER);
            p.fill("black");
            
            p.text("USA", cx + 25, cx - 330);
            p.text("International", cx + 25, cx - 300);

            p.text("PTS = Points", cx + 125, cx - 335);
            p.text("AST = Assists", cx + 125, cx - 315);
            p.text("REB = Rebounds", cx + 125, cx - 295);

            p.pop()

            // Show All Button
            let showAll;
            p.push()

            p.rectMode(p.CENTER);
            let buttonPress;
            let buttonX = 630;
            let buttonY = 500;
            let buttonWidth = 100;
            let buttonHeight = 40;

            let buttonDistX = p.dist(p.mouseX, 0, buttonX, 0);
            let buttonDistY = p.dist(0, p.mouseY, 0, buttonY);

            p.fill("lightgrey");
            if (buttonDistX <= buttonWidth / 2 && buttonDistY <= buttonHeight / 2) {
                p.fill(180);
                buttonHover = true;
            } else {
                buttonHover = false;
                p.fill(225);
            }

            if (p.mouseIsPressed && buttonHover) {
                showAll = true;
            } else {
                showAll = false;
            }

            p.stroke("black");
            p.strokeWeight(1);
            p.rect(buttonX, buttonY, buttonWidth, buttonHeight, 10);

            p.strokeWeight(0);
            p.fill("black");
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Show All", buttonX, buttonY);

            p.pop()


            // Basketball Cards
            p.push()

            p.fill("black");
            p.textSize(10);
            p.textFont("Tahoma");
            p.textStyle(p.BOLD);
            p.textAlign(p.CENTER);

            let arrayCount = 0;
            let baseX = cx - 350;
            let baseY = cy - 150;
            let rowGap = 175;
            

            for (y = 1; y <= 2; y++) {
                for (x = 1; x <= 5; x++) {
                    
                    p.stroke("black");
                    p.fill("white");
                    p.rectMode(p.CENTER);

                    p.fill(240, 240, 240);
                    p.rect((baseX) + (x * 120), (baseY + 15) + (y * rowGap), 105, 162, 2);
                    p.fill("white");

                    p.rect((baseX) + (x * 120), (baseY + 63) + (y * rowGap), 90, 50, 2);
                    p.line(baseX - 45 + (x * 120), (baseY + 55) + (y * rowGap), baseX + 45 + (x * 120), (baseY + 55) + (y * rowGap));
                    p.rectMode(p.CORNER);

                    p.stroke("white");
                    p.fill("black");
                    let curPlayer = this.top10[arrayCount];
                    p.textWrap(p.WORD);

                    p.textAlign(p.CENTER, p.BOTTOM);
                    p.text("VORP: " + curPlayer.VORP, (baseX) + (x * 120), (baseY + 52) + (y * rowGap));
                    p.text("PTS", (baseX - 30) + (x * 120), (baseY + 69) + (y * rowGap))
                    p.text("AST", (baseX) + (x * 120), (baseY + 69) + (y * rowGap))
                    p.text("REB", (baseX + 30) + (x * 120), (baseY + 69) + (y * rowGap))
                    p.text(curPlayer.pts, (baseX - 30) + (x * 120), (baseY + 84) + (y * rowGap))
                    p.text(curPlayer.ast, (baseX) + (x * 120), (baseY + 84) + (y * rowGap))
                    p.text(curPlayer.reb, (baseX + 30) + (x * 120), (baseY + 84) + (y * rowGap))

                    p.stroke("black");

                    let circleX = (baseX) + (x * 120);
                    let circleY = (cy - 150) + (y * rowGap);
                    let diam = 55;

                    // check if hovering over this circle
                    let circleDist = p.dist(p.mouseX, p.mouseY, circleX, circleY);
                    p.fill("grey");
                    if (circleDist <= diam / 2 || showAll == true) {
                        this.hoveredIndex = arrayCount;
                        p.fill("black");
                        p.stroke("white");
                        p.text(curPlayer.name, (baseX - 50) + (x * 120), (baseY - 65) + (y * rowGap), 100, 30);

                        if (curPlayer.country === "USA") {
                            p.fill("blue"); // darken on hover
                        } else {
                            p.fill("purple"); // darken on hover
                        }
                    }
                   
                    p.circle(circleX, circleY, diam);
                    
                    arrayCount++;
                }
            }

            //X COORD -280 left, 220 right
            //Y COORD -60 top, 280 bottom
            p.pop()
        }
    };
})();