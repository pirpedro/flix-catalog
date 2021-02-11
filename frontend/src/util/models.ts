export interface ListResponse<T>{
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

interface TimeStampable {
  readonly created_at: string;
  readonly deleted_at: string | null;
  readonly updated_at: string;
}

export  interface Category extends TimeStampable{
  readonly id: string;
  name: string;
  description: string;
  is_active: boolean;
}

export const CastMemberTypeMap = {
  1: 'Director',
  2: 'Ator'
};

export  interface CastMember extends TimeStampable{
  readonly id: string;
  name: string;
  type: number;
}

export  interface Genre extends TimeStampable{
  readonly id: string;
  name: string;
  is_active: boolean;
  categories: Category[];
}

interface GenreVideo extends Omit<Genre, 'categories'> {

}

export const VideoFileFieldsMap = {
  'thumb_file' : 'Thumbnail',
  'banner_file' : 'Banner',
  'trailer_file' : 'Trailer',
  'video_file' : 'Principal'
}

export  interface Video extends TimeStampable{
  readonly id: string;
  title: string;
  description: string;
  year_launched: number;
  opened: boolean;
  rating: string;
  duration: number;
  genres: GenreVideo[];
  categories: Category[];
  cast_members: CastMember[];
  video_file_url: string;
  thumb_file_url: string;
  banner_file_url: string;
  trailer_file_url: string;
}