// Extends PageViewController base
var PuzzleViewController = function(config)
{
    // call base class constructor
    PageViewControllerBase.call(this, config);

	// puzzle view specific properties
	this.stage = {};
    this.puzzle = {};
};
inheritsFrom(PuzzleViewController, PageViewControllerBase);


$.extend(PuzzleViewController.prototype, {

	// overridden methods
    setup: function() 
    {	
    	var t = this;

        this.show();

        // init dom ui elements
        $('#ui').css('display', 'block');
        $('#message').css('opacity', 1);
        $("#message").html('loading...');
        $("#bg").css('opacity', 0);
        $("#replay-cta").css('display','none');

        // load the assets
        this.loader = new createjs.LoadQueue(true);
        this.listenerRefs["loader"] = this.loader.addEventListener("complete", function() { t.handleLoadComplete(); });
        this.loader.loadManifest(this.config.manifest);        
    },

    // load complete handler
    // create a new createjs canvas and puzzle
    handleLoadComplete: function() 
    {
        var t = this;

        // remove the load event listener
        this.loader.removeEventListener("complete", this.listenerRefs["loader"]);

        // clear 'loading' text
        $('#ui').css('display', 'none');
        $("#message").html('');

        // register replay button click
        $('#replay-cta').bind("click", function(){
            t.navigateTo('home');
        });

        var canvas = $("#puzzle-board-canvas")[0];
        this.stage = new createjs.Stage(canvas);        
        this.stage.update();
        this.stage.enableMouseOver();
        createjs.Touch.enable(this.stage);

        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", this.stage);
        createjs.Touch.enable(this.stage);  

        // pull out the slider values from the dom for number pieces the puzzle is broken into
        var puzzleConfig = { 
            sizeX: 450, 
            sizeY: 450,
            piecesX: $('#piece-label-x').text(), 
            piecesY: $('#piece-label-y').text()
        };

        // create a new Puzzle 
        // params: createJS stage, createJS Loader instance, number pieces X, number pieces Y
        this.puzzle = new Puzzle(this.stage, this.loader, puzzleConfig);
        this.listenerRefs["gamecomplete"] = this.puzzle.container.addEventListener("GameComplete", function(e){ t.handleGameComplete(e); });
        this.puzzle.init();

        this.transitionIn();
    },

    // PageViewController base class overridden methods
    transitionIn: function()
    {
        this.puzzle.dropPieces();
        this.animateInOhNoText();
    },

    // when we navigate away from this view we need to destroy the puzzle and unregister event handlers to avoid memory leaks
    transitionOut: function()
    {
        console.log('PuzzleViewController: transitionOut');

        // unregister puzzle event listeners
        $("#replay-cta").unbind("click");
        this.puzzle.container.removeEventListener("GameComplete", this.listenerRefs["gamecomplete"]);

        this.puzzle.destroy();
        delete this.puzzle;

        this.dispatchTransitionOutComplete();
    },

    // puzzle game event handlers
    handleGameComplete: function()
    {   
        this.animateInWellDoneText();
    },

    // UI animations
    animateInWellDoneText: function()
    {
        var t = this;
        $('#ui').css('display', 'block');
        $('#message').html('WELL DONE!');
        $('#message').css('opacity', 1);
        $('#replay-cta').css('display', 'block');

        var tl = new TimelineMax({delay:1, onComplete:function() {  }});       
        var welldonetext = new SplitText('#message', {type:"words"});
        
        tl.to($('#bg'), 0.3, {opacity:0.6, ease:Power2.easeInOut});
        tl.from($(welldonetext.words[0]), 0.4, {opacity:0, x:-300, scaleX:10, scaleY:0, ease:Power2.easeInOut}, "-=0.2");
        tl.from($(welldonetext.words[1]), 0.4, {opacity:0, x:+300, scaleX:10, scaleY:0, ease:Power2.easeInOut}, "-=0.4");
        tl.from($('#replay-cta'), 0.4, {opacity:0, y:+50, ease:Power2.easeInOut}, "-=0.1");
    },

    animateInOhNoText: function()
    {
        var t = this;
        $('#ui').css('display', 'block');
        $('#message').html('ON NO!');
        $('#message').css('opacity', 1);

        var tl = new TimelineMax({delay:0.8, onComplete:function() { t.animateOutOhNoText(); }} ); 
        var ohnotext = new SplitText('#message', {type:"words"});
        
        tl.to($('#bg'), 0.3, {opacity:0.6, ease:Power2.easeInOut});
        tl.from($(ohnotext.words[0]), 0.4, {opacity:0, x:-300, scaleX:10, scaleY:0, ease:Power2.easeInOut}, "-=0.2");
        tl.from($(ohnotext.words[1]), 0.4, {opacity:0, x:+300, scaleX:10, scaleY:0, ease:Power2.easeInOut}, "-=0.4");
    },

    animateOutOhNoText: function()
    {
        var t = this;
        $('#message').css('opacity', 1);

        var tl = new TimelineMax({delay:1.6, onComplete:function() { t.handleOhNoTextComplete();  }} );   
        var ohnotext = new SplitText('#message', {type:"words"});

        tl.to($(ohnotext.words[0]), 0.4, {opacity:0, x:-300, scaleX:10, scaleY:0, ease:Power2.easeInOut});
        tl.to($(ohnotext.words[1]), 0.4, {opacity:0, x:+300, scaleX:10, scaleY:0, ease:Power2.easeInOut},"-=0.4");
        tl.to($('#bg'), 0.3, {opacity:0, ease:Power2.easeInOut}, "-=0.2");
    },

    handleOhNoTextComplete: function()
    {
        $('#ui').css('display', 'none');
        this.puzzle.start();
    }
});