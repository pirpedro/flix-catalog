<?php

namespace Tests\Feature\Models;

use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class VideoTest extends TestCase
{
    use DatabaseMigrations;
    
    public function testList()
    {
       factory(Video::class, 1)->create();
       $video = Video::all();
       $this->assertCount(1, $video);
       $cmKeys = array_keys($video->first()->getAttributes());
       $this->assertEqualsCanonicalizing([
            'id',
            'title',
            'description',
            'year_launched',
            'opened',
            'rating',
            'duration',
            'created_at',
            'updated_at',
            'deleted_at'
       ], $cmKeys);
    }

    public function testCreate(){
        $data = [
            'title' => 'test1',
            'description' => 'description_test',
            'year_launched' => 2019,
            'rating' => Video::RATING_LIST[0],
            'duration' =>90,
        ];
        
        $video = Video::create($data);
        $video->refresh();
        $this->assertEquals('test1', $video->title);
        $this->assertEquals('description_test', $video->description);
        $this->assertEquals(2019, $video->year_launched);
        $this->assertEquals(Video::RATING_LIST[0], $video->rating);
        $this->assertEquals(90, $video->duration);
        $this->assertFalse($video->opened);
        
        $video = Video::create($data+ ['opened' => false]);
        $this->assertFalse($video->opened);

        $video = Video::create($data+ ['opened' => true]);
        $this->assertTrue($video->opened);

    }

    public function testUpdate(){
        /** @var Video $video */
        $video = factory(Video::class)->create([
            'opened' => true,
            'rating' => Video::RATING_LIST[0],
        ]);

        $data = [
            'title' => 'test1',
            'description' => 'description_test',
            'year_launched' => 2019,
            'rating' => Video::RATING_LIST[1],
            'duration' =>90,
            'opened' => true
        ];

        $video->update($data);

        foreach ($data as $key => $value){
            $this->assertEquals($value, $video->{$key}); 
        }
    }

    public function testDelete(){
        $video = factory(Video::class)->create();
        $video->delete();
        $this->assertNull(Video::find($video->id));
            
        $video->restore();
        $this->assertNotNull(Video::find($video->id));
      
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
        $video = factory(Video::class)->create();
        $this->assertEquals(36, strlen($video->id));
        $this->assertRegExp('/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i', $video->id);
    }
}

