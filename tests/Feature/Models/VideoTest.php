<?php

namespace Tests\Feature\Models;

use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class VideoTest extends TestCase
{
    use DatabaseMigrations;

    private $data;

    protected function setUp(): void{
        parent::setUp();
        $this->data = [
            'title' => 'title',
            'description' => 'description',
            'year_launched' => 2010,
            'rating' => Video::RATING_LIST[0],
            'duration' => 90,
        ];
    }
    
    public function testList(){
       factory(Video::class)->create();
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

    public function testCreateWithBasicFields(){
        $video = Video::create($this->data);
        $video->refresh();

        $this->assertEquals(36, strlen($video->id));
        $this->assertFalse($video->opened);
        $this->assertDatabaseHas('videos', $this->data + ['opened' => false]);

        $video = Video::create($this->data + ['opened' => true]);
        $this->assertTrue($video->opened);
        $this->assertDatabaseHas('videos', $this->data + ['opened' => true]);
    }

    public function testCreateWithRelations(){
        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $video = Video::create($this->data + [
            'categories_id' => [$category->id],
            'genres_id' => [$genre->id],
        ]);

        $this->assertHasCategory($video->id, $category->id);
        $this->assertHasGenre($video->id, $genre->id);
    }

    public function testUpdateWithBasicFields(){
        $video = factory(Video::class)->create([
            'opened' => false
        ]);
        $video->update($this->data);
        $this->assertFalse($video->opened);
        $this->assertDatabaseHas('videos', $this->data + ['opened' => false]);

        $video = factory(Video::class)->create([
            'opened' => false
        ]);
        $video->update($this->data + ['opened' => true]);
        $this->assertTrue($video->opened);
        $this->assertDatabaseHas('videos', $this->data + ['opened' => true]);
    }

    public function testUpdateWithRelations(){
        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $video = factory(Video::class)->create();
        $video->update($this->data + [
            'categories_id' => [$category->id],
            'genres_id' => [$genre->id],
        ]);

        $this->assertHasCategory($video->id, $category->id);
        $this->assertHasGenre($video->id, $genre->id);
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

    public function testRollbackCreate(){

        $hasError = false;
        try {
            Video::create([
                'title' => 'title',
                'description' => 'description',
                'year_launched' => 2010,
                'rating' => Video::RATING_LIST[0],
                'duration' => 90,
                'categories_id' => [0,1,2], 
            ]);
        } catch (QueryException $e) {
            $this->assertCount(0, Video::all());
            $hasError = true;
        }
        $this->assertTrue($hasError);          
    }

    public function testRollbackUpdate(){
        $video = factory(Video::class)->create();
        $oldTitle = $video->title;
        $hasError = false;
        try {
            $video->update([
                'title' => 'title',
                'description' => 'description',
                'year_launched' => 2010,
                'rating' => Video::RATING_LIST[0],
                'duration' => 90,
                'categories_id' => [0,1,2], 
            ]);
       } catch (QueryException $exception) {
            $this->assertDatabaseHas('videos', [
                'title' => $oldTitle
            ]);
            $hasError = true;
       }
       $this->assertTrue($hasError);       

    }

    protected function assertHasCategory($videoId, $categoryId){
        $this->assertDatabaseHas('category_video', [
            'video_id' => $videoId,
            'category_id' => $categoryId
        ]);
    }

    protected function assertHasGenre($videoId, $genreId){
        $this->assertDatabaseHas('genre_video', [
            'video_id' => $videoId,
            'genre_id' => $genreId
        ]);
    }

    public function testHandleRelations(){
        $video = factory(Video::class)->create();
        Video::handleRelations($video, []);
        $this->assertCount(0, $video->categories);
        $this->assertCount(0, $video->genres);

        $category = factory(Category::class)->create();
        Video::handleRelations($video, [
            'categories_id' => [$category->id],
        ]);
        $video->refresh();
        $this->assertCount(1, $video->categories);

        $genre = factory(Genre::class)->create();
        Video::handleRelations($video, [
            'genres_id' => [$genre->id],
        ]);
        $video->refresh();
        $this->assertCount(1, $video->genres);

        $video->categories()->delete();
        $video->genres()->delete();

        Video::handleRelations($video, [
            'categories_id' => [$category->id],
            'genres_id' => [$genre->id],
        ]);
        $video->refresh();
        $this->assertCount(1, $video->categories);
        $this->assertCount(1, $video->genres);
    }

     public function testSyncCategories(){
        $categoriesId = factory(Category::class,3)->create()->pluck('id')->toArray();
        $video = factory(Video::class)->create();
        Video::handleRelations($video, [
            'categories_id' => [$categoriesId[0]],
        ]);
        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoriesId[0],
            'video_id' => $video->id,
        ]);

        Video::handleRelations($video, [
            'categories_id' => [$categoriesId[1], $categoriesId[2]],
        ]);
        $this->assertDatabaseMissing('category_video', [
            'category_id' => $categoriesId[0],
            'video_id' => $video->id,
        ]);
        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoriesId[1],
            'video_id' => $video->id,
        ]);

        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoriesId[2],
            'video_id' => $video->id,
        ]);
    }

    public function testSyncGenre(){
        $genresId = factory(Genre::class,3)->create()->pluck('id')->toArray();
        $video = factory(Video::class)->create();
        Video::handleRelations($video, [
            'genres_id' => [$genresId[0]],
        ]);
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genresId[0],
            'video_id' => $video->id,
        ]);

        Video::handleRelations($video, [
            'genres_id' => [$genresId[1], $genresId[2]],
        ]);
        $this->assertDatabaseMissing('genre_video', [
            'genre_id' => $genresId[0],
            'video_id' => $video->id,
        ]);
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genresId[1],
            'video_id' => $video->id,
        ]);

        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genresId[2],
            'video_id' => $video->id,
        ]);
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

