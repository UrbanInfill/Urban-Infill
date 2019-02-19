
<div class="swiper-container">
	<div class="swiper-wrapper">
		<?php $initCounter = 1; 
			foreach($distanceSortedArr as $distanceSortedArr1){
				foreach($distanceSortedArr1 as $distanceSorted){
		?>		
					<div class="swiper-slide">
						<div class="box selectPOI"  id="<?php echo $initCounter; ?>" >
							<h1><?php echo $distanceSorted['name']; ?></h1>
							<small><?php echo $distanceSorted['industry']; ?></small>
							<div class="restaurant-content">
								<label>Phone</label>
								<?php echo $distanceSorted['phone']; ?>	
							</div>
							<div class="restaurant-content">
								<label>Address</label>
								<?php echo $distanceSorted['street'].', '.$distanceSorted['city'].', '.$distanceSorted['state'].', '.$distanceSorted['zip_code']; ?>
							</div>
							<div class="restaurant-content">
								<label>Distance from property</label>
								<?php echo $distanceSorted['distance']; ?>	 Miles
							</div>
						</div>
					</div>	
				<?php $initCounter = $initCounter+1; 
					}
				}												
				?>
	</div>
	<!-- Add Arrows -->
</div>
<!--<div class="swiper-button-next"><img src="images/icons/right.png" alt="right"></div>
<div class="swiper-button-prev"><img src="images/icons/left.png" alt="left"></div>-->
<div class="next-slide"><i class="fa fa-arrow-circle-up" aria-hidden="true"></i></div>
<div class="prev-slide"><i class="fa fa-arrow-circle-down" aria-hidden="true"></i></div>

 <script>
	/*var swiper = new Swiper('.swiper-container', { 
			direction: 'vertical',
			loop: true,
			slidesPerView: 3,
			pagination: {
				clickable: true,
			},
			navigation: {
				nextEl: '.prev-slide',
				prevEl: '.next-slide',
			}
		  // Responsive breakpoints
		 
		});*/
		
	var swiper = new Swiper('.swiper-container', {
      slidesPerView: 3,
	  direction: 'vertical',
      slideToClickedSlide: true,
	  on:{
		click: function(){	
		  openInfoModal(this.clickedIndex+1);
		},
	  },
      navigation: {
				nextEl: '.prev-slide',
				prevEl: '.next-slide',
			}
    });	
 var gmarkers = [];
      function initMap() {
          var locations = [
							<?php 
								if(count($distanceSortedArr)>0){ 
									$ps = 1;
									foreach($distanceSortedArr as $distanceSortedArr1){
										foreach($distanceSortedArr1 as $distanceSorted){
											if($distanceSorted['geo_latitude'] !=''){
							?>					
												['', <?php echo $distanceSorted['geo_latitude']; ?>, <?php echo $distanceSorted['geo_longitude']; ?>, <?php echo $ps; ?>,'<div id="iw-container"><div class="iw-title"><?php //echo addslashes($distanceSorted['name']); ?></div><div class="iw-content"><p><?php echo $distanceSorted['street']; ?> <?php echo $distanceSorted['city']; ?> <?php echo $distanceSorted['state']; ?>, <?php echo $distanceSorted['zip_code']; ?></p><p class="distance"><?php echo $distanceSorted['distance']; ?> Miles<br></div></div>'],
							<?php				$ps = $ps + 1; 
											}	
										}		
									}
								} 
							?>
						];

			var map = new google.maps.Map(document.getElementById('map'), {
			  zoom: 16,
			  center: new google.maps.LatLng('<?php echo $sourceLocationLatitude; ?>', '<?php echo $sourceLocationLongitude; ?>'),
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			});

			var infowindow = new google.maps.InfoWindow();

			var marker, i;
			//console.log(locations);
			
			 marker = new google.maps.Marker({
				position: new google.maps.LatLng('<?php echo $sourceLocationLatitude; ?>', '<?php echo $sourceLocationLongitude; ?>'),
				map: map,
				animation: google.maps.Animation.DROP,
				icon: '/Img/4.png'
			  });
				
				
			gmarkers.push(marker);
			
			var catLocations = [];
			
			<?php 
				if(count($distanceSortedCatonlyArr)>0){ 
					$ps1 = 1;
					foreach($distanceSortedCatonlyArr as $distanceSortedArr11){
						foreach($distanceSortedArr11 as $distanceSorted1){
							if($distanceSorted1!=''){
			?>					
								catLocations.push('<?php echo $distanceSorted1; ?>');
			<?php				$ps1 = $ps1 + 1; 
							}	
						}		
					}
				} 
			?>
			
			console.log(catLocations);
			for (i = 0; i < locations.length; i++) { 
			if(i<3){
			  marker = new google.maps.Marker({
				position: new google.maps.LatLng(locations[i][1], locations[i][2]),
				map: map,
				animation: google.maps.Animation.DROP,
				icon: '/Img/'+catLocations[i]+'/1.png'
			  });
			}else{
				marker = new google.maps.Marker({
				position: new google.maps.LatLng(locations[i][1], locations[i][2]),
				map: map,
				animation: google.maps.Animation.DROP,
				icon: '/Img/'+catLocations[i]+'/3.png'
			  });
			}
				
			  google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
					infowindow.setContent(locations[i][4]); 
					infowindow.open(map, marker);
					
					swiper.slideTo(i);
					swiper.updateSlidesClasses();
					console.log(gmarkers);
					for (var sm = 1; sm < gmarkers.length; sm++) {
						if(sm<4){
							gmarkers[sm].setIcon("/Img/"+catLocations[sm-1]+"/1.png");
						}else{
							gmarkers[sm].setIcon("/Img/"+catLocations[sm-1]+"/3.png");
						}
						
					}
					marker.setIcon("/Img/"+catLocations[i]+"/2.png");
				}
			  })(marker, i)); 
			  gmarkers.push(marker);
			}
			setTimeout(function(){ openInfoModal(1); },100);
				

      }
	
	function openInfoModal(i) {
	  google.maps.event.trigger(gmarkers[i], "click");
	}	
   
	initMap();
</script>
<style>
.next-slide{
	width: 2%;
	margin: 0;
	padding: 0;
	position: absolute;
	right: 0;
	top: 0;
	cursor:pointer;
}
.prev-slide{
		width: 2%;
		margin: 0;
		padding: 0;
		right: 0;
		position: absolute;
		top: 25px;
		cursor:pointer;
}
</style>