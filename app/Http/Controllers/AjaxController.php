<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use vendor\project\StatusTest;

class AjaxController extends Controller
{
    private $obapiurl = 'http://search.onboard-apis.com', $obapikey = '60dca8df1d5318fe0c262baf013f185e';


    public function getzipResponse(Request $request)
    {
        $address = $request->input('address');
        $location = $request->input('location');
        $zip= $request->input('zip');
        $AreaHierarchy = $this->getAreaHierarchy($location[0],$location[1]);
        $geoARRAY = array();
        $geoValName = array();
        foreach ($AreaHierarchy['response']['result']['package']['item'] as $key => $area) {
            $geoARRAY[]  = $area['geo_key'];
            $geoValName[$area['geo_key']] = $area['name'];
        }
        $boundary = $this->getAreaBoundary($geoARRAY[0]);
        return response($boundary['response']['result']['package']['item'][0]['boundary']);
    }
    public function ExtendedDetail($line1, $line2)
    {
        $result = $this->getallevent(urlencode($line1), urlencode($line2));
        $AVMResult = $this->getdetailmortgageowner(urlencode($line1), urlencode($line2));
        $psArray=array();
        foreach ($AVMResult["property"] as $key=>$data)
        {
            $AssessmentHistory = $this->getAssessmentHistory($data["identifier"]["obPropId"]);
            if($AssessmentHistory["property"] == null)
            {

            }
            else
            $psArray[$data["identifier"]["obPropId"]] = $AssessmentHistory["property"][0]["assessmenthistory"];
        }
        return view('DetailPage')->with('result',$result)->with("AVMResult",$AVMResult)->with("Assessment",$psArray);
    }

