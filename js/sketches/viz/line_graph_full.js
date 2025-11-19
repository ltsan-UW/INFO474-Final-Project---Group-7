// viz_title.js
// Draw title-style screens for early active indexes (0 and 1)
(function () {
    window.VizLineGraphFull = {

        doneLoading: false,

        preload: function(manager){
            let playerCounts = {};
            console.log("hello world");

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
            }

            this.doneLoading = true;
            //i will write the pre processing here
        },

        draw: function (p, manager, ai, progress) {
            if (!this.doneLoading){
                VizLineGraphFull.preload(manager);
            }
            
            console.log("Yo");
            var cx = (manager.offsetX || 0) + (manager.width || 600) / 2;
            var cy = (manager.offsetY || 0) + (manager.height || 520) / 3;

            p.fill("black");

            p.textSize(20);
            p.text("Testing", cx, cy);
            
        }
    };
})();