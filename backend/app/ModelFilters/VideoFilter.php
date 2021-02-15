<?php

namespace App\ModelFilters;

use Illuminate\Database\Eloquent\Builder;

class VideoFilter extends DefaultModelFilter
{

    protected $sortable = ['title', 'created_at'];
}
