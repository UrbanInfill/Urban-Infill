<!DOCTYPE html>
<html class="no-js" lang="">

	<head>
		<!-- All meta tags define below -->
		<meta charset="utf-8">
		<meta name="keywords" content="Point of Interest" >
		<meta name="description" content="Display all point of interests based on property search">
		<meta name="author" content="Kevin">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
		
		<!-- Title of the page -->
		<title>Point of Interest</title>
		
		<link rel="apple-touch-icon" href="apple-touch-icon.png">
		<link rel="shortcut icon" href="/Img/favicon.ico" type="image/x-icon">
		
		<!-- CDN call for CSS Start-->
		<link href="https://fonts.googleapis.com/css?family=Poppins:300,400,600,700|Roboto:300,400" rel="stylesheet">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.6/css/swiper.min.css" />
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
		<!-- CDN call for CSS end -->
		

		<!-- css/main.css -->
		<link rel="stylesheet" href="/css/poimain.css">
		<!-- endbuild -->
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<!-- CDN call for JS Start-->	
		<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.6/js/swiper.min.js"></script>
		
		
	</head>
	<!-- This div is used for display page loader untill full page is load -->


	<body id="innerCont" class="home">
		
		<!-- Display loader image whe page will start loading start-->
		<div  class="ajax-loader">
		  <img src="/img/35.gif" class="img-responsive" />
		</div>	
		<!-- Display loader image when page will start loading end-->

		<nav class="navbar navbar-inverse">


			<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				<ul class="nav navbar-nav">
					<li class="nav-item">
						<a class="navbar-brand" href="/">Historically Platted Lots</a>
					</li>
					<li>
						<a class="nav-link" href="/VacantProperties">Vacant Lots</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/location">Address Search </a>
					</li>
				</ul>
			</div>
		</nav>

    <div   id="header">
        <span>
            Points of Interest
        </span>
    </div>
    <!-- /.header -->

    <!-- body -->
    <div  id="body">
        <div class="container">
            <div class="row">
				<div class="col-md-8 col-xs-12 mt-30">
					<?php  if(count($splitAmenityData) == 1){?>
						<div class="box selecting-area noBorder">
					<?php }else{ ?>
						<div class="box selecting-area">
					<?php } ?>	
					
						<?php foreach($splitAmenityData as $amenityVal) {
								if(count($splitAmenityData) == 1){ 
						?>	
								<div class="col-md-12 col-xs-12">
							<?php }else{ ?>
								<div class="col-md-6 col-xs-12">
							<?php } ?>
							<?php foreach($amenityVal as $k=>$v){ ?>	
									<div class="form-group">
										<input type="checkbox" id="<?php echo strtolower($k); ?>" name="checkBuisnessCat" value="<?php echo strtolower($k); ?>"/>
										<label for="<?php echo strtolower($k); ?>" class="businessCatAction"><span><img src="/Img/icons/<?php echo strtolower($k); ?>.png" /></span><?php echo $k; ?> (<?php echo count($v); ?>)</label>
									</div>
							<?php } ?>
							</div>
						<?php } ?>
						
						<div class="col-xs-12 col-md-12 extra-area">
							<!--<div class="col-xs-12 col-md-6 text-center">
								<img src="Img/icons/ball.png" alt="" /> <label>Show nearest major <br />sport team</label>
							</div>
							<div class="col-xs-12 col-md-6 text-center">
								<img src="Img/icons/flight.png" alt="" /> <label>Show nearest major <br />airport</label>
							</div>-->
							<div class="col-xs-12 col-md-6" style="padding-left:25px">
								<label>Closest Major Sports Team : <?php echo $nearestSport; ?></label>
							</div>
							<div class="col-xs-12 col-md-6" style="padding-left:40px">
								<label>Nearest Airport : <?php echo $nearestAirport; ?></label>
							</div>
						</div>
					</div>

					<div class="col-xs-12 mt-30 map" id="map">
                    
					</div>
				</div>
				<!-- Swiper -->
				<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCPAVKxutIiPNXJr8UeB2wwSrzrFA3-GuI&libraries=places&callback=initAutocomplete"></script>
				<div class="col-md-4 col-xs-12 col-xs-12 mt-30" id="poiContent">

					@include("poi-content",['splitAmenityData'=>$splitAmenityData,'sourceLocationLatitude' =>$sourceLocationLatitude,'sourceLocationLongitude'=> $sourceLocationLongitude ,'distanceSortedArr'=>$distanceSortedArr ,'distanceSortedCatonlyArr'=>$distanceSortedCatonlyArr ,'nearestSport'=>$nearestSport ,'nearestAirport'=>$nearestAirport ,'communityData'=>$communityData ,])
				</div>
    </div>
			
			
		
			<!-- /.body -->
		
		
	</body>
</html>
