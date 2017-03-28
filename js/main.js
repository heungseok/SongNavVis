/**
 * Created by heungseok2 on 2017-03-27.
 */

// *************** import library ****************
var songNav = require('./SongNav');
var $ = require('jquery');
var main = songNav('container');



main.init();
main.animate();



function makeResultsPanel(data) {

    // clean previous list
    $('.songList').remove();
    $('.tagList').remove();

    var sideNav = document.getElementById("sideNavLeft");
    var elementA, text;


    // make song List
    data['songs'].forEach(function (song) {

        elementA = document.createElement('a');
        elementA.className = "songList";
        elementA.type = "song";
        text = document.createTextNode(song);
        elementA.setAttribute("href", "#");
        elementA.style.color = "red";
        elementA.appendChild(text);

        elementA.onclick = songElementClick;

        sideNav.appendChild(elementA);
        // console.log(song);
    });

    // make tag List
    data['tags'].forEach(function (tag) {
        elementA = document.createElement('a');
        elementA.className = "songList";
        elementA.type = "tag";
        text = document.createTextNode(tag);

        elementA.setAttribute("href", "#");
        elementA.appendChild(text);
        elementA.style.color = "yellowgreen";

        elementA.onclick = songElementClick;

        sideNav.appendChild(elementA);
        // console.log(tag);
    });

    
    // show nav
    $("#sideNavLeft").css("width", "250px");


}
function songElementClick() {
    console.log(this.text);


    // need to implement to navigate automatically to the song or tag in visualization

    // examples
    // main.getSongsPositionByName(this.text);
    // main.flyToTarget();

    // This is for showing the songs information (embbeding the youtube video or sound, artists and so on)
    // need to get data from DataBase
    makeInfoPanel(this.text)

}


function makeInfoPanel(object) {
    console.log(object);

    $("#sideNavRight").css("width", "300px");


}


$(document).ready(function () {
    $("input.form-control").click(function () {

        $(this).focus();
    });

    $(".btn.submit").click(function () {

        var inputs = document.getElementsByClassName("form-control");

        var query = [];
        for(var i =0; i<inputs.length; i++){
            query.push(inputs[i].value)
        }

        console.log(query);


        $.ajax({
            url: 'http://143.248.109.238:7777/songParser',
            dataType: 'json',
            type: 'POST',
            data: {'msg': query},
            success: function (result) {
                var python_result = result.msg;

                console.log(python_result);
                python_result['songs'].forEach(function (song) {
                    console.log(song);
                });
                python_result['tags'].forEach(function (tag) {
                    console.log(tag);
                });

                makeResultsPanel(python_result);


            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Status: " + textStatus); alert("Error: " + errorThrown);
            }

        });

    });




})




