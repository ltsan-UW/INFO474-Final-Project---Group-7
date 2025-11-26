
(function () {
    window.VizTimeline = {
        doneLoading: false,
        DR_Congo: null,

        preload: function(manager, p){
            this.DR_Congo = p.loadImage("js/sketches/images/emojis/DR_Congo.png");
            this.Germany = p.loadImage("js/sketches/images/emojis/Germany.png");
            this.Cameroon = p.loadImage("js/sketches/images/emojis/Cameroon.png");
            this.China = p.loadImage("js/sketches/images/emojis/China.png");
            this.Greece = p.loadImage("js/sketches/images/emojis/Greece.png");
            this.Serbia = p.loadImage("js/sketches/images/emojis/Serbia.png")
            this.Argentina = p.loadImage("js/sketches/images/emojis/Argentina.png")

            this.doneLoading = true;
        },

        draw: function (p, manager, ai, progress) {

            if (!this.doneLoading){
                VizTimeline.preload(manager, p);
            }

            
            var cx = (manager.offsetX || 0) + (manager.width || 600) / 2;
            var cy = (manager.offsetY || 0) + (manager.height || 520) / 3;

            

            p.push();
            p.background(255);
            p.fill("black");
            p.textAlign(p.CENTER, p.CENTER);
            p.textFont("Tahoma, Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif");

            

            p.textSize(20);
            p.textStyle(p.BOLD);
            p.text("Highlights of International Players in the NBA (1996 - 2024)", cx - 78, cy - 110);
            
            

            // timeline start/end
            let startYear = 1996;
            let endYear = 2024;
            let timelineWidth = 500;
            let lineX1 = (cx - 69) - timelineWidth / 2;
            let lineX2 = cx + (timelineWidth / 2) - 10;

           // rgba(193, 193, 193, 1)
        
            // draw main line
            p.stroke(0);
            p.strokeWeight(40);
            p.stroke(31, 119, 180);
            p.line(lineX1, cy + 100, lineX2, cy + 100);
            p.noStroke();
            p.textSize(40)
            p.fill(0, 0, 0, 100);
            // example events
            let events = [
                { year: 1996, country: this.DR_Congo, label: "Dikembe Mutombo\n wins defensive \n player of the year" },
                { year: 2002, country: this.China, label: "Yao Ming\n drafted #1 overall \n by Houston Rockets" },
                { year: 2004, country: this.Argentina, label: "Manu Ginóbili\n of the San Antonio \n Spurs wins Olympic Gold" },
                { year: 2011, country: this.Germany, label: "Dirk Nowitzki \n wins NBA Championship\n and finals MVP" },
                { year: 2017, country: this.Cameroon, label: "Joel Embiid\n makes the NBA \n All-Star team for first time" },
                { year: 2020, country: this.Greece, label: "Giannis Antetokounmpo \n wins NBA Most \n Valuable Player"},
                { year: 2024, country: this.Serbia, label: "Nikola Jokic\n wins third MVP \n award" }
            ];

            
            
            events.forEach((ev, i) => {
                // map year to position
                p.noStroke();
                let x = p.map(ev.year, startYear, endYear, lineX1, lineX2);
                let y = cy + 100;

                // draw marker
                p.fill(127, 187, 214);
                p.circle(x, y, 18);
                p.fill("white");
                p.circle(x, y, 7);

                // draw annotation (alternate above/below line)
                let labelY = (cy + 100) + (i % 2 === 0 ? -140 : 140);
                p.fill(0);
                p.textSize(11);
                p.textStyle(p.BOLD);
                p.text(ev.label, x, labelY);

                // add image above/below annotation
                p.imageMode(p.CENTER);
                p.image(ev.country, x, labelY - (i % 2 === 0 ? -32 : 32), 30, 30);

                // optional line connecting marker to text
                //p.stroke(127, 187, 214);
                p.stroke("gray");
                p.strokeCap(p.SQUARE);
                p.strokeWeight(2.5);
                p.line(x, y, x, labelY - (i % 2 === 0 ? -45 : 45));
                p.noStroke();
                p.textSize(20);
                p.textStyle(p.ITALIC);
                p.text(ev.year, x + (i % 2 === 0 ? 30 : -30), labelY - (i % 2 === 0 ? -70 : 70))
                
            });

            p.pop();
        }
    };
})();