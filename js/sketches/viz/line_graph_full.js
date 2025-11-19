// viz_title.js
// Draw title-style screens for early active indexes (0 and 1)
(function () {
    window.VizLineGraphFull = {
        draw: function (p, manager, ai, progress) {
            var cx = (manager.offsetX || 0) + (manager.width || 600) / 2;
            var cy = (manager.offsetY || 0) + (manager.height || 520) / 3;

            p.fill("black");

            p.textSize(20);
            p.text("Testing", cx, cy);

            console.log(manager.data);

        }
    };
})();