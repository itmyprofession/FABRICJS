/*
 * Custom tool based on Fabricjs
 *
 */
var CustomTool = fabric.util.createClass({
    initialize: function(canvasId, width, height) {
        this.canvasId = canvasId || 'c1';
        this.canvas = new fabric.Canvas(this.canvasId);
//        this.canvas.backgroundColor = 'red';

        width = width || 100;
        height = height || 100;
        this.canvas.setDimensions({
            width: width,
            height: height
        });
    },
    defaultText: {
        text: 'Your Text Is Here',
        property: {
            fontFamily: 'Arial',
            fontSize: 29,
            fill: 'black'
        }
    },
    addText: function() {
        console.log('.addText');
        var text, c;
        c = this.canvas;

        text = new fabric.Text(this.defaultText.text, this.defaultText.property);
        text.text = 'CLICK TO EDIT';
        text.left = c.getWidth() / 2;
        text.top = c.getHeight() / 2;
        text.scaleToWidth(c.getWidth());
        text.fill = 'green';

        text.selectable = true;
        c.add(text);
        c.calcOffset();
        c.setActiveObject(text);
        c.renderAll();
    },
    removeText: function() {
        console.log('.removeText');

        var text = this.canvas.getActiveObject();
        this.canvas.remove(text);
        this.canvas.renderAll();
    },
    changeText: function(t) {
        console.log('.changeText');

        var text = this.canvas.getActiveObject();
        text.text = t;
        text.setCoords();
        this.canvas.renderAll();
    },
    changeTextFont: function(font) {
        console.log('.changeTextFont');

        var text = this.canvas.getActiveObject();
        text.fontFamily = font;
        text.setCoords();
        this.canvas.renderAll();
    },
    changeTextColor: function(color) {
        console.log('.changeTextColor');

        var text = this.canvas.getActiveObject();
        text.setColor(color);
        this.canvas.renderAll();
    },
    changeTextSize: function(size) {
        console.log('.changeTextSize');

        var text = this.canvas.getActiveObject();
        text.set('fontSize', size);
        text.setCoords();
        this.canvas.renderAll();
    },
    changeTextFontProperty: function(property) {
        console.log('.changeTextFontProperty : ' + property);

        var text = this.canvas.getActiveObject();

        if (property === "bold") {
            if (text.fontWeight === "800") {
                text.fontWeight = "400";
            } else {
                text.fontWeight = "800";
            }
        }

        if (property === "italic") {
            if (text.fontStyle === "italic") {
                text.fontStyle = "";
            } else {
                text.fontStyle = "italic";
            }
        }

        text.useNative = true;

        if (property === "underline") {
            if (text.textDecoration === 'underline') {
                text.textDecoration = null;
            } else {
                text.textDecoration = 'underline';
                // el.lineHeight = lineheight;
            }
        }

        text.setCoords();
        this.canvas.renderAll();

    },
    changeTextAlign: function(align) {
        console.log('.changeTextAlign');
        var text = this.canvas.getActiveObject();
        text.set('textAlign', align);
        this.canvas.renderAll();
    },
    addImage: function(url) {
        console.log('.addImage');

        fabric.Image.fromURL(url, function(image) {
            this.canvas.add(image);
            this.canvas.renderAll();
        });
    },
    removeImage: function() {
        console.log('.removeImage');

        var image = this.canvas.getActiveObject();
        this.canvas.remove(image);
        this.canvas.renderAll();
    },
    //==============================

    preview: function(width, height, top, left, backgroundImage, callback) {

        var self = this;

        callback = callback instanceof Function ? callback : function() {
        };

        var c = document.createElement('canvas');
        c.setAttribute('id', 'canvas-preview');
        c.setAttribute('width', width);
        c.setAttribute('height', height);

        var p = new fabric.StaticCanvas('canvas-preview');

        p.setWidth(width);
        p.setHeight(height);

        p.setBackgroundImage(backgroundImage, function() {

            p.loadFromJSON(self.canvas.toJSON(), function() {

                var objects = p.getObjects();
                for (i in objects) {
                    objects[i].set('left', objects[i].left + left);
                    objects[i].set('top', objects[i].top + top);
                }

                p.renderAll();

                callback(p.toDataURL());
                p = null;
                c = null;
            });
        });
    },
    changeObjectAlign: function(align) {
        console.log('.changeObjectAlign');
        var object = this.canvas.getActiveObject();

        if (align === 'center') {
            object.set("top", this.canvas.height / 2);
        }

        if (align === 'left') {
            object.set('left', object.getBoundingRectWidth() / 2);
        }

        if (align === 'right') {
            object.set('left', this.canvas.width - object.getBoundingRectWidth() / 2);
        }

        if (align === 'middle') {
            object.set("top", this.canvas.height / 2);
            object.set("left", this.canvas.width / 2);
        }

        object.setCoords();

        this.canvas.renderAll();
    },
    changeObjectFlip: function(flip) {
        console.log('.changeObjectFlip');
        var object = this.canvas.getActiveObject();

        if (flip === 'flipX') {
            object.flipX = !object.flipX;
        }

        if (flip === 'flipY') {
            object.flipY = !object.flipY;
        }

        object.setCoords();

        this.canvas.renderAll();
    },
    clearSelection: function() {
        console.log('.clearSelection');

        this.canvas.deactivateAll();
        this.canvas.renderAll();
    },
    onObjectSelected: function(callback) {
        callback = callback instanceof Function ? callback : function() {
        };
        this.canvas.on('object:selected', function(options) {
            if (options.target instanceof fabric.Text) {
                return callback('text');
            }
        });
    },
    onSelectionCleared: function(callback) {
        callback = callback instanceof Function ? callback : function() {
        };
        this.canvas.on('selection:cleared', function() {
            return callback();
        });
    },
    onObjectModified: function(callback) {
        var cb;
        callback = callback instanceof Function ? callback : function() {
        };
        cb = function(options) {
            var target = options.target;
            if (target instanceof fabric.Text) {
                return callback({
                    type: 'text',
                    color: target.originalState.fill,
                    text: target.originalState.text,
                    font: target.originalState.fontFamily,
                    size: target.originalState.fontSize,
                    weight: target.originalState.fontWeight,
                    style: target.originalState.fontStyle,
                    align: target.originalState.textAlign,
                });
            } else if (target instanceof fabric.Image) {
                return callback({
                    type: 'image',
                });
            }
        }

        this.canvas.on('object:selected', cb);
        this.canvas.on('object:modified', cb);
    },
    saveImage: function() {
        // serialization
        var preview = this.canvas.toDataURL({format: 'jpeg', quality: 1});
        console.log(this);
        console.log('Preview : ' + preview);

        jQuery.ajax({
            url: "server.php",
            data: {"image-extension": "jpeg", "image-data": preview},
            type: "POST",
            beforeSend: function(xhr) {
            }
        }).done(function(data) {
            jQuery('body').append('<img src="' + preview + '">');
        }).fail(function() {
        });
    },
    testImage: function(url) {
        var self = this;
        fabric.Image.fromURL(url, function(img) {
            console.log(img);
            //img.filters.push(new fabric.Image.filters.Sepia());
            //img.applyFilters(this.canvas.renderAll.bind(this.canvas));
            img.set({
                left: 200,
                top: 300,
            });
            this.canvas.add(img);
            this.canvas.renderAll();
        });
    }
});