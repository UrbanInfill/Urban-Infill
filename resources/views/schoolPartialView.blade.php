<div class="row">
    <div class="slider">
        <!-- Add Arrows -->
        <div class="swiper-button-next "><img src="Img/icons/right.png" alt="right"></div>
        <div class="swiper-button-prev"><img src="Img/icons/left.png" alt="left"></div>

        <div class="swiper-container col-xs-12 mt-30">
            <div class="swiper-wrapper">
                <!-- Slides Loop Start -->
                <?php
                if(!empty($final_array)) {
                $i=1;
                foreach($final_array as $publicSchool){
                if(@$publicSchool['InstitutionName'] !=''){ ?>
                <div class="swiper-slide">

                    <div data-school="<?php echo $publicSchool['OBInstID']; ?>" id="<?php echo $i; ?>" class="selectSchool box">
                        <h1 class="colorCode"><?php echo $publicSchool['InstitutionName']; ?></h1>
                        <div class="address">
                            <img class="greybg" src="Img/icons/pin.png" alt="pin">
                            <img class="whitebg" src="Img/icons/pin_b.png" alt="pin">
                            <div class="location">
                                <h3 class="colorCode">Address</h3>
                                <p class="colorCode"><?php echo $publicSchool['school_address']['locationaddress']; ?> <?php echo $publicSchool['school_address']['locationcity']; ?><?php echo $publicSchool['school_address']['stateabbrev']; ?>, <?php echo $publicSchool['school_address']['ZIP']; ?></p>
                            </div>
                        </div>
                        <table class="table table-responsive">
                            <tbody>
                            <tr>
                                <td class="info one" width="50%">
                                    <h3 class="colorCode">Public vs. Private</h3>
                                    <div class="row">

                                        <?php if($publicSchool['Filetypetext'] =='PUBLIC'){ ?>
                                        <div class="whitebg col-xs-12">
                                            <img src="Img/icons/institution_b2.png" alt="institution">
                                        </div>
                                        <div class="greybg col-xs-12">
                                            <img src="Img/icons/institution.png" alt="institution">
                                        </div>

                                        <?php }else {?>
                                        <div class="whitebg col-xs-12">
                                            <img src="Img/icons/private_b.png" alt="private">
                                        </div>
                                        <div class="greybg col-xs-12">
                                            <img src="Img/icons/private.png" alt="private">
                                        </div>
                                        <?php } ?>
                                    </div>
                                </td>
                                <td class="info two">
                                    <h3 class="colorCode">Distance from Property</h3>
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <img class="greybg" src="Img/icons/path.png" alt="path">
                                            <img class="whitebg" src="Img/icons/path_b.png" alt="path">
                                        </div>
                                        <div class="col-xs-6 distance">
                                            <span class="num"><?php echo $publicSchool['distance']; ?></span>
                                            <span class="unit">Miles</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="info three">
                                    <h3 class="colorCode">Grade Range</h3>
                                    <div class="grade">
                                        <span class="one"><?php echo str_replace(array("TH GRADE","ND GRADE","PRESCHOOL","KINDERGARTEN","3RD GRADE"),array("","","PS","K","3"),$publicSchool['gradelevel1lotext']); ?></span>
                                        <span class="range"></span>
                                        <span class="two"><?php echo str_replace(array("TH GRADE","ND GRADE","PRESCHOOL","KINDERGARTEN","3RD GRADE"),array("","","PS","K","3"),$publicSchool['gradelevel1hitext']); ?></span>
                                    </div>
                                </td>
                                <td class="info four">
                                    <h3 class="colorCode">School Rating</h3>
                                    <div class="rating">
                                        <span class="rating-img"><?php echo $publicSchool['GSTestRating']; ?></span> / 5
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            <?php $i++; ?>
            <?php } ?>
            <?php } ?>
            <?php } ?>
            <!-- Slides Loop End -->
            </div>
        </div>
    </div>
    <div class="col-md-4 col-xs-12 mt-30 schoolDetail activeted" id="detailViews">

    </div>
    <div class="col-md-8 col-xs-12 mt-30 map">
        <div id="map"></div>
    </div>


</div>

