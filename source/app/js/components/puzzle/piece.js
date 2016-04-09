var Piece = function(id)
{
    this.id = id;
    this.container = new createjs.Container();
    this.bounds = {};
    this.isPlaced = true;
    this.isSelected = false;
    this.enable = false;
    this.snapSpeed = 150;
    this.dropSpeed = 400;
};  


$.extend(Piece.prototype, {


    // initialisation
	init:function(img, pos)
    {
        this.container.addChild(img);
        this.container.cursor = "pointer";

        // cache bounds once here as is an expensive operation to compute 
        this.bounds = this.container.getBounds();

        this.container.regX = this.bounds.width * .5;
        this.container.regY = this.bounds.height * .5;

        this.container.x = pos.x + this.bounds.width * .5;
        this.container.y = pos.y + this.bounds.width * .5;
    },

    // register mouse event listeners
    addListeners:function()
    {
        var t = this;
        this.container.on("mousedown", function(e){ t.handleMouseDown(e); });
        this.container.on("pressmove", function(e){ t.handlePressMove(e); });
        this.container.on("pressup", function(e){ t.handlePressUp(e); });
    },

    // mouse event handlers
    handleMouseDown:function(e)
    {
        this.isSelected = true;
        this.container.rotation = 0;
        this.container.alpha = 1;
        this.container.scaleX = this.container.scaleY = 1;

        var event = new createjs.Event('PieceSelected').set({id:this.id});
        this.container.dispatchEvent(event);
    },

    handlePressMove:function(e)
    {
        this.container.x = e.stageX;
        this.container.y = e.stageY;
    },

    handlePressUp:function(e)
    {
        this.isSelected = false;

        var event = new createjs.Event('PieceDeselected').set({id:this.id});
        this.container.dispatchEvent(event);
    },

    // implementation

    // animate the piece falling to the floor
    drop: function(yPos)
    {
        this.isPlaced = false;
        var targetY = _.random(yPos + (this.bounds.height * .5), yPos + (this.bounds.height*1.25));
        var targetRotation = this.container.rotation + _.random(-20, 20);
        var targetX = this.container.x + _.random(-20, 20);
        var targetAlpha = 0.5;
        var targetScale = 0.8;

        createjs.Tween.get(this.container).to( {x:targetX, y:targetY, rotation:targetRotation, alpha:targetAlpha, scaleX:targetScale, scaleY:targetScale}, this.dropSpeed, createjs.Ease.getPowIn(2)).call(function(){  } );

        // since techinically the piece is wrong (i.e. on the floor) need to dispatch the wrong event
        var event = new createjs.Event('PieceIsWrong').set({id:this.id});
        this.container.dispatchEvent(event);
    },

    // if we have a target slot, animate towards this
    snapToSlot: function(targetSlot)
    {
        var t = this;
        var targetX = targetSlot.container.x + this.bounds.width * .5;
        var targetY = targetSlot.container.y + this.bounds.height * .5;

        createjs.Tween.get(this.container).to( {x:targetX, y:targetY}, this.snapSpeed, createjs.Ease.getPowOut(2)).call(function(){ t.checkPieceIsCorrect(targetSlot); } );
        this.isPlaced = true;
        targetSlot.unhighlight();
    },

    // called after the above snap tween ends - check it's in the right slot by compaing id with target slot id
    checkPieceIsCorrect: function(targetSlot)
    {
        if (this.id === targetSlot.id)
        {
            var event = new createjs.Event('PieceIsCorrect').set({id:this.id});
            this.container.dispatchEvent(event);
        }
        else
        {
            var event = new createjs.Event('PieceIsWrong').set({id:this.id});
            this.container.dispatchEvent(event);
        }
    }
   
});