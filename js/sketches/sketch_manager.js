// sketch_manager.js

function startP5() {

    var localRenderer;
    // localRenderer = window.TemplateRenderer;
    localRenderer = window.Renderer;

    // --- Sketch manager ----------------------------------------------------
    function SketchManager() {
        // core layout settings (canvas size only)
        this.width = 600; // content width
        this.height = 520; // content height
        this.margin = { top: 0, left: 80, bottom: 40, right: 10 };
        this.canvasWidth = this.width + this.margin.left + this.margin.right;
        this.canvasHeight = this.height + this.margin.top + this.margin.bottom;

        // drawing state
        this.state = { activeIndex: 0, progress: 0 };

        // data will be attached by localRenderer.setData(manager, data)
        this.data = [];

        // circle objects for all players
        this.circlesAP = {};
        // circle objects for players split between international and domestic
        this.circlesPS = {};

        // currentSeason that is used for all vizes
        this.currentSeason = "2023-24"

        // loaded player flag images to prevent reloading every viz
        this.flagImages = null;

        // create the p5 instance bound to this manager
        var self = this;
        var sketch = function (p) {
            p.setup = function () {
                var parent = document.getElementById('vis');
                parent.innerHTML = '';
                p.createCanvas(self.canvasWidth, self.canvasHeight).parent('vis');
                p.noStroke();
                p.frameRate(30);
            };

            p.draw = function () {
                p.background(255);
                self.draw(p);
            };
        };

        this.p5 = new p5(sketch);
    }

    // set circlesAP state (called by begininng all players viz)
    SketchManager.prototype.setCirclesAP = function (circles) {
        if (circles !== undefined) this.circlesAP = circles;
    };
    // set circlesPS state (called by begininng all players viz)
    SketchManager.prototype.setCirclesPS = function (circles) {
        if (circles !== undefined) this.circlesPS = circles;
    };

    // set flags (called by begininng all players viz)
    SketchManager.prototype.setFlagImages = function (flags) {
        if (flags !== undefined) this.flagImages = flags;
    };


    // set visualization state (called by scroll logic)
    SketchManager.prototype.setState = function (s) {
        if (s.activeIndex !== undefined) this.state.activeIndex = s.activeIndex;
        if (s.progress !== undefined) this.state.progress = s.progress;
    };

    // delegate data handling to localRenderer
    SketchManager.prototype.setData = function (newData) {
        return localRenderer.setData(this, newData);
    };

    // simple drawing routine, split into helpers for clarity
    SketchManager.prototype.draw = function (p) {
        var ai = this.state.activeIndex || 0;
        var progress = this.state.progress || 0;
        localRenderer.draw(p, this, ai, progress);
    };

    // create (or replace) singleton manager and expose API
    if (window.__sketchAPI && window.__sketchAPI.p5) {
        try { window.__sketchAPI.p5.remove(); } catch (e) { }
        window.__sketchAPI = null;
    }
    var manager = new SketchManager();
    // initialize data via localRenderer (fail fast if missing)
    if (!localRenderer || typeof localRenderer.setData !== 'function') {
        throw new Error('localRenderer.setData is required at startup.');
    }

    var setDataResult = localRenderer.setData(manager);

    var api = {
        setState: manager.setState.bind(manager),
        setData: manager.setData.bind(manager),
        p5: manager.p5,
        data: manager.data
    };

    // Expose a `ready` promise so callers can wait until data/layout are ready.
    if (setDataResult && typeof setDataResult.then === 'function') {
        api.ready = setDataResult.then(function () { return api; });
    } else {
        api.ready = Promise.resolve(api);
    }

    // Expose the API globally once ready so consumers (like sections) see
    // the populated data without racing the async load.
    api.ready.then(function () {
        try { window.__sketchAPI = api; } catch (e) { }
    }).catch(function () {
        try { window.__sketchAPI = api; } catch (e) { }
    });

    return api;
}
