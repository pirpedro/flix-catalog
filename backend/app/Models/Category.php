<?php

namespace App\Models;

use App\ModelFilters\CategoryFilter;
use App\Models\Traits\SerializeDateToIso8601;
use App\Models\Traits\Uuid;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes, Uuid, Filterable, SerializeDateToIso8601;
    protected $fillable = ['name', 'description', 'is_active'];
    protected $dates = ['deleted_at'];
    public $incrementing = false;
    protected $keyType= 'string';
    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function modelFilter(){
        return $this->provideFilter(CategoryFilter::class);
    }

    public function genres(){
        return $this->belongsToMany(Genre::class)->withTrashed();
    }
}
