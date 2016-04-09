// Base class for the view controllers 
// Indivudal view controllers extend this and override 
// certain methods for their own functionality
var PageViewControllerBase = function(config)
{
    this.config = config;
    this.elem = $(config.elem);
    this.loader = {};
    this.callbacks = [];
    this.transitionOutCallbacks = [];

    // listener refs dict for removing event listener functions - (key: string describing the listener, value: handler function signiture)
    this.listenerRefs = {};

    // note: leave this set to false to setup the view as fresh every time 
    this.isReady = false;
};


$.extend(PageViewControllerBase.prototype, {

    init: function()
    {
        if (this.isReady)
        {
            this.transitionIn();
        }
        else
        {
            this.setup();
        }
    },

    setup: function() 
    {           
        // override this in individual page controllers for any besoke setup e.g. loading in manifest etc
        console.log(this.config.name + ' : setup');
    },
    
    show: function()
    {
        this.elem.css('display', 'block');
    },

    hide: function()
    {
        this.elem.css('display', 'none');
    },

    // navigate away from view to a new view
    navigateTo: function(page, args)
    {
        var event = new CustomEvent('NavigateTo', {'detail': {page:page}});
        this.elem[0].dispatchEvent(event);
    },

    transitionOut: function()
    {
        console.log(this.config.name + ' : transition out');
        // default behaviour - just call the transition out handler(s) override this in individual page controllers for fancy transition out
        this.dispatchTransitionOutComplete();
    },

    dispatchTransitionOutComplete: function()
    {
        var event = new CustomEvent('TransitionOutComplete', {'detail': {config:this.config}});
        this.elem[0].dispatchEvent(event);
    },

    transitionIn: function()
    {
        console.log(this.config.name + ' : transition in');
        // default behaviour - just show the page (override this in individual page controllers for fancy transition in)
        this.show();
    },

    dispatchIsReady: function()
    {
        this.isReady = true;

        var event = new CustomEvent('Ready', {'detail': {config:this.config}});
        this.elem[0].dispatchEvent(event);
    }
});