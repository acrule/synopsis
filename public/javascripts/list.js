$(document).ready(function() {
	initializePage();
})

function initializePage() {
    // get all notes to respond when clicked
    $('#list li').click(selectNote);

    // select first item on page and display its text
    $('#list li').first().addClass('selected');
    $.get('/note/1', setText);

    // hook up onscroll event
    $("#text").on("scroll", scrollMinimap);
}

function scrollMinimap(){
    $("#viewfinder").css('top', $("#text").scrollTop()*3.9/14 + "px");
}

function setText(result){
    $('#text').html(result.message);

    // set minimap
    $("#minimap-text").empty();
    var lines = result.message.split("<br>");
    $.each(lines, function(i,l){
        var words = l.split(" ");
        $.each(words, function(i, w) {
            $("#minimap-text").append($("<span>").text(w).addClass("block"));
            $("#minimap-text").append($("<span>").text(" "));
        });
        $("#minimap-text").append($("<br>"));
    });

    // set color according to number of times note is read
    $(('#note'+result.id)).css('background-color', "rgba(255,175,100,"+result.reads/7+")")
}

function selectNote(){
    // only execute code if note is not already selected
    console.log($(this).attr('class'));
    if ($(this).hasClass('selected') == false){
        // set styling
        $('#list li').removeClass('selected');
        $(this).addClass('selected');

        // change note panel content
        var index = $(this).index() + 1;
        $.get('/note/'+index, setText);
    }
}
