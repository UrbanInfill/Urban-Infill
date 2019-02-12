<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
class MailController extends Controller
{
    public function sendMail()
    {
        Mail::send(["html"=>"mail"],["name"=>"noufal"],function ($message)
        {
            $message->to("noufalsiddiqui@gmail.com","To Noufal")->subject("Test Mail");
            $message->from("noufalsiddiqui@gmail.com","Noufal");
        });
        return "send";
    }
}
