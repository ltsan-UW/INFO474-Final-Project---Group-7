// viz_bar.js
// Simple horizontal bar plot visual (12 months) using cached random values.
(function () {
    window.VizTimeline = {
        draw: function (p, manager, ai, progress) {

            var cx = (manager.offsetX || 0) + (manager.width || 600) / 2;
            var cy = (manager.offsetY || 0) + (manager.height || 520) / 3;

            p.push();
            p.fill("black");
            p.textSize(20);
            p.text("TIMELINE GOES HERE", cx, cy);

            
        }
    };
})();