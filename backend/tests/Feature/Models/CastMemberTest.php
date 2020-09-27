<?php

namespace Tests\Feature\Models;

use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class CastMemberTest extends TestCase
{
    use DatabaseMigrations;
    
    public function testList()
    {
       factory(CastMember::class, 1)->create();
       $castMember = CastMember::all();
       $this->assertCount(1, $castMember);
       $cmKeys = array_keys($castMember->first()->getAttributes());
       $this->assertEqualsCanonicalizing([
           'id', 'name', 'type', 'created_at', 'updated_at', 'deleted_at'
       ], $cmKeys);
    }

    public function testCreate(){
        $castMember = CastMember::create([
            'name' => 'test1',
            'type' => CastMember::TYPE_DIRECTOR,
        ]);
        $this->assertEquals('test1', $castMember->name);
        $this->assertEquals(CastMember::TYPE_DIRECTOR, $castMember->type);
    }

    public function testUpdate(){
        /** @var CastMember $castMember */
        $castMember = factory(CastMember::class)->create([
            'type' => CastMember::TYPE_ACTOR
        ]);

        $data = [
            'name' => 'test_name_updated',
            'type' => CastMember::TYPE_DIRECTOR
        ];

        $castMember->update($data);

        foreach ($data as $key => $value){
            $this->assertEquals($value, $castMember->{$key}); 
        }
    }

    public function testDelete(){
        $castMember = factory(CastMember::class)->create();
        $castMember->delete();
        $this->assertNull(CastMember::find($castMember->id));
            
        $castMember->restore();
        $this->assertNotNull(CastMember::find($castMember->id));
      
    }

    // public function testUuid(){
    //     $stringUuid = '253e0f90-8842-4731-91dd-0191816e6a28';
    //     $uuid = Uuid::fromString($stringUuid);

    //     $factoryMock = Mockery::mock(UuidFactory::class . '[uuid4]', [
    //         'uuid4' => $uuid
    //     ]);

    //     Uuid::setFactory($factoryMock);
    //     $genre = factory(Genre::class)->create();
    //     $this->assertEquals($stringUuid, $genre->id);

    // }

    public function testUuidFormat(){
        $castMember = factory(CastMember::class)->create();
        $this->assertEquals(36, strlen($castMember->id));
        $this->assertRegExp('/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i', $castMember->id);
    }
}

