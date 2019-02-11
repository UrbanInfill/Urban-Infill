@extends('master')
@section('title','MyPage Title')
@section('head')
    <link rel="stylesheet" href="css/school.css">
    @endsection
@section('content')

    <div class="container pt-3 ">
        <div class="row">
            <div class="col-md-7 col-xs-12 col-md-offset-3">
                <div class="input-group mb-3 search search-reduce" id="searchByPropForm">
                    <input class="form-control searchfield" id="searchAddress" name="address" type="text" placeholder="By Property"  onFocus="geolocate()" required="true" value="" aria-describedby="searchByAddress"/>
                    <div class="input-group-append">
                        <input class="btn btn-primary" type="button" value="Search" id="searchByAddress">
                    </div>
                </div>
            </div>


            <div class="col-md-8 col-xs-12 mt-30 ">
                <h3>Legel Address</h3>
                <p class="lead" id="LegalAddress">

                </p>
            </div>



        </div>

    </div>
    <div class="row">
        <div class="col-10"id="view">

        </div>
    </div>

@endsection


@section('script')
    <script>

    </script>
@endsection