/* ---------- BEGIN PROMO SLIDE SHOW  ---------- */

YUI().use('node', 'paginator',  'event-hover', 'gallery-timer', function (Y) {
    var spiffy = Y.one('#spiffySlides'),
        slides = spiffy.all('.slides li'),
        controls = spiffy.all('.controls li'),
        selectedClass = 'active',
        pg = new Y.Paginator({
            itemsPerPage: 1,
            totalItems: slides.size()
        });


    pg.after('pageChange', function (e) {
        var page = e.newVal;

        // decrement page since nodeLists are 0 based and
        // paginator is 1 based
        page--;

        // clear anything active
        slides.removeClass(selectedClass);
        controls.removeClass(selectedClass);

        // make the new item active
        slides.item(page).addClass(selectedClass);
        controls.item(page).addClass(selectedClass);
    });



    // when we click the control links we want to go to that slide
    spiffy.delegate('click', function (e) {
        e.preventDefault();
        var control = e.currentTarget;

        // if it's already active, do nothing
        if (control.ancestor('li').hasClass(selectedClass)) {
            return;
        }

        pg.set('page', parseInt(control.getHTML(), 10));
    }, '.controls a');



    // create a timer to go to the next slide automatically
    // we use timer to obtain a pause/resume relationship
    autoPlay = new Y.Timer({
        length: 20000,
        repeatCount: 0});

    autoPlay.after('timer', function (e) {
        if (pg.hasNextPage()) {
            pg.nextPage();
        } else {
            pg.set('page', 1);
        }
    });

    // start at a random slide;
    var first = 1+ Math.floor(Math.random() * slides.size());
    console.log(first);
    YAHOO.util.Event.onContentReady("spiffySlides", function () {pg.set('page', first);});

    // start the autoPlay timer
    autoPlay.start();





    // we want to pause when we mouse over the slide show
    // and resume when we mouse out
    spiffy.on('hover', function (e) {
        autoPlay.pause()
    }, function (e) {
        autoPlay.resume()
    });

});
/* ---------- END PROMO SLIDE SHOW  ---------- */
