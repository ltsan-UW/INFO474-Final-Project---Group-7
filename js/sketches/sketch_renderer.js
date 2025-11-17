// sketch_renderer.js

// Responsible for rendering the main visualization based on the current active index
(function () {
    window.Renderer = {

        setData: function (manager) {
            var self = this;

            manager.offsetX = (manager.margin && manager.margin.left) || 20;
            manager.offsetY = (manager.margin && manager.margin.top) || 0;

            function computeLayout(data) {
                manager.data = data;
            }

            let url = 'data/basketball-data.json'
            fetch(url)
                .then(res => {return res.json();})
                .then(data => {
                    console.log(data);
                    computeLayout(data);
                })
                .catch(err => {console.error('Failed to fetch JSON:', err);});


            // // This is for loading the original csv file, then changing making it into a json obj.
            // // It logs out the json file, just copy and paste into basketball-data.json.
            // let url = 'data/basketball-data.csv'
            // DataLoader.loadCSV(url).then((data) => {
            //     const jsonStr = JSON.stringify(data);
            //     console.log(jsonStr);
            //     computeLayout(data);
            // });
            return Promise.resolve(manager.data);
        },

        draw: function (p, manager, ai, progress) {

            try { /*console.log('Renderer: delegating draw, ai=', ai);*/ } catch (e) { }

            if (ai === 0 || ai === 1) {
                window.VizTitle.draw(p, manager, ai, progress);
                return;
            }

            if (ai >= 4 && ai < 7) {
                window.VizScatter.draw(p, manager, ai, progress);
                return;
            }

            if (ai === 7) {
                window.VizBar.draw(p, manager, ai, progress);
                return;
            }
        }
    };
})();
