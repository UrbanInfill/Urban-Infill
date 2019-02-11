

$("#houseDiv").hide();
$("#eduDiv").hide();
$("#incomeDiv").hide();
$("#poiContent").hide();

// Ajax Requests

$.ajaxSetup({

    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
$("#searchByProperty").click(function(e){
    e.preventDefault();
    ipage =1;
    $('.swiper-wrapper').empty();
    const address = $("#search").val();
    codeAddress(address);
});

$("#searchByPropertyVacant").click(function(e){
    e.preventDefault();
    ipage =1;
    $('.swiper-wrapper').empty();
    const address = $("#search").val();
    codeAddress(address,true);
});

var detailViews;
$('#searchByAddress').click(function (e) {
    e.preventDefault();
    const address = $("#searchAddress").val();

    fetch("/getPropertyResponse", {
        method: "post", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        body: JSON.stringify({address:address}),
        headers: {
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
    })
        .then(function(response) {
            if (response.status >= 200 && response.status < 300) {
                return response.json()
            }
            throw new Error(response.statusText)
        })
        .then(function(data)
        {
            console.log(data);
            detailViews = data["detailViews"];
            $('#LegalAddress').text(data["legaladdress"]);
            $('#view').html(data["view"]);

            f1();
            initMap(data["final_array"],data["lat"],data["lng"])
        });
        /*
    $.ajax({
        type:'post',
        url:'/getPropertyResponse',
        data:{address:address},
        success:function(data){
            console.log(data);
            $('#LegalAddress').text(data["legaladdress"]);
            $('#view').html(data["view"]);
        },
        timeout: 5000
    });*/
});

function getlist(lat,lng,isVacant)
{
    var totalPages;
    $.ajax({
        type:'get',
        url:'/getTotalPages',
        data:{lat:lat,lng:lng,zip:postalcode},
        success:function(data){
            totalPages = data;
            console.log(data);

        },
        complete:function()
        {
            for (let i = 1; i <= totalPages; i++) {
                console.log(postData('/allpropertiesList', {lat: lat, lng: lng, page: i, zip: postalcode},isVacant));
            }
            //getpageData(lat,lng,totalPages);

            /* for (let i = 1; i <= totalPages; i++) {

                 $.ajax({
                     type: 'get',
                     url: '/allpropertiesList',
                     async:false,
                     data: {lat: lat, lng: lng, page: i},
                     success: function (data) {
                         for (const property of data.property) {
                             var text = '<div class="list-group-item list-group-item-action card"><div class="card-body"><h5 class="card-title">'+property['address']['oneLine']+'</h5><h6 class="card-subtitle mb-2 text-muted">'+property['summary']['legal1']+'</h6></div></div>';
                             $("#listpro").append(text);
                         }
                         //console.log(data);

                     },
                     timeout: 5000
                 });
         }*/
        },
        timeout: 5000
    });
}
function buildUrl(url, parameters,isVacant) {
    let qs = "";
    for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            const value = parameters[key];
            qs +=
                encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
        }
    }
    if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); //chop off last "&"
        url = url + "?" + qs;
    }

    return url;
}
function postData(url = ``, data = {},isVacant) {
    // Default options are marked with *
    fetch(buildUrl(url,data), {
        method: "get", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
    })
        .then(function(response) {
            if (response.status >= 200 && response.status < 300) {
                return response.json()
            }
            throw new Error(response.statusText)
        })
        .then(function(data) {
            console.log(data);
            if(data) {
                $("#poiContent").show();

                for (const property of data.property) {
                    if(property["address"]["postal1"] != postalcode)
                        continue;
                    if(isVacant)
                    {
                        if(property['summary']['propclass']){
                            if(property['summary']['propclass'] .toLowerCase().includes("vacant")) {
                                var text = '<div class="swiper-slide">'  +
                                    '<div class="box selectPOI">' +
                                    '<a class="h3" target="_blank" href="/getOwnerDetail/'+encodeURI(property["address"]["line1"])+'/' +encodeURI(property["address"]["line2"])+'">' + property['address']['oneLine'] + '</a>' +
                                    '<div class="restaurant-content">' +
                                    '<label>Legal Description</label>' +
                                    '<small>' + property['summary']['legal1'] + '</small></div></div></div>';
                                $(".swiper-wrapper").append(text);
                            }
                        }

                    }
                    else {
                        const pattern = /l ([0-9]*).-.([0-9]*)/gi;
                        const patt1 = /lot.([0-9]*).&.([0-9]*)/gi;
                        const patt2 = /lots.([0-9]*).([0-9]*).&.([0-9]*)/gi;
                        const patt3 = /lts.([0-9]*).([0-9]*).&.([0-9]*)/gi;
                        const patt4 = /lts.([0-9]*).([0-9]*).([&]*).([0-9]*)/gi;
                        const patt5 = /lts.([0-9]*).([0-9]*).(&[0-9]*)/gi;
                        const patt6 = /lts.([0-9]*).([0-9]*).&.([0-9]*)/gi;
                        const patt7 = /l([0-9]*).-.([0-9]*)/gi;
                        if (property['summary']['legal1']) {
                            var result = property['summary']['legal1'].match(pattern);
                            var result2 = property['summary']['legal1'].match(patt1);
                            var result3 = property['summary']['legal1'].match(patt2);
                            var result4 = property['summary']['legal1'].match(patt3);
                            var result5 = property['summary']['legal1'].match(patt4);
                            var result6 = property['summary']['legal1'].match(patt5);
                            var result7 = property['summary']['legal1'].match(patt6);
                            var result8 = property['summary']['legal1'].match(patt7);
                            if (result || result2 || result3 || result4 || result5 || result6 || result7 || result8) {
                                var text = '<div class="swiper-slide">'  +
                                    '<div class="box selectPOI">' +
                                    '<a class="h3" target="_blank" href="/getOwnerDetail/'+encodeURI(property["address"]["line1"])+'/' +encodeURI(property["address"]["line2"])+'">' + property['address']['oneLine'] + '</a>' +
                                    '<div class="restaurant-content">' +
                                    '<label>Legal Description</label>' +
                                    '<small>' + property['summary']['legal1'] + '</small></div></div></div>';
                                $(".swiper-wrapper").append(text);
                            } /*else if (result2) {
                                var text = '<div class="swiper-slide" ajaxlink= "/getOwnerDetail/'+property["address"]["line1"]+'/' +property["address"]["line2"]+'"\>' +
                                    '<div class="box selectPOI" id="5">' +
                                    '<h1>' + property['address']['oneLine'] + '</h1>' +
                                    '<div class="restaurant-content">' +
                                    '<label>Legal Description</label>' +
                                    '<small>' + property['summary']['legal1'] + '</small></div></div></div>';
                                $(".swiper-wrapper").append(text);
                            } else if (result3) {
                                var text = '<div class="swiper-slide" ajaxlink= "/getOwnerDetail/'+property["address"]["line1"]+'/' +property["address"]["line2"]+'"\>'  +
                                    '<div class="box selectPOI" id="5">' +
                                    '<h1>' + property['address']['oneLine'] + '</h1>' +
                                    '<div class="restaurant-content">' +
                                    '<label>Legal Description</label>' +
                                    '<small>' + property['summary']['legal1'] + '</small></div></div></div>';
                                $(".swiper-wrapper").append(text);
                            } else if (result4) {
                                var text = '<div class="swiper-slide" ajaxlink= "/getOwnerDetail/'+property["address"]["line1"]+'/' +property["address"]["line2"]+'"\>'  +
                                    '<div class="box selectPOI" id="5">' +
                                    '<h1>' + property['address']['oneLine'] + '</h1>' +
                                    '<div class="restaurant-content">' +
                                    '<label>Legal Description</label>' +
                                    '<small>' + property['summary']['legal1'] + '</small></div></div></div>';
                                $(".swiper-wrapper").append(text);
                            } else if (result5) {
                                var text = '<div class="swiper-slide" ajaxlink= "/getOwnerDetail/'+property["address"]["line1"]+'/' +property["address"]["line2"]+'"\>'  +
                                    '<div class="box selectPOI" id="5">' +
                                    '<h1>' + property['address']['oneLine'] + '</h1>' +
                                    '<div class="restaurant-content">' +
                                    '<label>Legal Description</label>' +
                                    '<small>' + property['summary']['legal1'] + '</small></div></div></div>';
                                $(".swiper-wrapper").append(text);
                            } else if (result6) {
                                var text = '<div class="swiper-slide" ajaxlink= "/getOwnerDetail/'+property["address"]["line1"]+'/' +property["address"]["line2"]+'"\>'  +
                                    '<div class="box selectPOI" id="5">' +
                                    '<h1>' + property['address']['oneLine'] + '</h1>' +
                                    '<div class="restaurant-content">' +
                                    '<label>Legal Description</label>' +
                                    '<small>' + property['summary']['legal1'] + '</small></div></div></div>';
                                $(".swiper-wrapper").append(text);
                            } else if (result7) {
                                var text = '<div class="swiper-slide" ajaxlink= "/getOwnerDetail/'+property["address"]["line1"]+'/' +property["address"]["line2"]+'"\>'  +
                                    '<div class="box selectPOI" id="5">' +
                                    '<h1>' + property['address']['oneLine'] + '</h1>' +
                                    '<div class="restaurant-content">' +
                                    '<label>Legal Description</label>' +
                                    '<small>' + property['summary']['legal1'] + '</small></div></div></div>';
                                $(".swiper-wrapper").append(text);
                            }*/

                        }
                    }
                }
            }
            f();
        })
}
var ipage =1;
function getpageData(lat,lng,totalpage) {
    console.log(postalcode);
    $.ajax({
        type: 'get',
        async:false,
        url: '/allpropertiesList',
        data: {lat: lat, lng: lng, page: ipage,zip:postalcode},
        success: function (data) {
            if(data) {
                for (const property of data.property) {
                    const pattern = /l.([0-9]*)-([0-9]*)/gi;
                    const patt1 = /lot.([0-9]*)&([0-9]*)/gi;
                    if(property['summary']['legal1']) {
                        var result = property['summary']['legal1'].match(pattern);
                        var result2 = property['summary']['legal1'].match(patt1);
                        if (result) {
                            var text = '<div class="swiper-slide">'+
                                '<div class="box selectPOI" id="5">'+
                                '<h1>' + property['address']['oneLine'] + '</h1>'+
                                '<div class="restaurant-content">'+
                                '<label>Legal Description</label>'+
                                '<small>' + property['summary']['legal1'] + '</small></div></div></div>';
                            $(".swiper-wrapper").append(text);
                        }
                        else if (result2)
                        {
                            var text = '<div class="swiper-slide">'+
                                '<div class="box selectPOI" id="5">'+
                                '<h1>' + property['address']['oneLine'] + '</h1>'+
                                '<div class="restaurant-content">'+
                                '<label>Legal Description</label>'+
                                '<small>' + property['summary']['legal1'] + '</small></div></div></div>';
                            $(".swiper-wrapper").append(text);
                        }
                    }
                }
            }
            //console.log(data);

        },
        complete:function()
        {
            ipage++;
            if(ipage <=totalpage)
            {
                getpageData(lat,lng,totalpage)
            }
        },
        timeout: 5000
    });

}



