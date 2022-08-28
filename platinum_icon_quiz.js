// ==UserScript==
// @name         Platinum Mozaic Quiz
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  How well do you know your platinums?
// @author       Ric_373
// @match        https://psnplatinums.com*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @resource     IMPORTED_CSS https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    const jquery_ui_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(jquery_ui_css);

    let quiz_started = false;
    let platinums = [];
    let platinums_done = [];
    let current_platinum;
    let score = 0;
    let total = 0;
    let titles = [];

    function pick_platinum(){
        let random_index = Math.floor(Math.random() * platinums.length);
        current_platinum = platinums[random_index];
        platinums_done.push(platinums[random_index]);
        platinums.splice(random_index, 1);

        $('.quizContainer').empty();

        $('.quizContainer').html('Inspired by Symudtry\'s video on <a href="https://www.youtube.com/watch?v=a8SYHqJ-x5Q" target="blank" style="color:white;">Youtube</a>').css('color', 'white');
        $('.quizContainer').append('<div class="quizPlatinum" style="display: inline-block; float:left; margin-right: 20px;"><img src="' + current_platinum.image + '" /></div>');
        $('.quizContainer').append('<div class="quizForm" style="float:left; margin-top:15px;"></div>');
        $('.quizForm').append('<input id="guess" type="text" name="guess" style="width: 400px; line-height: 2rem;" />');
        $('.quizForm').append('<input type="button" name="check" value="Check" style="height: 2.4rem; width: 100px; margin-top: -1px;"/>');

        $('#guess').autocomplete({
            source: titles
        });

        if(total > 0){
            $('.quizContainer').append('<div class="quizScore" style="font-size: 25px; float:left; margin-top:22px; margin-left: 20px; color: white;">' + score + '/' + total + '</div>');
        }
    }

    $(document).ready(function(){
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        var observer = new MutationObserver(function(mutations, observer) {
            if($('button:contains(Mosaic)').length > 0 && $('button:contains(Quiz)').length == 0){
                $('<button _ngcontent-jnk-c87="" style="margin-top: 20px; margin-right: 10px;" mat-raised-button="" color="primary" class="quiz-button mat-focus-indicator action-button mat-raised-button mat-button-base mat-primary"><span class="mat-button-wrapper">Quiz</span><span matripple="" class="mat-ripple mat-button-ripple"></span><span class="mat-button-focus-overlay"></span></button>').insertAfter('button:contains(Mosaic)');

                $(document).on('click', '.quiz-button', function(){
                    quiz_started = true;
                    platinums = [];
                    platinums_done = [];
                    score = 0;
                    total = 0;
                    titles = [];
                    $('button:contains(Mosaic)').trigger('click');
                });
            }

            if(quiz_started === true){
                $('.options').hide();
                $('.upperContainer').insertAfter('.lowerContainer');

                if($('#capture .quizContainer').length == 0){
                    $('#capture').prepend('<div class="quizContainer" style="height: 114px; padding: 20px; background-image: linear-gradient(to right, rgb(0, 42, 92), rgb(0, 57, 126), rgb(0, 42, 92))"></div>');
                }

                if($('.platinumGrid .platinumIcon:not(.collected)').length > 0){
                    $('.platinumGrid .platinumIcon:not(.collected)').each(function(icon){
                        titles.push($(this).attr('alt'));

                        platinums.push({
                            image: $(this).attr('src'),
                            title: $(this).attr('alt')
                        })

                        $(this).addClass('collected');
                    });

                    $('.lowerContainer').hide();

                    pick_platinum();
                }
            }
        });

        observer.observe(document, {
            subtree: true,
            attributes: true
        });

        $(document).on('click', '[name="check"]', function(){
            total++;

            if(current_platinum.title == $('[name="guess"]').val()){
                score++;
            }

            if(total == platinums.length + platinums_done.length){
                alert('Quiz complete\r\n\r\nFinal score: ' + (score/total*100).toFixed(2) + '%');
                $('.quizContainer').hide();
                return;
            }

            pick_platinum();
        });
    });
})();
