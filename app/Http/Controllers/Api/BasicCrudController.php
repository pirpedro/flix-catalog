<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

abstract class BasicCrudController extends Controller
{

    protected abstract function model();

    protected abstract function rulesStore();

    private $rules =[
        'name' => 'required|max:255',
        'is_active' => 'boolean'
    ];

    public function index()
    {
        return $this->model()::all();
    }

    public function store(Request $request){
        /** @var Model $obj */
        $validatedData = $this->validate($request, $this->rulesStore());
        $obj = $this->model()::create($validatedData);
        $obj->refresh();
        return $obj;
    }

    protected function findOrFail($id){
        /** @var Model $model */
        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();
        return $this->model()::where($keyName, $id)->firstOrFail();
    }

    // public function show(Category $category)
    // {
    //     return $category;
    // }

    // public function update(Request $request, Category $category)
    // {
    //     $this->validate($request, $this->rules);
    //     $category->update($request->all());
    //     return $category;
    // }

    // public function destroy(Category $category)
    // {
    //     $category->delete();
    //     return response()->noContent(); //204
    // }
}
