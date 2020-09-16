<?php

namespace App\Http\Controllers\Api;

use App\Models\Video;

class VideoController extends BasicCrudController
{
   
    private $rules;

    public function __construct(){

    }

    protected function model(){
        return Video::class;
    }

    protected function rulesStore(){}

    protected function rulesUpdate(){}
}
