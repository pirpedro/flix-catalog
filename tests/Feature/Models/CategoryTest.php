<?php

namespace Tests\Feature\Models;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Mockery;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidFactory;
use Tests\TestCase;

class CategoryTest extends TestCase
{

    use DatabaseMigrations;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testList()
    {
       factory(Category::class, 1)->create();
       $categories = Category::all();
       $this->assertCount(1, $categories);
       $categoryKeys = array_keys($categories->first()->getAttributes());
       $this->assertEqualsCanonicalizing([
           'id', 'name', 'description', 'is_active', 'created_at', 'updated_at', 'deleted_at'
       ], $categoryKeys);
    }

    public function testCreate(){
        $category = Category::create([
            'name' => 'test1'
        ]);
        $category->refresh();
        $this->assertEquals('test1', $category->name);
        $this->assertNull($category->description);
        $this->assertTrue($category->is_active);

        $category = Category::create([
            'name' => 'test1',
            'description' => null
        ]);
        $this->assertNull($category->description);

        $category = Category::create([
            'name' => 'test1',
            'description' => 'test_description'
        ]);
        $this->assertEquals('test_description', $category->description);

        $category = Category::create([
            'name' => 'test1',
            'is_active' => false
        ]);

        $this->assertFalse($category->is_active);

        $category = Category::create([
            'name' => 'test1',
            'is_active' => true
        ]);

        $this->assertTrue($category->is_active);
    }

    public function testUpdate(){
        /** @var Category $category */
        $category = factory(Category::class)->create([
            'description' =>  'test_description',
            'is_active' => false
        ]);

        $data = [
            'name' => 'test_name_updated',
            'description' => 'test_description_updated',
            'is_active' => true
        ];

        $category->update($data);

        foreach ($data as $key => $value){
            $this->assertEquals($value, $category->{$key}); 
        }
    }

    public function testDelete(){
        $category = factory(Category::class)->create();
        $category->delete();
        $categories = Category::all();
        $this->assertCount(0, $categories);
    }

    public function testUuid(){
        $stringUuid = '253e0f90-8842-4731-91dd-0191816e6a28';
        $uuid = Uuid::fromString($stringUuid);

        $factoryMock = Mockery::mock(UuidFactory::class . '[uuid4]', [
            'uuid4' => $uuid
        ]);

        Uuid::setFactory($factoryMock);
        $category = factory(Category::class)->create();
        $this->assertEquals($stringUuid, $category->id);
    }

    public function testUuidFormat(){
        $category = factory(Category::class)->create();
        $this->assertRegExp('/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i', $category->id);
    }
}
