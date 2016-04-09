
var HomeViewController = function(config)
{
    // call base class constructor
    PageViewControllerBase.call(this, config);

	// home view specific properties
    this.piecesX = 3;
    this.piecesY = 3;
};
inheritsFrom(HomeViewController, PageViewControllerBase);


$.extend(HomeViewController.prototype, {

	// overridden methods
    setup: function() 
    {	
    	var t = this;

        // dom event handlers
        $('#pieces-slider-x').change(function(e){
            $('#piece-label-x').text($(this).val());
        });

        $('#pieces-slider-y').change(function(e){
            $('#piece-label-y').text($(this).val());
        });

        $('#begin-cta').click(function(){
            t.navigateTo('puzzle');
        });

        // page is ready
        this.dispatchIsReady();
    }
});