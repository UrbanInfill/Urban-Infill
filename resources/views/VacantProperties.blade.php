@extends('master')
@section('title','MyPage Title')
@section('content')
    <div class="pt-3">
        <div class="row">
            <div class="col-md-9 col-xs-12 col-md-offset-3">
                <div class="input-group mb-3 search search-reduce" id="searchByPropForm">
                    <input class="form-control" id="search" name="address" type="text" placeholder="By Property"  onFocus="geolocate()" required="true" value="" aria-describedby="searchByProperty"/>
                    <div class="input-group-append">
                        <input class="btn btn-primary" type="button" value="Search" id="searchByPropertyVacant">
                    </div>
                </div>
                <div class=" map" id="map"></div>
                <div class="row">
                    <div class="col-md-6 pd-col brd" id="houseDiv">
                        <h2 class="ageDemo mt-30">Housing Inventory</h2>
                        <div class="chart_bar" style="position: relative; margin:0 auto;width:80%; height:150px;" >
                            <div id="chart-1" ></div>
                        </div>
                    </div>

                    <div class="col-md-6 brd" id="eduDiv">

                        <img src="images/icon-stat.png" alt="">
                        <h2 class="ageDemo mt-30">Highest education<br>level attained</h2>
                        <h3>Info</h3>
                        <p>The highest education level attained is based on the percentage of eligible graduates within the given population who have achieved the level of education listed.</p>
                        <div class="gap20"></div>

                        <div class="list-row">
                            <span class="list-title">No HS</span>
                            <span class="list-price" id="noHS">  </span>
                        </div>
                        <div class="list-row">
                            <span class="list-title">Some HS</span>
                            <span class="list-price" id="someHS"></span>
                        </div>
                        <div class="list-row">
                            <span class="list-title">HS Grad</span>
                            <span class="list-price" id="hsGrad"></span>
                        </div>
                        <div class="list-row">
                            <span class="list-title">Some College</span>
                            <span class="list-price" id="someCollege"></span>
                        </div>
                        <div class="list-row">
                            <span class="list-title">Associate Degree</span>
                            <span class="list-price" id="associate"></span>
                        </div>
                        <div class="list-row">
                            <span class="list-title">Bachelor's Degreee</span>
                            <span class="list-price" id="bachlor"></span>
                        </div>
                        <div class="list-row">
                            <span class="list-title">Graduate Degreee</span>
                            <span class="list-price" id="graduate"></span>
                        </div>


                    </div>
                </div>
                <div class="col-md-12 brd" id="incomeDiv">
                    <h2 class="ageDemo mt-30">Income by Households</h2>
                    <div class="chart_bar" style="position: relative;height:150px;" >
                        <div id="chartincomediv"> </div>
                    </div>
                </div>
            </div>


            <div class="col-md-3 col-xs-12 col-xs-12 mt-30" id="poiContent">
                <div class="swiper-container">
                    <div class="swiper-wrapper">


                    </div>
                    <!-- Add Arrows -->
                    <!-- Add Pagination -->
                </div>
                <!--<div class="swiper-button-next"><img src="images/icons/right.png" alt="right"></div>
                <div class="swiper-button-prev"><img src="images/icons/left.png" alt="left"></div>-->
                <div class="next-slide"><i class="fa fa-arrow-circle-up" aria-hidden="true"></i></div>
                <div class="prev-slide"><i class="fa fa-arrow-circle-down" aria-hidden="true"></i></div>




            </div>
        </div>
    </div>

@endsection
@section('script')

    <!-- Resources -->
    <script src="https://www.amcharts.com/lib/3/amcharts.js"></script>
    <script src="https://www.amcharts.com/lib/3/pie.js"></script>
    <script src="https://www.amcharts.com/lib/3/xy.js"></script>
    <script src="https://www.amcharts.com/lib/3/plugins/export/export.min.js"></script>
    <link rel="stylesheet" href="https://www.amcharts.com/lib/3/plugins/export/export.css" type="text/css" media="all" />
    <script src="https://www.amcharts.com/lib/3/themes/light.js"></script>

    <script type='text/javascript' src="js/donut-chart.js"></script>
    <script>


    </script>

    <style>
        #chartincomediv {
            width: 100%;
            height: 300px;
        }
        #chart-1 {
            width		: 100%;
            height		: 150px;
            font-size	: 12px;
        }
        #chart-1 a {
            display: none !important;
        }
        .next-slide{
            margin: 0;
            padding: 0;
            position: absolute;
            right: 0;
            top: 0;
            cursor:pointer;
        }
        .prev-slide{
            margin: 0;
            padding: 0;
            right: 0;
            position: absolute;
            top: 25px;
            cursor:pointer;
        }
    </style>
@endsection