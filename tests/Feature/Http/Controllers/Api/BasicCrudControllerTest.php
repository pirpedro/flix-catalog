<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\BasicCrudController as ApiBasicCrudController;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Mockery;
use ReflectionClass;
use Tests\Stubs\Controllers\CategoryControllerStub;
use Tests\Stubs\Models\CategoryStub;
use Tests\TestCase;

class BasicCrudController extends TestCase
{
    private $controller;
    
    protected function setUp(): void {
        parent::setUp();
        CategoryStub::dropTable();
        CategoryStub::createTable();
        $this->controller = new CategoryControllerStub();
    }

    protected function tearDown(): void {
        CategoryStub::dropTable();
        parent::tearDown();
    }

    public function testIndex(){
        /** @var CategoryStub $category */
        $category = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);
        $result = $this->controller->index()->toArray();
        $this->assertEquals([$category->toArray()], $result);
    } 

    public function testInvalidationDataInStore(){
        
        $this->expectException(ValidationException::class);
        /** @var Request $request */
        $request = Mockery::mock(Request::class);
        $request->shouldReceive('all')
                ->once()
                ->andReturn(['name' => '']);
        $this->controller->store($request);
    }

    public function testStore(){
        $request = Mockery::mock(Request::class);
        $request = Mockery::mock(Request::class);
        $request->shouldReceive('all')
                ->once()
                ->andReturn(['name' => 'test_name', 'description' => 'test_description']);
        $obj = $this->controller->store($request);
        $this->assertEquals(
            CategoryStub::find(1)->toArray(),
            $obj->toArray()
        );
    }

    public function testIfFindOrFailFetchModel(){
        /** @var CategoryStub $category */
        $category = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);

        $reflectionClass = new ReflectionClass(ApiBasicCrudController::class);
        $reflectionMethod = $reflectionClass->getMethod('findOrFail');
        $reflectionMethod->setAccessible(true);

        $result = $reflectionMethod->invokeArgs($this->controller,[$category->id]);
        $this->assertInstanceOf(CategoryStub::class, $result);

    }

    public function testIfFindOrFailShowExceptionWhenIdInvalid(){
      
        $this->expectException(ModelNotFoundException::class);
        $reflectionClass = new ReflectionClass(ApiBasicCrudController::class);
        $reflectionMethod = $reflectionClass->getMethod('findOrFail');
        $reflectionMethod->setAccessible(true);

        $result = $reflectionMethod->invokeArgs($this->controller,[0]);
        $this->assertInstanceOf(CategoryStub::class, $result);

    }
}
