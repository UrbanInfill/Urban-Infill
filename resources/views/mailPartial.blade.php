@if($AVMResult["property"])
    @foreach ($AVMResult["property"] as $key => $WholePropertydata)
        <div class="card">
            <div class="card-header">
                <h4>{{$WholePropertydata["address"]["line1"]}}</h4>
                <h7>{{$WholePropertydata["address"]["line2"]}}</h7>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-6">

                        <div class="card">
                            <div class="card-header">
                                <h5>ASSESSOR</h5>
                            </div>
                            <div class="card-body">
                                <table cellspacing="0" style="border-collapse:collapse;">
                                    <tbody>
                                    <tr>
                                        <td>

                                            <strong>Address1: </strong>
                                            <span>{{$WholePropertydata["address"]["line1"]}}</span>
                                            <br>
                                            <strong>Address2: </strong>
                                            <span>{{$WholePropertydata["address"]["line2"]}}</span>
                                            <br>
                                            <strong>City: </strong>
                                            <span>{{$WholePropertydata["address"]["locality"]}}</span>
                                            <br>
                                            <strong>Property ID: </strong>
                                            <span>{{$WholePropertydata["identifier"]["apnOrig"]}}</span>
                                            <br>
                                            <strong>Tax Roll: </strong>
                                            <span>{{$WholePropertydata["summary"]["legal1"]}}</span>
                                            <br>
                                            <strong>Use: </strong>
                                            <span>{{$WholePropertydata["summary"]["propclass"]}}</span>
                                            <br>
                                            <strong>Block: </strong>
                                            <span>{{$WholePropertydata["area"]["blockNum"]}}</span>
                                            <br>
                                            <strong>Country: </strong>
                                            <span>{{$WholePropertydata["area"]["munname"]}}</span>
                                            <br>
                                            <strong>Total Land Area: </strong>
                                            <span>{{$WholePropertydata["lot"]["lotsize1"]}} acres ({{$WholePropertydata["lot"]["lotsize2"]}} sq ft)</span>
                                            <br>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header">
                                <h5>OWNER</h5>
                            </div>
                            <div class="card-body">
                                <table cellspacing="0" style="border-collapse:collapse;">
                                    <tbody>
                                    <tr>
                                        <td>
                                            <?php $count = 0 ?>
                                            @foreach ($WholePropertydata["owner"] as $key => $value)
                                                @if(gettype($value) == "array" )
                                                    @if(count($value) >0 || !empty($value) || $value != null )
                                                        <?php $name = "";
                                                        $count++;?>
                                                        @foreach ($value as $k => $v)
                                                            @if($v == "")
                                                                @continue
                                                            @endif
                                                            <?php $name = $name." ". $v;?>
                                                        @endforeach
                                                        @if($name != "")
                                                            <strong>Owner {{$count}} </strong>
                                                            <br/>
                                                            <strong>Name : </strong>
                                                            <span >{{$name}}</span>
                                                            <br/>
                                                        @endif

                                                    @endif
                                                    <hr/>
                                                @else
                                                    @if($key == "mailingaddressoneline")
                                                        <strong>Address : </strong>
                                                        <span >{{$value}}</span>
                                                        <br>
                                                    @endif
                                                @endif
                                            @endforeach
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">

                        <div class="card">
                            <div class="card-header">
                                <h4>MORTGAGE</h4>
                            </div>
                            <div class="card-body">
                                <table  cellspacing="0" style="border-collapse:collapse;">
                                    <tbody>
                                    <tr>
                                        <td>
                                            @if($WholePropertydata["mortgage"])
                                                @foreach ($WholePropertydata["mortgage"] as $key => $value)
                                                    @if(gettype($value) != "array")
                                                        <strong>{{$key}} : </strong>
                                                        <span >{{$value}}</span>
                                                        <br>
                                                    @else
                                                        <strong>{{$key}}  </strong>
                                                        <br/>
                                                        @foreach ($value as $k => $v)
                                                            <strong>{{$k}} : </strong>
                                                            <span >{{$v}}</span>
                                                            <br>
                                                        @endforeach
                                                        <hr/>
                                                    @endif
                                                @endforeach
                                            @endif
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        @if(count($Assessment) >0)
                            <div class="card">
                                <div class="card-header">
                                    <h4>ASSESSMENT HISTORY</h4>
                                </div>
                                <div class="card-body">
                                    <table cellspacing="0" class="table" style="border-collapse:collapse;">
                                        <thead>
                                        <th>Year</th>
                                        <th>Improvements</th>
                                        <th>Land</th>
                                        <th>Real Market</th>
                                        </thead>

                                        <tbody>
                                        @foreach($Assessment as $key => $assessmentValue)

                                            @foreach($assessmentValue as $historyValue)
                                                <tr>
                                                    <td>
                                                        {{$historyValue["tax"]["taxyear"]}}
                                                    </td>
                                                    <td>
                                                        ${{$historyValue["market"]["mktimprvalue"]}}
                                                    </td>
                                                    <td>
                                                        ${{$historyValue["market"]["mktlandvalue"]}}
                                                    </td>
                                                    <td>
                                                        ${{$historyValue["market"]["mktttlvalue"]}}
                                                    </td>
                                                </tr>
                                            @endforeach
                                        @endforeach
                                        <tr>

                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>

    @endforeach
@endif