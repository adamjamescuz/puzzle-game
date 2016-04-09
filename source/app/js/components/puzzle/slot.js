var Slot = function(id)
{
    this.id = id;
    this.container = new createjs.Container();
    this.bounds = {};
    this.border;
    this.isEmpty = true;
};  


$.extend(Slot.prototype, {

	init:function(size, pos)
    {
        this.border = new createjs.Shape();
        this.border.graphics.setStrokeStyle(2).beginStroke("#dddddd").drawRect(0, 0, size.x, size.y);
        this.container.addChild(this.border);
        this.unhighlight();

        this.container.x = pos.x;
        this.container.y = pos.y;

        // manually have to set the container bounds since CreateJS Shape has no automatic bounds calculation
        // see: http://blog.createjs.com/update-width-height-in-easeljs/
        this.container.setBounds(this.container.x, this.container.y, size.x, size.y);
        this.bounds = this.container.getBounds();
    },

    // implementation
    highlight: function()
    {
        this.border.alpha = 0.9;
    },

    unhighlight: function()
    {
        this.border.alpha = 0.1;
    }   
});