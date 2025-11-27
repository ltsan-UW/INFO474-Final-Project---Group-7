// viz_title.js
// Draw title-style screens for early active indexes (0 and 1)
(function () {
    window.VizTitle = {
        draw: function (p, manager, ai, progress) {
            var cx = (manager.offsetX || 0) + (manager.width || 600) / 2;
            var cy = (manager.offsetY || 0) + (manager.height || 520) / 3;
            p.push();
            p.noStroke();
            p.textFont("Tahoma, Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif");
            p.fill(255);
            var w = 420;
            var h = 120;
            p.rect(cx - w / 2, cy - h / 2, w, h, 6);

            p.fill(0);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(38);
            p.textStyle(p.BOLD);
            p.text('The NBA\'s International Players', cx, cy);
            p.textSize(30);
            p.textStyle(p.NORMAL);
            p.text('INFO 474 Final Project', cx, cy + 60);
            p.textSize(20);
            p.textStyle(p.ITALIC);
            p.text('Diego Licea, Minkyu Kim, Lance Santos', cx, cy + 110);
            p.pop();
        }
    };
})();
