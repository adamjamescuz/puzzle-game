// Puzzle class - contains logic for creating an managing a single puzzle
// params - stage: instance of a createJS stage (instantated elsewhere in the containing view controller)
// params - loader: instance of a createJS loader containing assets
// config - obj containing number of pieces to make puzzle customisable { piecesX, piecesY }
var Puzzle = function(stage, loader, config)
{
    this.config = config;
	this.stage = stage;
	this.loader = loader;
	this.container = new createjs.Container();
	this.stage.addChild(this.container);
	this.pieces = [];
    this.slots = [];
	this.size = {x:this.config.sizeX, y:this.config.sizeY};
	this.piecesX = this.config.piecesX;
	this.piecesY = this.config.piecesY;
	this.pieceSize = {x:this.size.x / this.piecesX, y:this.size.y / this.piecesY};
    this.selectedPiece = null;
    this.targetSlot = null;
    this.correctPieces = [];

    // listener references for removing event listeners
    this.tickListener = {};

    // keep track of game state
    this.state = Puzzle.States.Idle;
};  

// states enum
Puzzle.States = {
    Idle: 0,
    MovingPiece: 1
}

$.extend(Puzzle.prototype, {

    // initialse a puzzle
    // params - puzzleImageID: string id of the image in the createJS loader instance passed in the constructor
	init:function(puzzleImageID)
    {
        var t = this;
        var img = new createjs.Bitmap(this.loader.getResult(puzzleImageID));

        // keep things simple - id is just an num piece count
        var pieceNumber = 0;

        for (var i = 0; i < this.piecesY; i++)
        {
        	for (var j = 0; j < this.piecesX; j++)
        	{
                var pos = {};
                pos.x = j * this.pieceSize.x;
                pos.y = i * this.pieceSize.y;
                var id = pieceNumber;

                // create a slot
                var slot = new Slot(id);
                this.container.addChild(slot.container);
                slot.init(this.pieceSize, pos);
                this.slots.push(slot);

                // create a piece that belongs to the slot - their ids match
        		var piece = new Piece(id);
        		this.container.addChild(piece.container);        		

        		var imgPiece = new createjs.Bitmap(this.loader.getResult("PuzzleImage"));
        		imgPiece.sourceRect = new createjs.Rectangle(pos.x, pos.y, this.pieceSize.x, this.pieceSize.y);

                // register piece events
                piece.container.addEventListener("PieceSelected", function(e){ t.handlePieceSelected(e); });
                piece.container.addEventListener("PieceDeselected", function(e){ t.handlePieceDeselected(e); });
                piece.container.addEventListener("PieceIsCorrect", function(e){ t.handlePieceIsCorrect(e); });
                piece.container.addEventListener("PieceIsWrong", function(e){ t.handlePieceIsWrong(e); });

        		piece.init(imgPiece,pos);
        		piece.addListeners();

                 // bring the piece to the front of the display list
                this.bringDisplayObjectToFront(piece.container);
                this.pieces.push(piece);
                pieceNumber++;
        	}
        }
    },

    // Puzzle implementation

    // drop all the pieces the floor
    dropPieces: function()
    {
        _.forEach(this.pieces, function(piece)
        {
            piece.drop(this.config.sizeY);
        }, this);
    },

    // start a game
    start: function()
    {
        var t = this;

        // create main game loop
        this.tickListener = createjs.Ticker.addEventListener("tick", function(){  t.update(); });
    },    

    // main game loop
    update: function()
    {
        switch (this.state)
        {
        case Puzzle.States.Idle:
            // when idle monitor the number of correct pieces
            if (this.correctPieces.length === this.pieces.length)
            {
                this.gameComplete();
            }
            break;
        case Puzzle.States.MovingPiece:
            // handle moving around and colliding with the slots
            if (this.selectedPiece !== null)
            {
                this.targetSlot = null;

                for (var i = 0; i < this.slots.length; i++)
                {
                    var slot = this.slots[i];

                    if (slot.bounds.contains(this.selectedPiece.container.x, this.selectedPiece.container.y))
                    {
                        this.targetSlot = slot;
                        slot.highlight();
                    }
                    else
                    {
                        slot.unhighlight();                   
                    }
                }
            }   
            else
            {
                console.error('no piece selected');
            }
            break;
        }
    },

    // event handlers

    // when a piece is selected change state to MovingPiece
    handlePieceSelected:function(e)
    {
        this.selectedPiece = _.findWhere(this.pieces, {id: e.id});     
        this.bringDisplayObjectToFront(this.selectedPiece.container);
        this.state = Puzzle.States.MovingPiece;   
    },

    // this should only fire when we have piece selected
    // if we have a target slot, snap the piece into the slot
    // otherwise drop it back to the floor
    handlePieceDeselected:function(e)
    {
        if (this.selectedPiece === null)
        {
            console.error('no piece selected!');
            return;
        }

        if (this.targetSlot !== null)
        {
            this.selectedPiece.snapToSlot(this.targetSlot);
            this.targetSlot.hasPiece = true;
        }
        else
        {
            this.selectedPiece.drop(this.config.sizeY);
        } 

        this.selectedPiece = null;
        this.state = Puzzle.States.Idle;  
    },

    // piece that has been placed is correct O_o
    handlePieceIsCorrect:function(e)
    {
        if (_.contains(this.correctPieces, e.id) === false)
        {
            this.correctPieces.push(e.id);
        }        
    },

    // piece that has been placed is wrong X_x
    handlePieceIsWrong:function(e)
    {        
        if (this.correctPieces.length > 0)
        {
            this.correctPieces = _.without(this.correctPieces, e.id);  
        }        
    },

    gameComplete: function()
    {
        console.log("win");
        createjs.Ticker.removeEventListener("tick", this.tickListener);

        var event = new createjs.Event('GameComplete');
        this.container.dispatchEvent(event);
    },

    destroy: function()
    {
        createjs.Ticker.removeEventListener("tick", this.tickListener);
        this.stage.removeChild(this.container);
    },

    // helper functions
    // TODO: if I create more of these, put into a singleton helper class
    bringDisplayObjectToFront:function(displayObject)
    {
        this.container.setChildIndex(displayObject, this.container.getNumChildren()-1);
    }
});