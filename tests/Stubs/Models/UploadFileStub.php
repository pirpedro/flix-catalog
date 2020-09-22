<?php

namespace Tests\Stubs\Models;

use App\Models\Traits\UploadFiles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UploadFileStub extends Model
{
   use UploadFiles;

   protected static $fileFields = ['file1', 'file2'];

   protected function uploadDir(){
       return "1";
   }
}
