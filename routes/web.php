<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'homeController@home');
Route::get('/location','homeController@location');
Route::get('/VacantProperties','homeController@VacantProperties');
Route::get('/getOwnerDetail/{line1}/{line2}','AjaxController@ExtendedDetail');



// Ajax Responses
Route::get('/test','AjaxController@test');
Route::get("allpropertiesList",'AjaxController@allpropertiesList');
Route::get("getTotalPages",'AjaxController@getTotalPages');
Route::post('getzipdata', 'AjaxController@getzipResponse');
Route::post('getPropertyResponse','AjaxController@getPropertyResponse');
Route::get('/getHouseInventry','AjaxController@getHouseInventry');
Route::get("allVacantpropertiesList",'AjaxController@allVacantpropertiesList');



Route::get('/school','AjaxController@school');
