<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\GenreController;
use App\Models\Category;
use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Mockery;
use Tests\Exceptions\TestException;
use Tests\TestCase;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class GenreControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;
    
    private $genre;
   
    protected function setUp(): void
    {
        parent::setUp();
        $this->genre = factory(Genre::class)->create();
    }

    public function testIndex()
    {
        $response = $this->get(route('genres.index'));

        $response->assertStatus(200)
                 ->assertJson([$this->genre->toArray()]);
    }

    public function testShow()
    {
        $response = $this->get(route('genres.show', ['genre' => $this->genre->id]));

        $response->assertStatus(200)
                 ->assertJson($this->genre->toArray());
    }

    public function testInvalidationData(){
        $data = [
            'name' => ''
        ];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');

        $data = [
            'name' => str_repeat('a', 256),
        ];

        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);

        $data = [
            'is_active' => 'a'
        ];
        $this->assertInvalidationInStoreAction($data, 'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');
    }

    public function testSave(){
        $category = factory(Category::class)->create();
        $data = [
            [
                'send_data' => [
                    'name' => 'test',
                    'categories_id' => [$category->id],
                ],
                'test_data' => [
                    'name' => 'test',
                    'is_active' => true]
            ],
            [
                'send_data' => [
                    'name' => 'test',
                    'is_active' => false,
                    'categories_id' => [$category->id],
                ],
                'test_data' => [
                    'name' => 'test',
                    'is_active' => false
                ]
            ],
            
        ];

        foreach ($data as $key => $value){
            $response = $this->assertStore(
                $value['send_data'], 
                $value['test_data'] + ['deleted_at' => null]);
            $response->assertJsonStructure([
                'created_at', 'updated_at'
            ]);

            $response = $this->assertUpdate(
                $value['send_data'], 
                $value['test_data'] + ['deleted_at' => null]);
            $response->assertJsonStructure([
                'created_at', 'updated_at'
            ]);
        }
    }

    public function testRollbackStore(){
        /** @var LegacyMockInterface $controller */
        $controller = Mockery::mock(GenreController::class);
        $controller->makePartial()->shouldAllowMockingProtectedMethods();

        $controller->shouldReceive('validate')
            ->withAnyArgs()
            ->andReturn(['name' => 'test']);

        $controller->shouldReceive('rulesStore')
        ->withAnyArgs()
        ->andReturn([]);

        $controller->shouldReceive('handleRelations')
                ->once()
                ->andThrow(new TestException());

        /** @var Request $request */
        $request = \Mockery::mock(Request::class);
        
        /** @var VideoController $controller */
        try {
            $controller->store($request); 
        } catch (TestException $exception) {
            $this->assertCount(1, Genre::all());
        }
        
               
    }

    public function testDestroy(){
        $response = $this->json('DELETE', route('genres.destroy', ['genre' => $this->genre->id]));
        $response->assertStatus(204);
        $this->assertNull(Genre::find($this->genre->id));
        $this->assertNotNull(Genre::withTrashed()->find($this->genre->id));
    }

    protected function routeStore(){
        return route('genres.store');
    }

    protected function routeUpdate(){
        return route('genres.update', ['genre' => $this->genre->id]);
    }

    protected function model(){
        return Genre::class;
    }
}