    public function allpropertiesList(Request $request)
    {
        $lat = $request->input('lat');
        $lng = $request->input('lng');
        $page = $request->input('page');
        $zip = $request->input('zip');
        $zip = urlencode($zip);
        $pagesize = 1000;
        $url = $this->obapiurl . '/propertyapi/v1.0.0/property/detail?latitude=' . $lat . '&longitude=' . $lng . '&page=' . $page . '&pagesize=' . $pagesize .'&debug=True';
        //$url = $this->obapiurl . '/propertyapi/v1.0.0/property/detail?postalcode=' . $zip . '&page=' . $page . '&pagesize=' . $pagesize;
        $result = $this->curlPOIAPI($url);
        echo json_encode(($result));
    }
    public function getHouseInventry(Request $request){
        $lat = $request->input('lat');
        $lng = $request->input('lng');
        $AreaHierarchy = $this->getAreaHierarchy($lat,$lng);
        $geoARRAY = array();
        $geoValName = array();
        foreach ($AreaHierarchy['response']['result']['package']['item'] as $key => $area) {
            $geoARRAY[]  = $area['geo_key'];
            $geoValName[$area['geo_key']] = $area['name'];
        }
        $communityData = $this->getCommunityByAreaId1($geoARRAY[0]);
        return response($communityData);
    }
    public function getCommunityByAreaId1($areaid)
    {
        $url = $this->obapiurl . "/communityapi/v2.0.0/area/full?AreaId=".$areaid;

        $result_community1 = $this->curlPOIAPI($url);

        $communityData = array();

        if(count(@$result_community1['response']['result']['package']['item'])>0){
            foreach($result_community1['response']['result']['package']['item'][0] as $resultCommKey=>$resultCommVal){
                $communityData[strtoupper($resultCommKey)] = $resultCommVal;
            }
        }

        //$communityData1[0] = $communityData;

        //$communityDataFinal = json_decode (json_encode ($communityData1), FALSE);

        return $communityData;
    }
    public function getTotalPages(Request $request)
    {
        $lat = $request->input('lat');
        $lng = $request->input('lng');
        $pagesize = 1;
        $page = 1;
        $url = $this->obapiurl . '/propertyapi/v1.0.0/property/address?latitude=' . $lat . '&longitude=' . $lng . '&page=' . $page . '&pagesize=' . $pagesize.'&debug=True';
        $result = $this->curlPOIAPI($url);
        $total = $result['status']['total'];
        $totalPages = $total / 1000;
        return response($totalPages);
    }
    public function getPropertyResponse(Request $request)
    {

        $address = $request->input('address');
        $propertyInfo = $this->getPropertyDetail($address);
        $final_array = $this->getSchoolDemographicData($propertyInfo["property"][0]["location"]["latitude"],$propertyInfo["property"][0]["location"]["longitude"],$propertyInfo["property"][0]["address"]["line1"],$propertyInfo["property"][0]["address"]["line2"]);

        //$context = array("legaladdress" => $propertyInfo["property"][0]["summary"]["legal1"], "view" => view('schoolPartialView')->with("$final_array",$final_array));
        $psArray=array();
        $psArray["legaladdress"] =$propertyInfo["property"][0]["summary"]["legal1"];
        $psArray["view"] = (String) view('schoolPartialView')->with("final_array",$final_array);
        $psArray["final_array"] = $final_array;
        $detailView = array();
        foreach($final_array as $k=>$schoolDetailData) {

            $detailView[$k] = (String) view('schooldetailPartialView')->with("schoolDetailData",$schoolDetailData["school_detail"]);
        }
        $psArray["lat"] = $propertyInfo["property"][0]["location"]["latitude"];
        $psArray["lng"] = $propertyInfo["property"][0]["location"]["longitude"];
        $psArray["detailViews"] = $detailView;
        return $psArray;

    }
    public function school()
    {
        $context = array("title" => "My New Post", "body" => "This is my first post!");
        return view('schoolPartialView')->with("data",$context);
    }
    private function getSchoolDemographicData($lat,$lng,$line1,$line2)
    {
        $allPrivateSchools = $this->getSchoolSamplePrivateCode($lat,$lng);
        $psArray=array();
        if ($allPrivateSchools['status']['code'] == 0) {

            foreach($allPrivateSchools['school'] as $pvt_s=>$private_school){
                $psArray[$pvt_s]['OBInstID'] = $private_school['Identifier']['OBInstID'];
                $psArray[$pvt_s]['InstitutionName'] = $private_school['School']['InstitutionName'];
                $psArray[$pvt_s]['GSTestRating'] = $private_school['School']['GSTestRating'];
                $psArray[$pvt_s]['gradelevel1lotext'] = $private_school['School']['gradelevel1lotext'];
                $psArray[$pvt_s]['gradelevel1hitext'] = $private_school['School']['gradelevel1hitext'];
                $psArray[$pvt_s]['Filetypetext'] = $private_school['School']['Filetypetext'];
                $psArray[$pvt_s]['geocodinglatitude'] = $private_school['School']['geocodinglatitude'];
                $psArray[$pvt_s]['geocodinglongitude'] = $private_school['School']['geocodinglongitude'];
                $psArray[$pvt_s]['distance'] = $private_school['School']['distance'];
            }
        }
        $allPublicSchools = $this->getSchoolSampleCode(urlencode($line1),urlencode($line2));
        if ($allPublicSchools['status']['code'] == 0) {
            if(!empty($allPublicSchools['property'][0]["school"])){

                if(!empty($psArray)){

                    $final_array = array_merge($allPublicSchools['property'][0]["school"],$psArray);
                }else{
                    $final_array = $allPublicSchools['property'][0]["school"];
                }
                $index = 0;
                foreach($final_array as $k=>$schoolVal){
                    if(!isset($schoolVal['OBInstID'])){
                        continue;
                    }
                    $schoolDetails = $this->getPublicSchoolAddressById($schoolVal['OBInstID']);
                    if ($schoolDetails['status']['code'] == 0) {
                        $final_array[$k]['school_address']['locationaddress'] =  $schoolDetails['school'][0]['SchoolProfileAndDistrictInfo']['SchoolLocation']['locationaddress'];
                        $final_array[$k]['school_address']['locationcity'] =  $schoolDetails['school'][0]['SchoolProfileAndDistrictInfo']['SchoolLocation']['locationcity'];
                        $final_array[$k]['school_address']['stateabbrev'] =  $schoolDetails['school'][0]['SchoolProfileAndDistrictInfo']['SchoolLocation']['stateabbrev'];
                        $final_array[$k]['school_address']['ZIP'] =  $schoolDetails['school'][0]['SchoolProfileAndDistrictInfo']['SchoolLocation']['ZIP'];
                        $final_array[$k]["school_detail"] = $this->getSchoolDetail($schoolDetails);
                    }else{
                        $final_array[$k]['school_address']['locationaddress'] = '';
                        $final_array[$k]['school_address']['locationcity'] = '';
                        $final_array[$k]['school_address']['stateabbrev'] = '';
                        $final_array[$k]['school_address']['ZIP'] = '';
                    }


                }
            }
        }
        return $final_array;
    }
    private function getSchoolDetail($schoolDetails)
    {
        $schoolDetailData = array();
        if ($schoolDetails['status']['code'] == 0) {

            //Setting up the variable in pre-set array
            $SchoolProfileAndDistrictInfo = $schoolDetails['school'][0]['SchoolProfileAndDistrictInfo'];

            //School Name
            $schoolDetailData['school']['institutionname'] = $SchoolProfileAndDistrictInfo['SchoolSummary']['institutionname'];

            //Address
            $schoolDetailData['address']['locationaddress'] = $SchoolProfileAndDistrictInfo['SchoolLocation']['locationaddress'];
            $schoolDetailData['address']['locationcity'] = $SchoolProfileAndDistrictInfo['SchoolLocation']['locationcity'];
            $schoolDetailData['address']['stateabbrev'] = $SchoolProfileAndDistrictInfo['SchoolLocation']['stateabbrev'];
            $schoolDetailData['address']['ZIP'] = $SchoolProfileAndDistrictInfo['SchoolLocation']['ZIP'];

            //Contact
            $schoolDetailData['contact']['phone'] = $SchoolProfileAndDistrictInfo['SchoolContact']['phone'];

            //Website
            $schoolDetailData['website']['Websiteurl'] = $SchoolProfileAndDistrictInfo['SchoolContact']['Websiteurl'];

            //Technologymeasuretype
            $schoolDetailData['technology']['Technologymeasuretype'] = $SchoolProfileAndDistrictInfo['SchoolTech']['Technologymeasuretype'];

            //Special Eduction
            $schoolDetailData['eucation']['specialeducation'] = $SchoolProfileAndDistrictInfo['SchoolDetail']['specialeducation'];

            //No of Student
            $schoolDetailData['enrollment']['Studentsnumberof'] = $SchoolProfileAndDistrictInfo['SchoolEnrollment']['Studentsnumberof'];
            $schoolDetailData['enrollment']['Studentteacher'] = $SchoolProfileAndDistrictInfo['SchoolEnrollment']['Studentteacher'];

            //dates
            $schoolDetailData['dates']['startDate'] = $SchoolProfileAndDistrictInfo['DistrictSummary']['startDate'];
            $schoolDetailData['dates']['endDate'] = $SchoolProfileAndDistrictInfo['DistrictSummary']['endDate'];

            //Principle Name
            $schoolDetailData['principle']['Fullname'] = $SchoolProfileAndDistrictInfo['DistrictContact']['Prefixliteral'] . " " . $SchoolProfileAndDistrictInfo['DistrictContact']['Firstname'] . " " . $SchoolProfileAndDistrictInfo['DistrictContact']['Lastname'];
        }
        return $schoolDetailData;
    }

