<?php

namespace App\Http\Controllers\Api;

use App\Models\Video;
use App\Rules\GenreHasCategoryRule;
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
            'categories_id' => explode("|", 'required|array|exists:categories,id') ,
            'genres_id' => 'required|array|exists:genres,id'
        ];
    }

    public function store(Request $request){

        $this->addRuleGenreHasCategories($request);
        $validatedData = $this->validate($request, $this->rulesStore());
        $self = $this;
        $obj = \DB::transaction(function () use($request, $validatedData, $self){
            $obj = $this->model()::create($validatedData);
            $self->handleRelations($obj, $request);
            return $obj;
        });
        $obj->refresh();
        return $obj;
    }

    public function update(Request $request, $id){
        $obj = $this->findOrFail($id);
        $this->addRuleGenreHasCategories($request);
        $self = $this;
        $validatedData = $this->validate($request, $this->rulesUpdate()); 
        return \DB::transaction(function() use($request, $validatedData, $self, $obj) {
            $obj->update($validatedData);
            $self->handleRelations($obj, $request);
            return $obj;
        });
    }

    protected function addRuleGenreHasCategories(Request $request){
        $categoriesId = $request->get('category_id');
        $categoriesId = is_array($categoriesId) ? $categoriesId : [];
        $this->rules['genre_id'][] = new GenreHasCategoryRule($categoriesId);
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
}