function f() {
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 5,
        direction: 'vertical',
        slideToClickedSlide: false,
        on:{
            click: function(swiper, e){
               // var clicked = $(e.target);
                //openInfoModal(this.clickedIndex+1);
                //console.log(clicked);
            },
        },
        navigation: {
            nextEl: '.prev-slide',
            prevEl: '.next-slide',
        }
    });
}

function f1() {

    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        on:{
            click: function(swiper, e){
                // var clicked = $(e.target);
                openInfoModal(this.clickedIndex+1);
                $('#detailViews').empty();
                $('#detailViews').html( detailViews[this.clickedIndex]);
                //console.log(clicked);
            },
            slideChange:function () {

                //$(".selectSchool")[this.activeIndex+1].trigger("click");
                openInfoModal(this.activeIndex+1);
                $('#detailViews').empty();
                $('#detailViews').html( detailViews[this.activeIndex]);

            }
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Responsive breakpoints
        breakpoints: {
            // when window width is <= 640px
            992: {
                slidesPerView: 1,
                spaceBetween: 30
            }
        }
    });
    $(function(){

        setTimeout(function(){$('#body').css("min-height",(parseInt($( window ).height())-55)+"px");},500);

        /* $("body").on("click",".swiper-button-next",function(){
            var active1= $('.swiper-slide-active > .box').attr("id");
            var active2= $('.swiper-slide-next > .box').attr("id");
            var active3= $('.swiper-slide-next').next('.swiper-slide').find('.box').attr("id");

            setTimeout(function(){ openInfoModal(parseFloat(active1)-1); },100);
            setTimeout(function(){ openInfoModal(parseFloat(active2)-1); },100);
            setTimeout(function(){ openInfoModal(parseFloat(active3)-1); },100);


        }); */

        $("body").on("click",".selectSchool",function(){

            var schoolID = $(this).data("school");
            var blockID = $(this).attr("id");
            //Selection code
            $(".whitebg").show();
            $(".greybg").hide();
            $(".selectSchool").removeClass("active");
            $(".colorCode").removeClass("white");
            $(this).find(".whitebg").hide();
            $(this).find(".greybg").show();
            $(this).addClass("active");
            $(this).find('.colorCode').addClass("white");
            //openInfoModal(parseFloat(blockID))
            //Selection code End
            /*$.ajax({
                url: '/school-details?school_id='+schoolID,//AJAX URL WHERE THE LOGIC HAS BUILD
                beforeSend: function() {
                    $('.ajax-loader').show();
                },
                success:function(response) {
                    $('.ajax-loader').hide();
                    $(".schoolDetail").html(response);
                    var focusElement = $(".schoolDetail");
                    ScrollToTop(focusElement, function() { focusElement.focus(); });
                    setTimeout(function(){ openInfoModal(parseFloat(blockID)); },100);
                }
            });*/
        });
    });
    openInfoModal(1);
    $(".selectSchool").first().trigger("click");
    $('#detailViews').empty();
    $('#detailViews').html( detailViews[0]);
}


