/*
 * 
 *  Here we have all codes related to HTML layout
 *  
 */


(function($) {
    function in_array(element, array) {
        if (!(array instanceof Array)) {
            return false;
        }

        for (i = 0; i < array.length; i++) {
            if (element === array[i]) {
                return true;
            }
        }
        return false;
    }

    function press_button(parent, key, val) {
        $(parent + ' a').each(function() {
            if (!$(this).data(key)) {
                return;
            }
            if ($(this).data(key) === val) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    }

    function press_color_button(parent, key, val) {
        $(parent + ' a').each(function() {
            if (!$(this).data(key)) {
                return;
            }
            if ($(this).data(key).toLowerCase() === val.toLowerCase()) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    }


    var Init = {
        parts: {
            front: {
                tool: null,
                left: 0,
                top: 0,
                width: 480,
                height: 480
            },
            back: {
                tool: null,
                left: 0,
                top: 0,
                width: 480,
                height: 480
            },
            left: {
                tool: null,
                left: 0,
                top: 0,
                width: 480,
                height: 480
            },
            right: {
                tool: null,
                left: 0,
                top: 0,
                width: 480,
                height: 480
            }
        },
        positions: ['front', 'back', 'left', 'right'],
        colors: ['blue', 'red', 'black', 'white'],
        sizes: ['s', 'm', 'l', 'xl', 'xxl', 'xxxl'],
        position: 'front',
        color: 'white',
        size: 's',
        init: function(canvasSpaceId) {
            var i, p, id, self, wrapper, canvas, canvasSpace = $('#' + canvasSpaceId);

            self = this;
            console.log(this.positions);
            // Initiate canvas
            for (i = 0; i < this.positions.length; i++) {
                id = 'canvas-' + this.positions[i];
                p = this.parts[this.positions[i]];

                // Create wrapper and canvas
                wrapper = $('<div></div>').addClass('canvas-wrapper');
                canvas = $('<canvas></canvas>').attr('id', id);
                canvas.appendTo(wrapper);
                wrapper.appendTo(canvasSpace);

                // Create object of custom tool
                p.tool = new CustomTool(id, p.width, p.height);
                $('#' + id).parent().css({
                    position: 'absolute',
                    left: p.left,
                    top: p.top,
                    border: '1px solid #777'
                });
            }
            this.changeColor(this.color);
            this.changePosition(this.position);

            this.panelButtonsInit();
            this.editToolbarInit();
            this.colorButtonsInit();
            this.objectEventInit();
        },
        changeColor: function(color) {
            var url, p;

            if (in_array(color, this.colors)) {
                for (i = 0; i < this.positions.length; i++) {
                    url = 'images/' + color + '-' + this.positions[i] + '.png';

                    $('#canvas-' + this.positions[i]).parent().parent().data('image', url);
                    alert($('#canvas-' + this.positions[i]).parent().parent().data('image'));
                    $('#canvas-' + this.positions[i]).parent().parent().css('background-image', 'url(' + url + ')');
                    $('.position-button-group a[data-position="' + this.positions[i] + '"] img').attr('src', url);
                }
                this.color = color;
            }
        },
        changePosition: function(position) {
            $('#canvas-' + this.position).parent().parent().hide();
            this.parts[this.position].tool.clearSelection();
            this._hideEditToolbar();

            $('#canvas-' + position).parent().parent().show();
            this.position = position;
        },
        changeSize: function(size) {
            this.size = size;
        },
        _addButtonEvent: function(className, key, callback) {
            var self = this;
            $('.' + className + ' a').click(function() {
                var val = $(this).data(key);
                press_button('.' + className, key, val);
                if (callback) {
                    callback.call(self, val);
                }
            });
        },
        _showEditToolbar: function(callback) {
            callback = callback instanceof Function ? callback : function() {
            };

            $('#edit-toolbar').fadeIn(200, callback);
        },
        _hideEditToolbar: function(callback) {
            callback = callback instanceof Function ? callback : function() {
            };

            if ($('.popover:visible').length === 0) {
                $('#edit-toolbar').fadeOut(200, callback);
            } else {
                this._hideEditTool(function() {
                    $('#edit-toolbar').fadeOut(200, callback);
                });
            }
        },
        _hideEditTool: function(callback) {
            callback = callback instanceof Function ? callback : function() {
            };

            $('.popover:visible').fadeOut(200, function() {
                $('#edit-toolbar a[data-tool="' + $(this).attr('id') + '"]').removeClass('active');
                return callback();
            });
        },
        _showEditTool: function(tool, callback) {
            var self = this;
            callback = callback instanceof Function ? callback : function() {
            };

            this._showEditToolbar(function() {
                if ($('.popover#' + tool).is(':visible')) {
                    return callback();
                }
                if ($('.popover:visible').length === 0) {
                    $('#edit-toolbar a[data-tool="' + tool + '"]').addClass('active');
                    $('.popover#' + tool).fadeIn(200, callback);
                } else {
                    self._hideEditTool(function() {
                        $('#edit-toolbar a[data-tool="' + tool + '"]').addClass('active');
                        $('.popover#' + tool).fadeIn(200, callback);
                    });
                }
            });
        },
        panelButtonsInit: function() {
            var self = this;

            // Initiate events of buttons
            this._addButtonEvent('position-button-group', 'position', this.changePosition);
            this._addButtonEvent('color-button-group', 'color', this.changeColor);
            this._addButtonEvent('size-button-group', 'size', this.changeSize);

            // Initiate active buttons
            press_button('.position-button-group', 'position', this.position);
            press_button('.color-button-group', 'color', this.color);
            press_button('.size-button-group', 'size', this.size);

            // Initiate toolbar buttons
            $('#edit-toolbar a[data-tool]').click(function() {
                self._showEditTool($(this).data('tool'));
            });
            $('.popover button[data-dismiss]').click(function() {
                var obj, target, self;
                obj = $(this).parent();
                target = $(this).data('dismiss');
                self = this;

                while (obj && !obj.hasClass(target)) {
                    obj = obj.parent();
                }

                if (obj) {
                    obj.fadeOut(200);
                    $('#edit-toolbar a[data-tool="' + obj.attr('id') + '"]').removeClass('active');
                }
            });
            $('.popover button[data-remove="yes"]').click(function() {
                self.parts[self.position].tool.removeText();
                self._hideEditToolbar();
            });
        },
        editToolbarInit: function() {
            var i, t, self;
            self = this;

            for (i = 0; i < this.positions.length; i++) {
                t = this.parts[this.positions[i]].tool;
                t.onObjectSelected(function(type) {
                    if (type === 'text') {
                        self._showEditTool('text-settings');
                    } else if (type === 'image') {
                        self._showEditTool('color-settints');
                    }
                });
                t.onSelectionCleared(function() {
                    self._hideEditToolbar();
                });
            }
        },
        colorButtonsInit: function() {
            $('.edit-toolbar-color-button-group a[data-color]').each(function() {
                var i, color, name;
                color = $(this).data('color');
                name = color.charAt(0);

                $(this).css('color', color);
                for (i = 1; i < color.length; i++) {
                    if (color.charAt(i) === color.charAt(i).toUpperCase()) {
                        name += ' ' + color.charAt(i);
                    } else {
                        name += color.charAt(i);
                    }
                }
                $(this).attr('title', name);
            });
        },
        objectEventInit: function() {
            var i, t, self;

            for (i = 0; i < this.positions.length; i++) {
                t = this.parts[this.positions[i]].tool;
                t.onObjectModified(function(options) {
                    if (options.type === 'text') {
                        $('#text-settings-text').val(options.text);
                        $('#text-settings-font').val(options.font);
                        $('#text-settings-size').val(options.size);
                        $('#text-settings a[data-' + options.weight + ']').addClass('active');
                        $('#text-settings a[data-' + options.style + ']').addClass('active');
                        press_button('.edit-toolbar-text-button-group', 'align', options.align);

                        press_color_button('.edit-toolbar-color-button-group', 'color', options.color);
                        $('#color-settings .popover-title .color-name').text(options.color);
                        $('#edit-toolbar a[data-tool="color-settings"]').css('color', options.color).attr('title', 'Current color: ' + options.color);
                    }
                });
            }
        },
        toolsInit: function(id) {
            var self = this;

            $(id + ' a').click(function() {

                var action = $(this).data('action');
                console.log(action);

                switch (action) {
                    case 'add-text':
                        self.parts[self.position].tool.addText();
                        break;
                    case "preview":
                        var url = $("#canvas-" + self.position).parent().parent().data('image');

                        self.parts[self.position].tool.preview(500, 500, self.parts[self.position].top, self.parts[self.position].left, url, function(data) {

                            $("#modal-preview-image-wrapper").html("<img src='" + data + "' />");
                            $("#modal-preview").modal();
                            console.log(data);
                        });
                        break;
                    default:
                        break;
                }
            });

            $("#modal-preview .modal-footer button").on("click", function(e) {

                var action = $(this).data('action');
                var i = $(this).parent().data('index');

                i = parseInt(i);
                console.log(action);

                var url;
                var left;
                var top;

                if (action == 'next') {
                    i = ++i % self.positions.length;
                }

                if (action === 'prev') {
                    if (i <= 0) {
                        return;
                    }
                    --i;
                }

                url = $("#canvas-" + self.positions[i]).parent().parent().data('image');
                top = self.parts[self.positions[i]].top;
                left = self.parts[self.positions[i]].left;

                self.parts[self.positions[i]].tool.preview(500, 500, top, left, url, function(data) {

                    $("#modal-preview-image-wrapper").html("<img src='" + data + "' />");
                    $("#modal-preview").modal();
                });

                $(this).parent().data("index", i + "");

            });

        },
        textEditorInit: function(id) {
            var self = this;

            $(".edit-toolbar-color-button-group a[data-color]").click(function() {

                var color = $(this).css('color');
                self.parts[self.position].tool.changeTextColor(color);
            });

            $("#text-settings-size").on("change", function() {
                var size = $(this).val();
                self.parts[self.position].tool.changeTextSize(size);
            });

            $("#text-settings-font").on("change", function() {
                var type = $(this).val();
                self.parts[self.position].tool.changeTextFont(type);
            });

            $("#text-settings-property a").on("click", function() {
                var prop = $(this).data('prop');

                if (in_array(prop, ['left', 'center', 'right'])) {
                    self.parts[self.position].tool.changeTextAlign(prop);
                    //self.parts[self.position].tool.changeObjectAlign(prop);
                } else {
                    self.parts[self.position].tool.changeTextFontProperty(prop);
                }
            });

            $("#text-settings-text").on("keyup", function(e) {
                if (e.which == 13) {
                    //e.preventDefault();
                }
                self.parts[self.position].tool.changeText($(this).val());
            });

            $("#edit-toolbar a").on("click", function(e) {
                var prop = $(this).data('prop');

                if (in_array(prop, ['left', 'center', 'right', 'middle'])) {
                    self.parts[self.position].tool.changeObjectAlign(prop);
                } else {
                    self.parts[self.position].tool.changeObjectFlip(prop);
                }
            });
        },
        miscInit: function() {
            var self = this;

            //console.log(self.position);
            //console.log(self.parts[self.position]);
            // Save image
            $('#custom-save').on('click', function(e) {
                e.preventDefault();
                self.parts[self.position].tool.saveImage();
            });
        }
    };

    console.log('init');
    $.customToolInit = Init;

})(window.jQuery);