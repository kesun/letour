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
            console.log('name conflict');
        } else {
            this.guides[newGuide.name] = newGuide;
        }
    },
    enableGuide: function(guideName) {
        /*
        */
    },
    disableGuide: function(guideName) {
        /*
        */
    },
    enableAll: function() {
        /*
        */
    },
    disableAll: function() {
        /*
        */
    },
    startGuide: function(guideName, restart=true) {
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
            if (restart) {
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
var myGuide = {
        name: 'blah',
        intro: "Welcome! Click the bubble to start whenever you are ready.",
        outro: "Thanks!",
        steps: [
            {
                selector: '#mainNavGallery',
                message: 'Please click here to open gallery.',
                delay: 0
            },{
                selector: '#subNavThreeDim',
                message: 'Now click here to see some 3D stuff!',
                delay: 1000
            },{
                selector: '#gallery3dFrame iframe',
                message: 'Lastly, click to enjoy!',
                delay: 1000
            }
        ]
    },
    step2Guide = {
        name: 'step2Guide',
        intro: 'Waaaah, click the fancy blob to wing the tutorial!',
        outro: 'TA-DAA!',
        steps: [
            {
                selector: '.main-add-question-cta',
                message: 'This button looks magical.',
                delay: 500
            },{
                selector: '#question-field-temp',
                message: 'Here\'s the editor where you can enter a survey question, modify questions options, etc etc...But first, let\'s take a look at this QBQ thingy.',
                delay: 1000
            },{
                selector: '#question-field-temp [data-tab-panel=edit] .buttons .cancel',
                message: 'Let\'s close this first since we ain\'t using it.',
                delay: 200
            },{
                selector: '#createAccordion #accQuestionBank .press',
                message: 'Click here to open the QBQ tab. DO EET. I dare you.',
                delay: 200
            },{
                selector: '#qbc [data-cid=59] a',
                message: 'Community pl0x.',
                delay: 200
            },{
                selector: '#question-bank-results .qBq .qb-li:first-child .qb-a',
                message: 'This looks good. JUST CLICK IT.',
                delay: 1500
            },{
                selector: '#editQuestion [data-tab-panel=edit] .buttons .save',
                message: 'Fabulous. Save.',
                delay: 3500
            },{
                selector: '#createAccordion #accThemes .press',
                message: 'Kk, now onto themes.',
                delay: 200
            },{
                selector: '#defaultThemeList [data-theme-list-item] [data-themeid=936540]',
                message: 'This one looks fancy, let\'s pick it.',
                delay: 200
            }
        ]
    }