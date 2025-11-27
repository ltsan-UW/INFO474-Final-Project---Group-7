(function () {

    window.VizPlayersSplit = {
        doneLoading: false,
        maxPlayers: 0,
        mouseClick: false,

        preload: function(manager, p) {
            let seasonData = manager.data[manager.currentSeason];
            this.maxPlayers = Object.keys(seasonData).length;
            let midX = (manager.offsetX || 0) + (manager.width || 600) / 2;
            let midY = (manager.offsetY || 0) + (manager.height || 520) / 2 + 40;

            // load all players circles data from viz 1 if null
            if(!manager.circlesAP || Object.keys(manager.circlesAP).length === 0) {
                let newCircles = VizAllPlayers.createCirclesAP(midX, midY, seasonData, manager.circleSize.r, manager.circleSize.spacing, manager.circleScatterStrength)
                manager.setCirclesAP(newCircles);

                // load flag images if null
                if(manager.flagImages === null) {
                    let flags = VizAllPlayers.createFlagImages(newCircles, p);
                    manager.setFlagImages(flags);
                }
            }

            let newCircles = this.createPlayersSplitClusters(midX, midY, manager.circlesAP, manager.circleSize.r, manager.circleSize.spacing, manager.circleScatterStrength)
            manager.setCirclesPS(newCircles);

            this.doneLoading = true;
        },

        createPlayersSplitClusters: function(centerX, centerY, circlesAP, r, spacing, scatterStrength) {

            function createCluster(centerX, centerY, r, spacing, prevCircles, scatterStrength) {
                let newCircles = {};

                let minBigRadius = Math.sqrt(prevCircles.length * spacing * spacing / Math.PI);
                let bigRadius = minBigRadius;
                let maxCountRows = Math.floor(bigRadius * 2 / spacing) //get the max amount of rows possible with spacing
                let minSpacingY = bigRadius * 2 / maxCountRows;
                let gap = (spacing - r) * scatterStrength;
                let count = 0;
                for(let row = 0; row <= maxCountRows; row++) {
                    let y = minSpacingY / 2 + row * minSpacingY - bigRadius;
                    let maxX = Math.sqrt(bigRadius * bigRadius - y * y);
                    let maxCountCols = Math.round(maxX * 2 / spacing);
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
                return newCircles;
            }

            const circlesArray = Object.values(circlesAP);
            const intPrevCircles = circlesArray.filter(player => player.international);
            const usaPrevCircles = circlesArray.filter(player => !player.international);

            let intValues = createCluster(centerX / 2 - 10, centerY, r, spacing, intPrevCircles, scatterStrength);
            let usaValues = createCluster(centerX / 8 * 10 + 25, centerY, r, spacing, usaPrevCircles, scatterStrength);

            return {int: intValues, usa: usaValues};
        },

        draw: function (p, manager, ai, progress) {
            if(!this.doneLoading) {
                this.preload(manager, p);
            }


            VizAllPlayers.drawHeader(p, manager.currentSeason, manager);


            p.strokeWeight(1);
            p.stroke('grey')
            p.fill('lightgrey');

            let hoverCircle = null;
            for(let circle in manager.circlesPS.usa) {
                let playerCircle = manager.circlesPS.usa[circle];
                let newX = p.map(progress, 0.5, 1, manager.circlesAP[playerCircle.name].x, playerCircle.x);
                let newY = p.map(progress, 0.5, 1, manager.circlesAP[playerCircle.name].y, playerCircle.y);
                playerCircle = {...playerCircle, x: newX, y: newY};


                VizAllPlayers.drawCircle(playerCircle, p, manager.flagImages);

                if (p.dist(p.mouseX, p.mouseY, newX, newY) < (playerCircle.r / 2 + 5)) {
                    hoverCircle = {...playerCircle, x: newX, y: newY};
                }
            }
            for(let circle in manager.circlesPS.int) {
                let playerCircle = manager.circlesPS.int[circle];
                let newX = p.map(progress, 0.5, 1, manager.circlesAP[playerCircle.name].x, playerCircle.x);
                let newY = p.map(progress, 0.5, 1, manager.circlesAP[playerCircle.name].y, playerCircle.y);
                playerCircle = {...playerCircle, x: newX, y: newY};


                VizAllPlayers.drawCircle(playerCircle, p, manager.flagImages);

                if (p.dist(p.mouseX, p.mouseY, newX, newY) < (playerCircle.r / 2 + 5)) {
                    hoverCircle = {...playerCircle, x: newX, y: newY};
                }
            }

            // Hover
            if (hoverCircle !== null && p.dist(p.mouseX, p.mouseY, hoverCircle.x, hoverCircle.y) > (hoverCircle.r / 2 + 5)) {
                hoverCircle = null;
            }
            VizAllPlayers.handleHover(hoverCircle, p, manager);


            p.noStroke();
            p.fill('black');
        }
    };

})();