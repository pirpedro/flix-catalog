<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\VideoResource;
use App\Models\Video;
use App\Rules\GenresHasCategoriesRule;
use Illuminate\Http\Request;

class VideoController extends BasicCrudController
{
   
    private $rules;

    public function __construct(){
        $this->rules = [
            'title' => 'required|max:255',
            'description' => 'required',
            'year_launched' => 'required|date_format:Y',
            'opened' => 'boolean',
            'rating' => 'required|in:' . implode(',', Video::RATING_LIST),
            'duration' => 'required|integer',
            'categories_id' => 'required|array|exists:categories,id,deleted_at,NULL' ,
            'genres_id' => explode('|','required|array|exists:genres,id,deleted_at,NULL'),
        ];
    }

    public function store(Request $request){

        $this->addRuleIfGenreHasCategories($request);
        $validatedData = $this->validate($request, $this->rulesStore());
        $self = $this;
        $obj = \DB::transaction(function () use($request, $validatedData, $self){
            $obj = $this->model()::create($validatedData);
            $self->handleRelations($obj, $request);
            return $obj;
        });
        $obj->refresh();
        // $resource = $this->resource();
        // return new $resource($obj);
        return $obj;
    }

    public function update(Request $request, $id){
        $obj = $this->findOrFail($id);
        $this->addRuleIfGenreHasCategories($request);
        $self = $this;
        $validatedData = $this->validate($request, $this->rulesUpdate()); 
        return \DB::transaction(function() use($request, $validatedData, $self, $obj) {
            $obj->update($validatedData);
            $self->handleRelations($obj, $request);
            // $resource = $self->resource();
            // return new $resource($obj);
            return $obj;
        });
    }

    protected function addRuleIfGenreHasCategories(Request $request){
        $categoriesId = $request->get('category_id');
        $categoriesId = is_array($categoriesId) ? $categoriesId : [];
        $this->rules['genre_id'][] = new GenresHasCategoriesRule($categoriesId);
    }

    protected function handleRelations($video, Request $request){
        $video->categories()->sync($request->get('categories_id'));
        $video->genres()->sync($request->get('genres_id'));
    }

    protected function model(){
        return Video::class;
    }

    protected function rulesStore(){
        return $this->rules;
    }

    protected function rulesUpdate(){
        return $this->rules;
    }

    protected function resource()
    {
        return VideoResource::class;
    }

    protected function resourceCollection()
    {
        return $this->resource();
    }
}
