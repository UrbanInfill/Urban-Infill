<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class homeController extends Controller
{
    public function home()
    {
        return view('home');

    }
    public function location()
    {
        return view('location');
    }
    public function VacantProperties()
    {
        return view('VacantProperties');
    }
}