    private function getPropertyDetail($address){
        $address = urlencode($address);
        $url = $this->obapiurl . '/propertyapi/v1.0.0/property/detail?address='.$address.'&debug=True';
        return $this->curlPOIAPI($url);
    }
    private function getPropertyExtendDetail($line1,$line2){
        $url = $this->obapiurl . '/propertyapi/v1.0.0/property/expandedprofile?address1='.$line1.'&address2='.$line2.'&debug=True';
        return $this->curlPOIAPI($url);
    }
    private function getAssessmentHistory($id){
        $url = $this->obapiurl . '/propertyapi/v1.0.0/assessmenthistory/detail?id='.$id.'&debug=True';
        return $this->curlPOIAPI($url);
    }
    private function getdetailmortgageowner($line1,$line2){
        $url = $this->obapiurl . '/propertyapi/v1.0.0/property/detailmortgageowner?address1='.$line1.'&address2='.$line2.'&debug=True';
        return $this->curlPOIAPI($url);
    }
    private function getallevent($line1,$line2){
        $url = $this->obapiurl . '/propertyapi/v1.0.0/allevents/detail?address1='.$line1.'&address2='.$line2.'&debug=True';
        return $this->curlPOIAPI($url);
    }
    private function getAreaHierarchy($lat,$long){
        $location = urlencode($long.','.$lat);
        $url = $this->obapiurl . "/areaapi/v2.0.0/hierarchy/lookup?WKTString=POINT(" . $location. ")&geoType=ZI&debug=True";
        return $this->curlPOIAPI($url);
    }

    private function getAreaBoundary($areaid){
        $url = $this->obapiurl .'/areaapi/v2.0.0/boundary/detail?AreaId='.$areaid.'&debug=True';
        return $this->curlPOIAPI($url);
    }
    private function getPublicSchoolAddressById($schoolID){

        $url = $this->obapiurl .'/propertyapi/v1.0.0/school/detail?id='.$schoolID.'&debug=True';
        return $this->curlPOIAPI($url);
    }

    private function getSchoolSampleCode($add1=null,$add2=null){
        $url = $this->obapiurl .'/propertyapi/v1.0.0/property/detailwithschools?address1='.$add1.'&address2='.$add2.'&debug=True';
        return $this->curlPOIAPI($url);
    }

    private function getSchoolSamplePrivateCode($lat,$long){
        $url = $this->obapiurl ."/propertyapi/v1.0.0/school/snapshot?latitude=$lat&longitude=$long&radius=10&filetypetext=private&debug=True";
        return $this->curlPOIAPI($url);
    }
    private function curlPOIAPI($url, $apiKey = null){

        $curl = curl_init(); //cURL initialization

        //Set cURL array with require params
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 1000,
            CURLOPT_TCP_KEEPALIVE => 50,
            CURLOPT_TCP_KEEPIDLE => 100,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "accept: application/json",
                "apikey: " . ($apiKey!=''?$apiKey:$this->obapikey)

            )
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        //echo "<pre>"; print_r($err); die;
        curl_close($curl);

        if ($err) {
            return '{"status": { "code": 999, "msg": "cURL Error #:"'. $err.'"}}';
        }else{
            return json_decode($response, true);
        }
    }
}
