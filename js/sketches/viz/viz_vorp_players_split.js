// add country flags


(function () {

    window.VizVorpPlayersSplit = {
        doneLoading: false,
        maxPlayers: 0,
        circlesVorpPS: null,
        mouseClick: false,

        preload: function(manager, p) {

            let midX = (manager.offsetX || 0) + (manager.width || 600) / 2;
            let midY = (manager.offsetY || 0) + (manager.height || 520) / 2 + 40;
            let seasonData = manager.data[manager.currentSeason];
            this.maxPlayers = Object.keys(seasonData).length;
            const vorpMapWorse = 4;
            const vorpMapBest = 4;

            function createCluster(centerX, centerY, prevCircles, minVORP, maxVORP, p, bigRadius, scatterStrength) {
                let newCircles = {};

                let maxY = bigRadius * 2;
                let gap = 3 * scatterStrength;
                let count = 0;
                let yCurrDistance = -bigRadius;
                while(count < prevCircles.length && yCurrDistance < maxY) {
                    let maxR = Math.sqrt(bigRadius * bigRadius - yCurrDistance * yCurrDistance);
                    let maxX = Math.sqrt(bigRadius * bigRadius - yCurrDistance * yCurrDistance) * 2;
                    let xCurrDistance = 0;
                    let largestR = 1;
                    while(count < prevCircles.length && xCurrDistance < maxX) {

                        let currCircle = prevCircles[count];
                        let newR = p.map(currCircle.VORP, minVORP, maxVORP, currCircle.r / vorpMapWorse, currCircle.r * vorpMapBest);
                        newCircles[currCircle.name] = {
                            x: centerX - maxR + xCurrDistance +  (Math.random() * gap * 2 - gap),
                            y: centerY - yCurrDistance + (Math.random() * gap * 2 - gap),
                            r: newR,
                            VORP: currCircle.VORP,
                            name: currCircle.name,
                            international: currCircle.international,
                            country: currCircle.country
                        };
                        if(largestR < newR) largestR = newR;
                        xCurrDistance += newR;
                        count++;
                    }
                    yCurrDistance += largestR;
                }

                return newCircles;
            }


            // load all players circles data from viz 1 and/or 2 if null
            if(!manager.circlesPS || Object.keys(manager.circlesPS).length === 0) {
                if(!manager.circlesAP || Object.keys(manager.circlesAP).length === 0) {
                    let newCircles = VizAllPlayers.createCirclesAP(midX, midY, seasonData, manager.circleSize.r, manager.circleSize.spacing, manager.circleScatterStrength)
                    manager.setCirclesAP(newCircles);

                    // load flag images if null
                    if(manager.flagImages === null) {
                        let flags = VizAllPlayers.createFlagImages(newCircles, p);
                        manager.setFlagImages(flags);
                    }
                }
                let newCircles = VizPlayersSplit.createPlayersSplitClusters(midX, midY, manager.circlesAP, manager.circleSize.r, manager.circleSize.spacing, manager.circleScatterStrength)
                manager.setCirclesPS(newCircles);
            }

            const vorpValues = Object.values(seasonData).map(player => player.VORP);

            const maxVORP = Math.max(...vorpValues);
            const minVORP = Math.min(...vorpValues);


            const intPrevCircles = Object.values(manager.circlesPS.int)
                .sort((a, b) => b.VORP - a.VORP);  // highest → lowest

            const usaPrevCircles = Object.values(manager.circlesPS.usa)
                .sort((a, b) => b.VORP - a.VORP);  // highest → lowest

            //const intTotalVORP = intPrevCircles.reduce((sum, c) => sum + p.map(c.VORP, minVORP, maxVORP, 11 / vorpMapWorse, 11 * vorpMapBest) * p.map(c.VORP, minVORP, maxVORP, 11 / vorpMapWorse, 11 * vorpMapBest) * Math.PI, 0);
            const usaTotalVORP = usaPrevCircles.reduce((sum, c) => sum + p.map(c.VORP, minVORP, maxVORP, 11 / vorpMapWorse, 11 * vorpMapBest) * p.map(c.VORP, minVORP, maxVORP, 11 / vorpMapWorse, 11 * vorpMapBest) * Math.PI, 0);

            const usaBigRadius = Math.sqrt(usaTotalVORP / 2 / Math.PI);
            // let intValues = createCluster(midX / 2, midY, r, spacing, intPrevCircles, minVORP, maxVORP, p, Math.sqrt(intTotalVORP / 2 / Math.PI));
            // let usaValues = createCluster(midX / 4 * 5.5, midY, r, spacing, usaPrevCircles, minVORP, maxVORP, p, Math.sqrt(usaTotalVORP / 2 / Math.PI));
            let intValues = createCluster(midX - usaBigRadius * 0.9 - 15, midY, intPrevCircles, minVORP, maxVORP, p, usaBigRadius * 0.85, manager.circleScatterStrength);
            let usaValues = createCluster(midX + usaBigRadius * 0.9 + 15, midY, usaPrevCircles, minVORP, maxVORP, p, usaBigRadius * 0.85, manager.circleScatterStrength);

            this.circlesVorpPS = {int: intValues, usa: usaValues};

            this.doneLoading = true;
        },

        draw: function (p, manager, ai, progress) {
            if(!this.doneLoading) {
                this.preload(manager, p);
            }

            p.noFill();

            VizAllPlayers.drawHeader(p, manager.currentSeason, manager, this.maxPlayers);

            p.strokeWeight(1);
            p.stroke('grey')
            p.fill('lightgrey');

            let hoverCircle = null;


            //Draw circles: usa, then international
            for(let circle in this.circlesVorpPS.usa) {
                let playerCircle = this.circlesVorpPS.usa[circle];
                let newX = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, manager.circlesPS.usa[playerCircle.name].x, playerCircle.x);
                let newY = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, manager.circlesPS.usa[playerCircle.name].y, playerCircle.y);
                let newR = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, manager.circlesPS.usa[playerCircle.name].r, playerCircle.r);
                playerCircle = {...playerCircle, x: newX, y: newY, r: newR};

                VizAllPlayers.drawCircle(playerCircle, p, manager.flagImages);

                if (p.dist(p.mouseX, p.mouseY, newX, newY) < (newR / 2 + 5)) {
                    hoverCircle = playerCircle;
                }
            }
            for(let circle in this.circlesVorpPS.int) {
                let playerCircle = this.circlesVorpPS.int[circle];
                let newX = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, manager.circlesPS.int[playerCircle.name].x, playerCircle.x);
                let newY = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, manager.circlesPS.int[playerCircle.name].y, playerCircle.y);
                let newR = p.map(p.constrain(progress, 0.5, 0.62), 0.5, 0.62, manager.circlesPS.int[playerCircle.name].r, playerCircle.r);
                playerCircle = {...playerCircle, x: newX, y: newY, r: newR};

                VizAllPlayers.drawCircle(playerCircle, p, manager.flagImages);

                if (p.dist(p.mouseX, p.mouseY, newX, newY) < (newR / 2 + 5)) {
                    hoverCircle = playerCircle;
                }
            }


            // Hover
            if (hoverCircle !== null && p.dist(p.mouseX, p.mouseY, hoverCircle.x, hoverCircle.y) > (hoverCircle.r / 2 + 5)) {
                hoverCircle = null;
            }
            VizAllPlayers.handleHover(hoverCircle, p, manager, true);

            p.noStroke();
            p.fill('black');
        }
    };

})();