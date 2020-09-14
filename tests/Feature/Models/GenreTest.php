<?php

namespace Tests\Feature\Models;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Mockery;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidFactory;
use Tests\TestCase;

class GenreTest extends TestCase
{
    use DatabaseMigrations;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testList()
    {
       factory(Genre::class, 1)->create();
       $genres = Genre::all();
       $this->assertCount(1, $genres);
       $genresKeys = array_keys($genres->first()->getAttributes());
       $this->assertEqualsCanonicalizing([
           'id', 'name', 'is_active', 'created_at', 'updated_at', 'deleted_at'
       ], $genresKeys);
    }

    public function testCreate(){
        $genre = Genre::create([
            'name' => 'test1'
        ]);
        $genre->refresh();
        $this->assertEquals('test1', $genre->name);
        $this->assertTrue($genre->is_active);

        $genre = Genre::create([
            'name' => 'test1',
            'is_active' => false
        ]);

        $this->assertFalse($genre->is_active);

        $genre = Genre::create([
            'name' => 'test1',
            'is_active' => true
        ]);

        $this->assertTrue($genre->is_active);
    }

    public function testUpdate(){
        /** @var Genre $genre */
        $genre = factory(Genre::class)->create([
            'is_active' => false
        ]);

        $data = [
            'name' => 'test_name_updated',
            'is_active' => true
        ];

        $genre->update($data);

        foreach ($data as $key => $value){
            $this->assertEquals($value, $genre->{$key}); 
        }
    }

    public function testDelete(){
        $genre = factory(Genre::class)->create();
        $genre->delete();
        $this->assertNull(Genre::find($genre->id));
            
        $genre->restore();
        $this->assertNotNull(Genre::find($genre->id));
      
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
        $genre = factory(Genre::class)->create();
        $this->assertEquals(36, strlen($genre->id));
        $this->assertRegExp('/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i', $genre->id);
    }
}

