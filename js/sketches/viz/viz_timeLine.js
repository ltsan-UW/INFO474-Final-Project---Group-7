
(function () {
    window.VizTimeline = {

        preload: function(manager){
            //p.textFont("Tahoma");
        },

        draw: function (p, manager, ai, progress) {

            var cx = (manager.offsetX || 0) + (manager.width || 600) / 2;
            var cy = (manager.offsetY || 0) + (manager.height || 520) / 3;

            p.push();
            p.background(255);
            p.fill("black");
            p.textAlign(p.CENTER, p.CENTER);
            p.textFont("Tahoma, Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif");

            p.textSize(20);
            p.textStyle(p.BOLD);
            p.text("International Players' Impact on the NBA (1996 - 2024)", cx - 95, cy - 110);
            p.textStyle(p.ITALIC);
            

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
            p.text("1996", lineX1, cy + 140);
            p.text("2024", lineX2, cy + 140);
            // example events
            let events = [
                { year: 1996, label: "Dikembe Mutombo 🇨🇩\n wins defensive \n player of the year, \n 1996" },
                { year: 2002, label: "Yao Ming 🇨🇳 \n drafted #1 overall \n by Houston Rockets, \n 2002" },
                { year: 2004, label: "Manu Ginóbili 🇦🇷 \n of the San Antonio \n Spurs wins Olympic Gold, \n 2004" },
                { year: 2011, label: "Dirk Nowitzki 🇩🇪 wins\n NBA Championship\n and finals MVP,\n 2011" },
                { year: 2017, label: "Joel Embiid 🇨🇲\n makes the NBA \n All-Star team for first time, \n 2017" },
                { year: 2020, label: "Giannis Antetokounmpo 🇬🇷 \n wins NBA Most \n Valuable Player \n award, 2020" },
                { year: 2024, label: "Nikola Jokic 🇷🇸\n wins third MVP \n award, \n 2024" }

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
                p.textSize(12);
                p.text(ev.label, x, labelY);

                // optional line connecting marker to text
                //p.stroke(127, 187, 214);
                p.stroke("gray");
                p.strokeCap(p.SQUARE);
                p.strokeWeight(2.5);
                p.line(x, y, x, labelY - (i % 2 === 0 ? -30 : 30));
                p.noStroke();
                p.textSize(20);
                p.text(ev.year, x + (i % 2 === 0 ? 30 : -30), labelY - (i % 2 === 0 ? -70 : 70))
                
            });

            p.pop();
        }
    };
})();