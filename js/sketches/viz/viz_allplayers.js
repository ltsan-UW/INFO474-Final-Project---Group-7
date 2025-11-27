(function () {

    window.VizAllPlayers = {
        doneLoading: false,
        maxPlayers: 0,
        currentSeason: null,
        mouseClick: false,
        flags: null,

        preload: function(manager, p) {
            this.currentSeason = manager.currentSeason; // will change to be determined by manager
            let seasonData = manager.data[this.currentSeason];


            this.maxPlayers = Object.keys(seasonData).length;
            let midX = (manager.offsetX || 0) + (manager.width || 600) / 2;
            let midY = (manager.offsetY || 0) + (manager.height || 520) / 2 + 40;


            let newCircles = this.createCirclesAP(midX, midY, seasonData, manager.circleSize.r, manager.circleSize.spacing, manager.circleScatterStrength);
            manager.setCirclesAP(newCircles);

            // load flag images if null
            if(manager.flagImages === null) {
                let flags = this.createFlagImages(newCircles, p);
                manager.setFlagImages(flags);
            }

            // // Click function. Written with AI, I didn't wanna mess with using a onClick function and going through the instance stuff
            // document.querySelector('canvas').addEventListener('click', (e) => {
            //     this.mouseClick = !this.mouseClick;
            // });



            this.doneLoading = true;
        },

        createFlagImages: function(circles, p,) {
            let flags = new Map();
            for(let name in circles) {
                if(!flags.has(circles[name].country)) {
                    let img = p.loadImage(
                        "js/sketches/images/player_flags/" + circles[name].country + ".webp",
                        (img) => {
                            img.resize(100, 100);
                            flags.set(circles[name].country, img);
                        },
                        () => { console.error("Failed to load country: " + circles[name].country); }
                    );
                }
            }
            return flags;
        },

        createCirclesAP: function(centerX, centerY, seasonData, r, spacing, scatterStrength) {

            // Convert seasonData object to a sorted array by VORP (descending)
            let sortedPlayers = Object.entries(seasonData)
                .sort((a, b) => b[1].VORP - a[1].VORP)  // sort descending by VORP
                .map(([name, stats]) => ({ name, ...stats })); // include player name in object


            let maxPlayers = sortedPlayers.length;
            let circles = {}

            // This formula commented out uses a constant bigRadius circle size to define the size of the circles
            //let bigRadius = manager.height * 0.46 - 2;
            //let maxSpacing = Math.sqrt(Math.PI * bigRadius * bigRadius / maxPlayers);
            //let r = maxSpacing * 0.7;

            // This formula uses a constant radius and spacing player circle size to define the size of the big circle
            let minBigRadius = Math.sqrt((maxPlayers) * spacing * spacing / Math.PI);
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
                    if(count + 1 > maxPlayers) break;
                    circles[sortedPlayers[count].name] = {
                        x: centerX - maxX + (minSpacingX * i) + (Math.random() * gap * 2 - gap),
                        y: centerY - y + (Math.random() * gap * 2 - gap),
                        r: r,
                        VORP: sortedPlayers[count].VORP,
                        name: sortedPlayers[count].name,
                        international: (sortedPlayers[count].country !== 'USA'),
                        country: sortedPlayers[count].country
                    };
                    count++;
                }
            }
            return circles;
        },

        draw: function (p, manager, ai, progress) {
            if(!this.doneLoading) {
                this.preload(manager, p);
            }

            p.noStroke();
            p.fill('black');

            p.textSize(20);
            p.textStyle(p.BOLD);
            p.text('NBA Season ' + this.currentSeason, manager.offsetX + 5, manager.offsetY + 35);
            p.textSize(18);
            p.textStyle(p.NORMAL);
            p.text('Total Players: ' + this.maxPlayers, manager.offsetX + 5, manager.offsetY + 55);


            // p.circle(manager.offsetX + manager.width / 2, manager.offsetY + manager.height / 2, bigRadius * 2);

            // p.line(xStart, yEnd, xStart, yStart);
            // p.line(xEnd, yEnd, xEnd, yStart);

            //let pixelsToMeter = xDistance / 13.42;

            // let yStart = midY - bigRadius;
            // let yEnd = midY + bigRadius + 20;
            // let xStart = manager.offsetX;
            // let xEnd = manager.offsetX + manager.width;

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

            let hoverCircle = null;
            for(let circle in manager.circlesAP) {
                let playerCircle = manager.circlesAP[circle];
                this.drawCircle(playerCircle, p, manager.flagImages);

                if (p.dist(p.mouseX, p.mouseY, playerCircle.x, playerCircle.y) < (playerCircle.r / 2 + 5)) {
                    hoverCircle = playerCircle;
                }
            }



            p.fill('white');
            p.rect(manager.offsetX + manager.width - 250 - 5, manager.offsetY + 15, 250, 50);

            // Hover
            if (hoverCircle !== null && p.dist(p.mouseX, p.mouseY, hoverCircle.x, hoverCircle.y) > (hoverCircle.r / 2 + 5)) {
                hoverCircle = null;
            }
            this.handleHover(hoverCircle, p, manager);


            p.noStroke();
            p.fill('black');
        },

        drawCircle: function(playerCircle, p, flagImages) {
            p.imageMode(p.CORNER);
            p.circle(playerCircle.x, playerCircle.y, playerCircle.r);
            if(flagImages.has(playerCircle.country)) {

                // Written with AI
                // --- create circular clip ---
                p.drawingContext.save();
                p.drawingContext.beginPath();
                p.drawingContext.arc(playerCircle.x, playerCircle.y, playerCircle.r / 2, 0, Math.PI * 2);
                p.drawingContext.clip();

                // --- draw image inside circle ---
                // Make the image exactly fill the circle

                p.image(flagImages.get(playerCircle.country), playerCircle.x - playerCircle.r / 2, playerCircle.y - playerCircle.r / 2, playerCircle.r, playerCircle.r);

                p.drawingContext.restore();
            }
        },

        handleHover: function(hoverCircle, p, manager) {
            p.fill('black');
            p.textAlign(p.CENTER, p.CENTER);
            if(hoverCircle != null) {
                p.cursor(p.HAND);
                p.fill('grey');
                p.stroke('black')
                p.strokeWeight(1)
                p.circle(hoverCircle.x, hoverCircle.y, hoverCircle.r + 4);

                let playerCircle = {...hoverCircle, r: hoverCircle.r * 2};
                this.drawCircle(playerCircle, p, manager.flagImages);
                p.fill('black');
                p.noStroke();
                p.text(hoverCircle.name, manager.offsetX + manager.width - 125 - 5, manager.offsetY + 40);
            } else {
                p.cursor(p.ARROW);
                p.noStroke();
                p.fill('grey');
                p.text("Hover over a player", manager.offsetX + manager.width - 125 - 5, manager.offsetY + 40);
            }
            p.textAlign(p.LEFT, p.BASELINE);
        }
    };

})();