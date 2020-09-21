<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

abstract class BasicCrudController extends Controller
{

    protected abstract function model();

    protected abstract function rulesStore();

    protected abstract function rulesUpdate();

    protected abstract function resource();

    protected abstract function resourceCollection();

    public function index()
    {
        return $this->model()::all();
    }

    public function store(Request $request){
        /** @var Model $obj */
        $validatedData = $this->validate($request, $this->rulesStore());
        $obj = $this->model()::create($validatedData);
        $obj->refresh();
        // $resource = $this->resource();
        // return new $resource($obj);
        return $obj;
    }

    protected function findOrFail($id){
        /** @var Model $model */
        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();
        return $this->model()::where($keyName, $id)->firstOrFail();
    }

    public function show($id)
    {   
        $obj = $this->findOrFail($id);
        // $resource = $this->resource();
        // return new $resource($obj);
        return $obj;
    }

    public function update(Request $request, $id)
    {
        $obj = $this->findOrFail($id);
        $validatedData = $this->validate($request, $this->rulesUpdate());    
        $obj->update($validatedData);
        // $resource = $this->resource();
        // return new $resource($obj);
        return $obj;
    }

    public function destroy($id)
    {
        $obj = $this->findOrFail($id);
        $obj->delete();
        return response()->noContent(); //204
    }
}
