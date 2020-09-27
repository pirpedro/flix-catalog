<?php

namespace Tests\Stubs\Models;

use App\Models\Traits\UploadFiles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UploadFileStub extends Model
{
   use UploadFiles;

   protected $table = "upload_file_stubs";
   protected $fillable = ['name', 'file1', 'file2'];
   protected static $fileFields = ['file1', 'file2'];

    protected static function makeTable(){
        \Schema::create('upload_file_stubs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('file1')->nullable();
            $table->string('file2')->nullable();
            $table->timestamps();
        });
    }

    protected static function dropTable(){
        \Schema::dropIfExists('upload_file_stubs');
    }

   protected function uploadDir(){
       return "1";
   }
}
