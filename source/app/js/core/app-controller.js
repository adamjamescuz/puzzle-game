// lightweight single page application controller
// site structure is defined in the site model JSON that is passed in
// PageViewController base class defined common page functinality
// individual view controllers override PageViewControler base class with bespoke functionality

var ApplicationController = function(siteModel)
{
    this.siteModel = siteModel;
    this.currentController = null;
    this.controllers = {};
    this.pagesReadyToRun = [];
};

// $.extend() allows us to use jquery inside our class and registers view event handlers
$.extend(ApplicationController.prototype, {

    // creates view controllers based on site model
    init: function() 
    {   
        var t = this;

        _.forEach(this.siteModel.pages, function(pageConfig) {

            var viewController = {};

            // TODO: ApplicationController should now know about other view controllers
            // need to replace this with 'window[classname]' to instantiate 
            switch (pageConfig.name)
            {
            case "home":
                viewController = new HomeViewController(pageConfig);
                break;
            case "puzzle":
                viewController = new PuzzleViewController(pageConfig);
                break;
            default:
                console.error('unknown view in config');
            }

            t.controllers[pageConfig.name] = viewController;
            viewController.elem[0].addEventListener('TransitionOutComplete', function (e) { t.handleTransitionOut(e.detail.config); }, false);
            viewController.elem[0].addEventListener('NavigateTo', function (e) { t.handleNavigateTo(e.detail.page); }, false);
        }, this);

        // if we require certain pages to be setup, set them up otherwise start the app
        if (this.siteModel.pagesRequiredToRun.length > 0)
        {
            _.forEach(this.siteModel.pagesRequiredToRun, function(page)
            {
                var controller = this.controllers[page];
                controller.elem[0].addEventListener('Ready', function (e) { t.handlePageIsReady(e.detail.config); }, false);
                controller.setup();
            }, this);
        }
        else
        {
            this.start();
        }
    },   

    // page event handlers
    handlePageIsReady: function(config)
    {
        console.log('ApplicationController: pageReady');
        this.pagesReadyToRun.push(config.name);

        var diff = _(this.siteModel.pagesRequiredToRun).difference(this.pagesReadyToRun);

        // once all the required ready pages are ready we can run the app
        if (diff.length === 0)
        {
            this.start();
        }       
    },

    handleNavigateTo: function(page)
    {
        this.navigateTo(page);
    },

    handleHashHasChanged: function()
    {
        console.log('ApplicationController: hash change handler');

        // transition out of current view
        if (this.currentController === null)
        {
            this.runView(decodeURI(window.location.hash)); 
        }
        else
        {
            this.currentController.transitionOut();
        }
    },

    handleTransitionOut: function()
    {
        this.currentController = null;
        this.runView(decodeURI(window.location.hash));   
    },

    // application controller implementation
    start: function()
    {
        console.log("ApplicationController: start");
        var t = this;

        // listen for url changes in the #
        $(window).on('hashchange', function()
        {
            t.handleHashHasChanged();
        });

        // if we have url in the hash refresh or default to start page if /
        if (window.location.hash === "")
        {
            this.navigateTo(this.siteModel.startPage);      
        }
        else
        {
            this.runView(decodeURI(window.location.hash));
        }
    },

    navigateTo: function(name)
    {
        console.log("ApplicationController: navigate to: " + name);
        var page = _.findWhere(this.siteModel.pages, { name:name });
        $(location).attr('href', '#' + page.name);
    },

    runView: function(url)
    {
        console.log('ApplicationController: run view url: ' + url);

        this.hideAllViews();
        var page = url.replace("#","");
        this.currentController = this.controllers[page];
        this.currentController.init();
    },

    hideAllViews: function()
    {
        $('.page').css('display', 'none');
    }
});