var gmarkers = [];
function initMap(finalarray,lat,lng) {
    var locations = [];
    if(finalarray.length != 0) {
        for (let $publicSchool of finalarray) {
            if ($publicSchool['InstitutionName'] != '') {
                locations.push([
                    $publicSchool['InstitutionName'],
                    $publicSchool['geocodinglatitude'],
                    $publicSchool['geocodinglongitude'],
                    "<div id='iw-container'><div class='iw-title'>" + $publicSchool['InstitutionName'] + "</div><div class='iw-content'><p>" + $publicSchool['school_address']['locationaddress'] + " " + $publicSchool['school_address']['locationcity'] + " " + $publicSchool['school_address']['stateabbrev'] + ", " + $publicSchool['school_address']['ZIP'] + "</p><p class='distance'>" + $publicSchool['distance'] + " Miles</p><br></div></div>"
                ]);


            }
        }
    }

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(lat, lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;
    //console.log(locations);

    marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        animation: google.maps.Animation.DROP,
        icon: 'img/4.png'
    });


    gmarkers.push(marker);



    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            animation: google.maps.Animation.DROP,
            icon: 'img/1.png'
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(locations[i][3]);
                infowindow.open(map, marker);
                for (var sm = 0; sm < gmarkers.length; sm++) {
                    if(sm!=0){
                        gmarkers[sm].setIcon("img/1.png");
                    }
                }
                marker.setIcon("img/2.png");
            }
        })(marker, i));
        gmarkers.push(marker);
    }
}

