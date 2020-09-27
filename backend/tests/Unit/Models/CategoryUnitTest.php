<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;

class CategoryUnitTest extends TestCase
{

    private $category;

    protected function setUp(): void {
        parent::setUp();
        $this->category = new Category();
    }

    public function testFillableAttribute()
    {
        $fillable =  ['name', 'description', 'is_active'];
        $this->assertEquals($fillable,$this->category->getFillable());
    }

    public function testIfUseTraits(){
        $traits = [
            SoftDeletes::class, Uuid::class
        ];
        $categoryTraits = array_keys(class_uses(Category::class));
        $this->assertEquals($traits, $categoryTraits);
    }

    public function testDatesAttribute(){
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $this->assertCount(count($dates), $this->category->getDates());
        foreach ($dates as $date) {
            $this->assertContains($date, $this->category->getDates());
        }
    }

    public function testCastsAttribute(){
        $casts = ['is_active' => 'boolean'];
        $this->assertEquals($casts, $this->category->getCasts());
    }

    public function testIfNotIncrementing(){
        $this->assertFalse($this->category->getIncrementing());
    }

    public function testKeyTypeIsString(){
        $this->assertEquals('string', $this->category->getKeyType());
    }


}
