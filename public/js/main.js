

$("#houseDiv").hide();
$("#eduDiv").hide();
$("#incomeDiv").hide();
$("#poiContent").hide();
$('.toast').toast('show')
// Ajax Requestsfas
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
    var totalPages = 10;

    fetch(buildUrl('/getTotalPages',{lat:lat,lng:lng,zip:postalcode}), {
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
            return response.text()
        }
        throw new Error(response.statusText)
    })
    .then(function(data) {
        totalPages = data;
        console.log(data);
        searchCount = 0;
        $("#poiContent").hide();
        for (let i = 1; i <= totalPages; i++) {
            console.log(postData('/allpropertiesList', {lat: lat, lng: lng, page: i, zip: postalcode},isVacant));
        }
    });

  /*  $.ajax({
        type:'get',
        url:'/getTotalPages',
        data:{lat:lat,lng:lng,zip:postalcode},
        cache:false,
        success:function(data){
            totalPages = data;
            console.log(data);

        },
        complete:function()
        {
            for (let i = 1; i <= totalPages; i++) {
                console.log(postData('/allpropertiesList', {lat: lat, lng: lng, page: i, zip: postalcode},isVacant));
            }

        },
        timeout: 5000
    });*/
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
let searchCount = 0
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
            let location = [];
            if(data) {


                for (const property of data.property) {
                    if(property["address"]["postal1"] != postalcode)
                        continue;
                    if(isVacant)
                    {

                        if(property['summary']['propclass']){
                            if(property['summary']['propclass'] .toLowerCase() ==="vacant") {
                                searchCount++;
                                $('#searchCount').text("Property count : "+searchCount);
                                $("#poiContent").show();
                                var text = '<div class="swiper-slide">'  +
                                    '<div class="box selectPOI">' +
                                    '<a class="h3" target="_blank" line1="'+property["address"]["line1"]+'" line2="'+property["address"]["line2"]+'" href="/getOwnerDetail/'+encodeURI(property["address"]["line1"])+'/' +encodeURI(property["address"]["line2"])+'">' + property['address']['oneLine'] + '</a>' +
                                    '<div class="float-right">'+
                                    '<input type="checkbox" name="selectedItem" aria-label="Checkbox for following text input">'+
                                    '<a target="_blank" href="/getpoidata/'+encodeURI(property["address"]["oneLine"])+'/' +encodeURI(property["address"]["postal1"])+'"style="padding: 5px;"><i class="fas fa-external-link-alt"></i></a>'+
                                    '</div>'+
                                    '<div class="restaurant-content">' +
                                    '<label>Legal Description</label>' +
                                    '<small>' + property['summary']['legal1'] + '</small></div></div></div>';
                                $(".swiper-wrapper").append(text);
                                location.push([property["location"]['latitude'],property["location"]['longitude'],property['address']['oneLine']]);
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
                        const patt8 = /lot ([0-9]*).-.([0-9]*)/gi;
                        const patt9 = /lot([0-9]*).-.([0-9]*)/gi;
                        if (property['summary']['legal1']) {
                            var result = property['summary']['legal1'].match(pattern);
                            var result2 = property['summary']['legal1'].match(patt1);
                            var result3 = property['summary']['legal1'].match(patt2);
                            var result4 = property['summary']['legal1'].match(patt3);
                            var result5 = property['summary']['legal1'].match(patt4);
                            var result6 = property['summary']['legal1'].match(patt5);
                            var result7 = property['summary']['legal1'].match(patt6);
                            var result8 = property['summary']['legal1'].match(patt7);
                            var result9 = property['summary']['legal1'].match(patt8);
                            var result10 = property['summary']['legal1'].match(patt9);
                            if (result || result2 || result3 || result4 || result5 || result6 || result7 || result8|| result9 || result10) {
                                searchCount++;
                                $('#searchCount').text("Property count : "+searchCount);
                                $("#poiContent").show();
                                var text = '<div class="swiper-slide">'  +
                                    '<div class="box selectPOI">' +
                                    '<a class="h3" target="_blank" line1="'+property["address"]["line1"]+'" line2="'+property["address"]["line2"]+'" href="/getOwnerDetail/'+encodeURI(property["address"]["line1"])+'/' +encodeURI(property["address"]["line2"])+'">' + property['address']['oneLine'] + '</a>' +
                                    '<div class="float-right">'+
                                    '<input type="checkbox" name="selectedItem" aria-label="Checkbox for following text input">'+
                                    '<a target="_blank" href="/getpoidata/'+encodeURI(property["address"]["oneLine"])+'/' +encodeURI(property["address"]["postal1"])+'"style="padding: 5px;"><i class="fas fa-external-link-alt"></i></a>'+
                                    '</div>'+
                                    '<div class="restaurant-content">' +
                                    '<label>Legal Description</label>' +
                                    '<small>' + property['summary']['legal1'] + '</small></div></div></div>';
                                $(".swiper-wrapper").append(text);
                                location.push([property["location"]['latitude'],property["location"]['longitude'],property['address']['oneLine']]);
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
            f(location);
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


var homemarkers = [];
function f(locations) {
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 5,
        direction: 'vertical',
        slideToClickedSlide: false,
        on:{
            click: function(swiper, e){
               // var clicked = $(e.target);
                focusonmarker(this.clickedIndex);
                //console.log(clicked);
            },
        },
        navigation: {
            nextEl: '.prev-slide',
            prevEl: '.next-slide',
        }
    });
    var infowindow = new google.maps.InfoWindow();
    for (let i = 0; i < locations.length; i++)
    {
        var markers = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][0], locations[i][1]),
            animation: google.maps.Animation.DROP,
            map: map,
            icon: 'Img/icons/pin_b.png'
        });
        google.maps.event.addListener(markers, 'click', (function(markers, i) {
            return function() {
                infowindow.setContent(locations[i][2]);
                infowindow.open(map, markers);
                swiper.slideTo(markers.get("id"));
                swiper.updateSlidesClasses();
            }
        })(markers, i))
        markers.set("id",homemarkers.length)
        homemarkers.push(markers);
        focusonmarker(0);
    }


}
function focusonmarker(i) {
    setMapOnAll(null)
    homemarkers[i].setMap(map);
    google.maps.event.trigger(homemarkers[i], "click");
}
function setMapOnAll(map) {
    for (var i = 0; i < homemarkers.length; i++) {
        homemarkers[i].setMap(map);
    }
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

var marker;
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

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(lat, lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

     var i;
    //console.log(locations);

    marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        animation: google.maps.Animation.DROP,
        icon: 'Img/4.png'
    });


    gmarkers.push(marker);



    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            animation: google.maps.Animation.DROP,
            icon: 'Img/1.png'
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(locations[i][3]);
                infowindow.open(map, marker);
                for (var sm = 0; sm < gmarkers.length; sm++) {
                    if(sm!=0){
                        gmarkers[sm].setIcon("Img/1.png");
                    }
                }
                marker.setIcon("Img/2.png");
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
                cache:false,
                complete:function(){
                    getlist(lat,lng,isVacant)


                    fetch(buildUrl('/getHouseInventry',{lat : lat,lng:lng}), {
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
                            dountChart(data);
                            $("#houseDiv").show();
                            higherEdu(data);
                            $("#eduDiv").show();
                            incomeChart(data);
                            $("#incomeDiv").show();
                        })




                   /* $.ajax({
                        type:'get',
                        url:'/getHouseInventry',
                        data:{lat : lat,lng:lng},
                        cache:false,
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
                    });*/
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
    $("#noHS").html(Math.round((100*(communityData['EDULTGR9']/communityData['EDUTOTALPOP'])))+"%");
    $("#someHS").html(Math.round((100*(communityData['EDUSHSCH']/communityData['EDUTOTALPOP'])))+"%");
    $("#hsGrad").html(Math.round((100*(communityData['EDUHSCH']/communityData['EDUTOTALPOP'])))+"%");
    $("#someCollege").html(Math.round((100*(communityData['EDUSCOLL']/communityData['EDUTOTALPOP'])))+"%");
    $("#associate").html(Math.round((100*(communityData['EDUASSOC']/communityData['EDUTOTALPOP'])))+"%");
    $("#bachlor").html(Math.round((100*(communityData['EDUBACH']/communityData['EDUTOTALPOP'])))+"%");
    $("#graduate").html(Math.round((100*(communityData['EDUGRAD']/communityData['EDUTOTALPOP'])))+"%");

}


//donut Chart
function dountChart($communityData) {


    var mychart = AmCharts.makeChart( "chart-1", {
        "type": "pie",
        "theme": "light",
        "dataProvider": [ {
            "title": "Rented " + Math.round (100*($communityData['DWLRENT']/$communityData['DWLTOTAL'])),
            "value": Math.round (100*($communityData['DWLRENT']/$communityData['DWLTOTAL'])),
            "color":'#0051FF'
        }, {
            "title": "Owned "+Math.round (100*($communityData['DWLOWNED']/$communityData['DWLTOTAL'])),
            "value": Math.round (100*($communityData['DWLOWNED']/$communityData['DWLTOTAL'])),
            "color":'#43575f'
        }, {
            "title": "Vacant "+Math.round (100*($communityData['DWLVACNT']/$communityData['DWLTOTAL'])),
            "value": Math.round (100*($communityData['DWLVACNT']/$communityData['DWLTOTAL'])),
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



    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ["<10K", "10K-15K", "15K-20K", "20K-25K", "25K-30K", "30K-35K", "35K-40K", "40K-45K", "45K-50K", "50K-60K", "60K-75K", "75K-100K", "100K-125K", "125K-150K", "150K-200K", "200K-250K", "250K-500K", ">500K"],
            datasets: [{
                label: "",
                //backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(0, 81, 255)',
                data: [$communityData['HINCY00_10'],
                    $communityData['HINCY10_15'],
                    $communityData['HINCY15_20'],
                    $communityData['HINCY20_25'],
                    $communityData['HINCY25_30'],
                    $communityData['HINCY30_35'],
                    $communityData['HINCY35_40'],
                    $communityData['HINCY40_45'],
                    $communityData['HINCY45_50'],
                    $communityData['HINCY50_60'],
                    $communityData['HINCY60_75'],
                    $communityData['HINCY75_100'],
                    $communityData['HINCY100_125'],
                    $communityData['HINCY125_150'],
                    $communityData['HINCY150_200'],
                    $communityData['HINCY200_250'],
                    $communityData['HINCY250_500'],
                    $communityData['HINCYGT_500']],
            }]
        },

        // Configuration options go here
        options: {
            responsive: true,
            legend: {
                display:false
            },
            title: {
                display: false,
                text: 'Chart.js Line Chart'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{

                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Annual Income',
                        fontColor: 'black'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Households',
                        fontColor: 'black'
                    }
                }]
            }
        }
    });


    /*

          $communityData['HINCY00_10'],
           $communityData['HINCY10_15'],
          $communityData['HINCY15_20'],
          $communityData['HINCY20_25'],
           $communityData['HINCY25_30'],
          $communityData['HINCY30_35'],
          $communityData['HINCY35_40'],
          $communityData['HINCY40_45'],
          $communityData['HINCY45_50'],
           $communityData['HINCY50_60'],
          communityData['HINCY60_75'],
           $communityData['HINCY75_100'],
          $communityData['HINCY100_125'],
          $communityData['HINCY125_150'],
           $communityData['HINCY150_200'],
           $communityData['HINCY200_250'],
           $communityData['HINCY250_500'],
           $communityData['HINCYGT_500']


        });*/
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
var map;
function init() {
    var i;
    var tmp;
    var myOptions = {
        zoom: 13,
        center: new google.maps.LatLng(lat, lng)
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);

    marker;
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
    return map;
}

































//send Email

$("#sendEmail").click((e)=>{
    e.preventDefault();
    let i =0;
    let listArray = [];
    if($("#emailaddress").val() == "")
    {
        $("#emailHelp").text("Please Enter Email address")
        return "";
    }
    else {
        if (!$("#emailaddress")[0].checkValidity()) {
            $("#emailHelp").text("Please Enter Correct Email address")
            return "";

        } else {
            $("#emailHelp").text("")
        }
    }
    $('input[name="selectedItem"]:checked').each(function() {
        listArray.push([$(this).closest('.box').find('a').attr('line1'),$(this).closest('.box').find('a').attr('line2')]);
    });


    fetch("/sendMail", {
        method: "post", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        body: JSON.stringify({addressList:JSON.stringify(listArray),email:$("#emailaddress").val() }),
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
            if(data[0] == "send") {
                $.notify({
                    // options
                    icon: 'fas fa-check-circle',
                    message: 'Email Send Successfully'
                }, {
                    // settings
                    type: 'success'
                });
            }
            else
            {
                $.notify({
                    // options
                    icon: 'fa fa-exclamation-circle',
                    message: 'Not able to send Email'
                }, {
                    // settings
                    type: 'danger'
                });
            }
        })












    /*$.ajax({
        type:'post',
        url:'/sendMail',
        data:{addressList:JSON.stringify(listArray)},
        success:function(data){
            console.log(data);
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log("Please Wait to load all the data");
        },
        timeout: 5000
    });*/
})




