function openInfoModal(i) {
    google.maps.event.trigger(gmarkers[i], "click");
}


















// Auto complete text field for google map
var lat,lng,postalcode;
var placeSearch, autocomplete;
var componentForm = {
    postal_code: 'short_name'
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('search')),
        {types: ['geocode']});
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('searchAddress')),
        {types: ['geocode']});

    //autocomplete.addListener('place_changed', fillInAddress);

}
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}

var geocoder;
var communitydata;
function codeAddress(address,isVacant = false) {

    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            //alert(results[0].geometry.location);
            for(let a of results[0].address_components)
            {
                if(a.types[0] == 'postal_code')
                {
                    postalcode = parseInt(a.long_name)
                    console.log(parseInt(postalcode));
                }

            }
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng()
            $.ajax({
                type:'POST',
                url:'/getzipdata',
                data:{address:address,location : [results[0].geometry.location.lat(),results[0].geometry.location.lng()],zip:postalcode},
                success:function(data){
                    //console.log(data);
                    polys = [data];
                    init();
                },
                complete:function(){
                    getlist(lat,lng,isVacant)
                    $.ajax({
                        type:'get',
                        url:'/getHouseInventry',
                        data:{lat : lat,lng:lng},
                        success:function(data){
                            console.log(data);
                            dountChart(data);
                            $("#houseDiv").show();
                            higherEdu(data);
                            $("#eduDiv").show();
                            incomeChart(data);
                            $("#incomeDiv").show();

                        },
                        timeout: 5000
                    });
                },
                timeout: 5000
            });

        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

//Higher Education
function higherEdu(communityData) {
    $("#noHS").html(Math.round((100*(communityData['EDULTGR9']/communityData['EDUTOTALPOP'])).toFixed(2))+"%");
    $("#someHS").html(Math.round((100*(communityData['EDUSHSCH']/communityData['EDUTOTALPOP'])).toFixed(2))+"%");
    $("#hsGrad").html(Math.round((100*(communityData['EDUHSCH']/communityData['EDUTOTALPOP'])).toFixed(2))+"%");
    $("#someCollege").html(Math.round((100*(communityData['EDUSCOLL']/communityData['EDUTOTALPOP'])).toFixed(2))+"%");
    $("#associate").html(Math.round((100*(communityData['EDUASSOC']/communityData['EDUTOTALPOP'])).toFixed(2))+"%");
    $("#bachlor").html(Math.round((100*(communityData['EDUBACH']/communityData['EDUTOTALPOP'])).toFixed(2))+"%");
    $("#graduate").html(Math.round((100*(communityData['EDUGRAD']/communityData['EDUTOTALPOP'])).toFixed(2))+"%");

}


//donut Chart
function dountChart($communityData) {


    var mychart = AmCharts.makeChart( "chart-1", {
        "type": "pie",
        "theme": "light",
        "dataProvider": [ {
            "title": "Rented " + Math.round (100*($communityData['DWLRENT']/$communityData['DWLTOTAL'])).toFixed(2),
            "value": Math.round (100*($communityData['DWLRENT']/$communityData['DWLTOTAL'])).toFixed(2),
            "color":'#0051FF'
        }, {
            "title": "Owned "+Math.round (100*($communityData['DWLOWNED']/$communityData['DWLTOTAL'])).toFixed(2),
            "value": Math.round (100*($communityData['DWLOWNED']/$communityData['DWLTOTAL'])).toFixed(2),
            "color":'#43575f'
        }, {
            "title": "Vacant "+Math.round (100*($communityData['DWLVACNT']/$communityData['DWLTOTAL'])).toFixed(2),
            "value": Math.round (100*($communityData['DWLVACNT']/$communityData['DWLTOTAL'])).toFixed(2),
            "color":'#d6d6d6'
        } ],
        "titleField": "title",
        "valueField": "value",
        "colorField": "color",
        "labelRadius": 0,

        "radius": "42%",
        "innerRadius": "60%",
        "labelText": "[[title]]",
        "export": {
            "enabled": true
        }
    } );

}


// income chart

function incomeChart($communityData) {
    var chart = AmCharts.makeChart("chartincomediv", {
        "type": "xy",
        "theme": "light",
        "marginRight": 80,
        "dataDateFormat": "YYYY-MM-DD",
        "startDuration": 1.5,
        "trendLines": [],
        "balloon": {
            "adjustBorderColor": false,
            "shadowAlpha": 0,
            "fixedPosition": true
        },
        "graphs": [{
            "balloonText": "<div style='margin:5px;'><b>[[y]]</b></div>",
            "bullet": "diamond",
            "maxBulletSize": 25,
            "lineAlpha": 0.8,
            "lineThickness": 2,
            "lineColor": "#0051FF",
            "fillAlphas": 0,
            "xField": "date",
            "yField": "ay",
            "valueField": "aValue"
        }],
        "valueAxes": [{
            "id": "ValueAxis-1",
            "axisAlpha": 0,
            "labelsEnabled": false,
            "title": "Number of Households"
        }, {
            "id": "ValueAxis-2",
            "axisAlpha": 0,
            "position": "bottom",
            "labelsEnabled": false,
            "title": "Annual Income"

        }],
        "allLabels": [],
        "titles": [],
        "dataProvider": [{
            "date": 1,
            "ay": $communityData['HINCY00_10'],
            "by": 2.2,
            "aValue": 15,
            "bValue": 10
        }, {
            "date": 2,
            "ay":  $communityData['HINCY10_15'],
            "by": 4.9,
            "aValue": 8,
            "bValue": 3
        }, {
            "date": 3,
            "ay": $communityData['HINCY15_20'],
            "by": 5.1,
            "aValue": 16,
            "bValue": 4
        }, {
            "date": 5,
            "ay": $communityData['HINCY20_25'],
            "aValue": 9
        }, {
            "date": 7,
            "by":  $communityData['HINCY25_30'],
            "bValue": 13
        }, {
            "date": 10,
            "ay": $communityData['HINCY30_35'],
            "by": 13.3,
            "aValue": 9,
            "bValue": 13
        }, {
            "date": 12,
            "ay": $communityData['HINCY35_40'],
            "by": 6.1,
            "aValue": 5,
            "bValue": 2
        }, {
            "date": 13,
            "ay": $communityData['HINCY40_45'],
            "aValue": 10
        }, {
            "date": 15,
            "ay": $communityData['HINCY45_50'],
            "by": 10.5,
            "aValue": 3,
            "bValue": 10
        }, {
            "date": 16,
            "ay":  $communityData['HINCY50_60'],
            "by": 12.3,
            "aValue": 5,
            "bValue": 13
        }, {
            "date": 20,
            "ay":$communityData['HINCY60_75'],
            "by": 4.5,
            "bValue": 11
        }, {
            "date": 22,
            "ay":  $communityData['HINCY75_100'],
            "by": 15,
            "aValue": 15,
            "bValue": 10
        }, {
            "date": 23,
            "ay": $communityData['HINCY100_125'],
            "by": 10.8,
            "aValue": 1,
            "bValue": 11
        }, {
            "date": 24,
            "ay": $communityData['HINCY125_150'],
            "by": 19,
            "aValue": 12,
            "bValue": 3
        }, {
            "date": 23,
            "ay":  $communityData['HINCY150_200'],
            "by": 10.8,
            "aValue": 1,
            "bValue": 11
        }, {
            "date": 24,
            "ay":  $communityData['HINCY200_250'],
            "by": 19,
            "aValue": 12,
            "bValue": 3
        }, {
            "date": 23,
            "ay":  $communityData['HINCY250_500'],
            "by": 10.8,
            "aValue": 1,
            "bValue": 11
        }, {
            "date": 24,
            "ay":   $communityData['HINCYGT_500'],
            "by": 19,
            "aValue": 12,
            "bValue": 3
        }],
        "export": {
            "enabled": false
        },
        "chartScrollbar": {
            "offset": 15,
            "scrollbarHeight": 5
        },
        "chartCursor": {
            "pan": false,
            "cursorAlpha": 0,
            "valueLineAlpha": 0
        }
    });
}











//  Zip code Area highlight
var polys;
function parsePolyStrings(ps) {
    var i, j, lat, lng, tmp, tmpArr,
        arr = [],
        //match '(' and ')' plus contents between them which contain anything other than '(' or ')'
        m = ps.match(/\([^\(\)]+\)/g);
    if (m !== null) {
        for (i = 0; i < m.length; i++) {
            //match all numeric strings
            tmp = m[i].match(/-?\d+\.?\d*/g);
            if (tmp !== null) {
                //convert all the coordinate sets in tmp from strings to Numbers and convert to LatLng objects
                for (j = 0, tmpArr = []; j < tmp.length; j+=2) {
                    lng = Number(tmp[j]);
                    lat = Number(tmp[j + 1]);
                    tmpArr.push(new google.maps.LatLng(lat, lng));
                }
                arr.push(tmpArr);
            }
        }
    }
    //array of arrays of LatLng objects, or empty array
    return arr;
}

function init() {
    var i, tmp,
        myOptions = {
            zoom: 13,
            center: new google.maps.LatLng(lat, lng)
        },
        map = new google.maps.Map(document.getElementById("map"), myOptions)

    var marker;
    //console.log(locations);

    marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        animation: google.maps.Animation.DROP
    });

    for (i = 0; i < polys.length; i++) {
        tmp = parsePolyStrings(polys[i]);
        if (tmp.length) {
            polys[i] = new google.maps.Polygon({
                paths : tmp,
                strokeColor : '#0051FF',
                strokeOpacity : 0.8,
                strokeWeight : 2,
                fillColor : '#0051FF',
                fillOpacity : 0.20
            });
            polys[i].setMap(map);
        }
    }
    $('#map').css('height','450px');
}

































/// Model Opening Showing owner detail

$('.swiper-slide').click(function () {
    Alert("HELLO");
})






















