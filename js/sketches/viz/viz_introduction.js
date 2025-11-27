
(function () {
    window.VizIntro = {
        doneLoading: false,

        preload: function(manager, p){
            this.conclusionImage = p.loadImage("js/sketches/images/narrative/conclusionImage.webp");
            this.introImage = p.loadImage("js/sketches/images/narrative/introImage.webp");

            this.doneLoading = true;
        },

        draw: function (p, manager, ai, progress) {
            if (!this.doneLoading){
                VizIntro.preload(manager, p);
            }

            var cx = (manager.offsetX || 0) + (manager.width || 600) / 2;
            var cy = (manager.offsetY || 0) + (manager.height || 520) / 3;
            p.push();
            p.noStroke();
            p.fill(255);
            

            p.fill(0);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(15);
            p.imageMode(p.CENTER);

            if (ai === 8 || ai === 9){
                let w = this.conclusionImage.width * 0.5;
                let h = this.conclusionImage.height * 0.5;
                p.image(this.conclusionImage, cx, cy + 100, w, h);
                p.textStyle(p.ITALIC)
                p.text('(From left to right): Giannis Antetokounmpo (from Greece), Nikola Jokić (from Serbia)', cx - 30, cy + 360);
            } else {
                let w = this.introImage.width * 0.4;
                let h = this.introImage.height * 0.4;
                p.image(this.introImage, cx, cy + 100, w, h);
                p.textStyle(p.ITALIC)
                p.text('(From left to right): Lauri Markannen (Finland), Nikola Jokić (Serbia),\n Giannis Antetokounmpo (Greece), Pascal Siakam (Cameroon)', cx - 30, cy + 360);
            }
            p.pop();
            
        }
    };
})();