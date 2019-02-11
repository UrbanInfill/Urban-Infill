<div class="active box">
    <h1 class="white">{{$schoolDetailData['school']['institutionname']}}.</h1>
    <div class="address">
        <img src="Img/icons/pointer.png" alt="pointer">
        <div class="location">
            <h3 class="white">Contact</h3>
            <p class="white">{{$schoolDetailData['contact']['phone']}} / {{$schoolDetailData['website']['Websiteurl']}}.'</p>
        </div>
    </div>
    <table class="table table-responsive">
        <tbody>
        <tr>
            <td class="info one" width="50%">
                <img src="Img/icons/robot.png" alt="robot">
                <div class="right">
                    <h3 class="white">Technology<br>{{$schoolDetailData['technology']['Technologymeasuretype']}}</h3>
                    <img src="Img/icons/bars.png" alt="bars">
                </div>
            </td>
            <td class="info two">
                <img src="Img/icons/puzzle.png" alt="puzzle">
                <div class="right">
                    <h3 class="white">Special<br>Education</h3>
                    <span class="data">'{{$schoolDetailData['eucation']['specialeducation']}}</span>
                </div>
            </td>
        </tr>
        <tr>
            <td class="info one">
                <img src="Img/icons/students.png" alt="students">
                <div class="right">
                    <h3 class="white">Number of<br>Students Enrolled</h3>
                    <span class="data">{{$schoolDetailData['enrollment']['Studentsnumberof']}}</span>
                </div>
            </td>
            <td class="info two">
                <img src="Img/icons/bag.png" alt="bag">
                <div class="right">
                    <h3 class="white">Start and<br>End Dates</h3>
                    <span class="data-number">{{$schoolDetailData['dates']['startDate']}} - {{$schoolDetailData['dates']['endDate']}}</span>
                </div>
            </td>
        </tr>
        <tr>
            <td class="info three">
                <img src="Img/icons/percent.png" alt="percent">
                <div class="right">
                    <h3 class="white">Student/Teacher<br>Ratio</h3>
                    <span class="data">{{$schoolDetailData['enrollment']['Studentteacher']}}/1</span>
                </div>
            </td>
            <td class="info four">
                <img src="Img/icons/card.png" alt="card">
                <div class="right">
                    <h3 class="white">Principal<br>Name</h3>
                    <span class="data-number">{{$schoolDetailData['principle']['Fullname']}}</span>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</div>
