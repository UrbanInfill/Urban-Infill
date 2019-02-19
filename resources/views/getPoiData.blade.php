<?php 
require_once("lib/config.php");
require_once("lib/api.php");

//Implement api call logic once we get address from google location


	//SET configuration URL
	$config['api_url']= API_URL;
	$config['api_key']= API_KEY;
	if($config["api_key"]=="" || $config["api_key"]=="COPY_YOUR_API_KEY_HERE"){
		die("Please paste your API KEY in config.php which is located under library folder.");
	}
	$poiObj = new model($config); //Create class object of library file
	
	$address = '4529 Winona Court Denver, CO, United States 80212';
	$radius = '5';
	$addressPosted = isset($_REQUEST['address'])?urlencode($_REQUEST['address']):urlencode($address);
	$radiusPosted = isset($_REQUEST['radius'])?$_REQUEST['radius']:$radius;

	$businessCat = isset($_REQUEST['businessCat'])?$_REQUEST['businessCat']:'';
	
	if(!empty($addressPosted) ){

		$explodeAddress = explode(' ',urldecode($addressPosted));
		$zipCode = array_pop($explodeAddress);
		$firstPartAddr = implode(' ',$explodeAddress);
		
		$poiAddr = $firstPartAddr.'; '.$zipCode;
		
		//GET LATITUDE LONGITUDE FROM SELECTED ZIP CODE
		$url = "https://maps.google.com/maps/api/geocode/json?address=".$addressPosted."&sensor=false"; 
					
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_PROXYPORT, 3128);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		$response = curl_exec($ch);
		curl_close($ch);
		$response_a = json_decode($response);
		
		if(@$response_a->status=='ZERO_RESULTS'){
			//SET LAT LONG AS PER IP ADDRESS
			$sourceLocationLatitude = '40.330837';
			$sourceLocationLongitude = '-79.960191';
		}else{
			@$sourceLocationLatitude = $response_a->results[0]->geometry->location->lat;
			@$sourceLocationLongitude = $response_a->results[0]->geometry->location->lng;
		}
		
		
		$amenitiesData = array();
		$uniqueBusinessCat = array();	
		$poiData = $poiObj->getPoiData(urlencode($poiAddr),$radiusPosted);
		$communityData = $poiObj->getCommunityByAreaId1('ZI'.$zipCode);
		$nearestSport = $communityData[0]->TEAM;
		$nearestAirport = $communityData[0]->AIRPORT;
		
		$distanceSortedArr = array();
		$distanceSortedCatonlyArr = array();
		
		if (@$poiData['response']['status']['code'] == 0) {
				//$mapAmenities = $poiData['response']['result']['package']['item'];
			
				$sourceLocationLatitude = $poiData['response']['result']['package']['item'][0]['geo_latitude'];
				$sourceLocationLongitude = $poiData['response']['result']['package']['item'][0]['geo_longitude'];
				foreach($poiData['response']['result']['package']['item'] as $amenities){
					if($businessCat!='' && is_array($businessCat)){
						if(in_array(strtolower($amenities['business_category']),$businessCat)){
							$distanceSortedArr[$amenities['distance']][] = $amenities;
							$distanceSortedCatonlyArr[$amenities['distance']][] = strtolower(str_replace(array(" - "," "),array('-','-'),$amenities['business_category']));
							$amenitiesData[ucwords(strtolower($amenities['business_category']))][] = $amenities;
						}
					}else{
						$distanceSortedArr[$amenities['distance']][] = $amenities;
						$amenitiesData[ucwords(strtolower($amenities['business_category']))][] = $amenities;
						$distanceSortedCatonlyArr[$amenities['distance']][] = strtolower(str_replace(array(" - "," "),array('-','-'),$amenities['business_category']));
					}
				}
				
				ksort($amenitiesData);
				ksort($distanceSortedArr);
				ksort($distanceSortedCatonlyArr);
				
				
				//echo '<pre>';print_r($distanceSortedArr);
				//echo '<pre>';print_r($distanceSortedCatonlyArr);die;
				
				$divideBy = round(count($amenitiesData)/2);
				$splitAmenityData = array_chunk($amenitiesData,$divideBy,true);
			}
	}	

?>
