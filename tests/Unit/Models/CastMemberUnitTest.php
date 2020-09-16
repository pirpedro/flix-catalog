<?php

namespace Tests\Unit\Models;

use App\Models\CastMember;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;

class CastMemberUnitTest extends TestCase
{

    private $castMember;

    protected function setUp(): void {
        parent::setUp();
        $this->castMember = new CastMember();
    }

    public function testFillableAttribute()
    {
        $fillable =  ['name', 'type'];
        $this->assertEquals($fillable,$this->castMember->getFillable());
    }

    public function testIfUseTraits(){
        $traits = [
            SoftDeletes::class, Uuid::class
        ];
        $castMemberTraits = array_keys(class_uses(CastMember::class));
        $this->assertEquals($traits, $castMemberTraits);
    }

    public function testDatesAttribute(){
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $this->assertCount(count($dates), $this->castMember->getDates());
        foreach ($dates as $date) {
            $this->assertContains($date, $this->castMember->getDates());
        }
    }

    public function testCastsAttribute(){
        $casts = ['type' => 'integer'];
        $this->assertEquals($casts, $this->castMember->getCasts());
    }

    public function testIfNotIncrementing(){
        $this->assertFalse($this->castMember->getIncrementing());
    }

    public function testKeyTypeIsString(){
        $this->assertEquals('string', $this->castMember->getKeyType());
    }
}
