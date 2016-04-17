var Guidance = {
    guides: {},
    activeGuide: undefined,
    pointer: undefined,
    guideIsRunning: false,
    timer: undefined,
    guideDefaultTemplate: {
        name: '',
        enabled: true,
        stepIndex: 0,
        intro: "Welcome! Click the bubble to start whenever you are ready.",
        outro: "Thanks!",
        completed: false,
        pointerDefaultState: {
            left: $(window).width() / 2 - 35 + 'px',
            top: $(window).height() / 2 - 35 + 'px',
            width: '0',
            height: '0',
            'border-width': '35px',
            'border-radius': '50%'
        },
        steps: []
    },
    init: function() {
        this.startGuide('step2Guide');
    },
    
    addGuide: function(guideObj) {
        var newGuide = $.extend({}, this.guideDefaultTemplate, guideObj);
        if (this.guides[newGuide.name]) {
            throw new Error("A guide module with the same name already exists.")
        } else {
            this.guides[newGuide.name] = newGuide;
        }
    },
    enableGuide: function(guideName) {
        var guide = this.guides[guideName];
        if (guide) {
            guide.enabled = true;
            // TODO
        }
    },
    disableGuide: function(guideName) {
        var guide = this.guides[guideName];
        if (guide) {
            guide.enabled = false;
            // TODO
        }
    },
    enableAll: function() {
        /*
        */
    },
    disableAll: function() {
        /*
        */
    },
    exportUserData: function() {
        var ret = {};
        $.each(this.guides, function(name, guide) {
            ret[name] = {
                enabled: guide.enabled,
                stepIndex: guide.stepIndex,
                completed: guide.completed
            }
        });
        return ret;
    },
    importUserData: function(data, ignoreMissingModules) {
        $.each(data, function(name, config) {
            var guide = this.guides[name];
            if (guide) {
                $.each(config, function(key, val) {
                    var curConfig = guide[key];
                    if (curConfig === undefined) {
                        throw new Error ('Cannot locate guide module setting: ' + key);
                    } else {
                        guide[key] = val;
                    }
                });
            } else if (ignoreMissingModules) {
                // What do? Hmm...
            } else {
                throw new Error('Failed to import user data for guide: ' + name);
            }
        });
    },
    startGuide: function(guideName, cont) {
        /*
        */
        var self = this,
            pointer,
            curGuide;
        if (this.guideIsRunning) {
            return;
        }
        if (!this.activeGuide) {
            this.activeGuide = this.guides[guideName];
        }
        curGuide = this.activeGuide;
        if (curGuide && curGuide.enabled) {
            // If cont is not set or is set to false, reset the guide
            if (!cont) {
                curGuide.completed = false;
                curGuide.stepIndex = 0;
            }
            if (!curGuide.completed) {
                this.guideIsRunning = true;
                this.pointer = $('<div id="guidance-pointer"></div>');
                pointer = this.pointer;
                pointer.hide()
                setTimeout(function() {
                    $.each(curGuide.pointerDefaultState, function(attr, val) {
                        pointer.css(attr, val);
                    });
                    pointer.on('click', function() {
                        if (!pointer.is(':animated') && !self.timer) {
                            self._step();
                        }
                    });
                    console.log(curGuide.intro);
                    $('body').append(pointer);
                    pointer.fadeIn();
                }, 2000);
            }
        } else {
            //
        }
    },
    _step: function() {
        var self = this,
            pointer = this.pointer,
            curGuide = this.activeGuide,
            curIndex = curGuide.stepIndex,
            curStep = curGuide.steps[curIndex],
            $lastEl,
            $targetEl,
            offset;
        if (curIndex > 0) {
            $lastEl = $(curGuide.steps[curIndex - 1].selector);
            $lastEl.trigger('click');
            if (curIndex === curGuide.steps.length) {
                curGuide.stepIndex = 0;
                curGuide.completed = true;
                pointer.unbind('click');
                this._cleanUp();
                return;
            }
        }
        this.timer = setTimeout(function() {
            var paddingLeft,
                paddingRight,
                paddingTop,
                paddingBottom;
            self.timer = undefined;
            curGuide.stepIndex += 1;
            $targetEl = $(curStep.selector);
            if ($targetEl && $targetEl.length === 1) {
                paddingLeft = parseInt($targetEl.css('padding-left').split('px')[0]);
                paddingRight = parseInt($targetEl.css('padding-right').split('px')[0]);
                paddingTop = parseInt($targetEl.css('padding-top').split('px')[0]);
                paddingBottom = parseInt($targetEl.css('padding-bottom').split('px')[0]);
                offset = $targetEl.offset();
                pointer.animate({
                    left: offset.left - 10 + 'px',
                    top: offset.top - 10 + 'px',
                    width: $targetEl.width() + paddingLeft + paddingRight + 'px',
                    height: $targetEl.height() + paddingTop + paddingBottom + 'px',
                    'border-width': '10px',
                    'border-radius': $targetEl.css('border-radius') > 0 ? $targetEl.css('border-radius') : '10px',
                }, function() {
                    console.log(curStep.message);
                });
            } else {
                console.log('Error while finding step target', $targetEl);
            }
        }, curStep.delay);
    },
    _cleanUp: function() {
        var self = this;
        this.pointer
            .animate(this.activeGuide.pointerDefaultState)
            .on('click', function() {
                console.log(self.activeGuide.outro);
                $(this).fadeOut(function() {
                    $(this).remove();
                    self.guideIsRunning = false;
                });
        });
    }
};
