import { RouteProps } from "react-router-dom";
import CastMemberList from "../pages/cast-member/PageList";
import CastMemberForm from "../pages/cast-member/PageForm";
import CategoryList from "../pages/category/PageList";
import CategoryForm from "../pages/category/PageForm";
import Dashboard from "../pages/Dashboard";
import GenreList from "../pages/genre/PageList";
import GenreForm from "../pages/genre/PageForm";

export interface MyRouteProps extends RouteProps{
  name: string;
  label: string;
}

const routes : MyRouteProps[] = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    path: '/',
    component: Dashboard,
    exact: true
  },
  {
    name: 'categories.list',
    label: 'Listar Categorias',
    path: '/categories',
    component: CategoryList,
    exact: true
  },
  {
    name: 'categories.create',
    label: 'Criar Categoria',
    path: '/categories/create',
    component: CategoryForm,
    exact: true
  },
  {
    name: 'categories.edit',
    label: 'Editar Categoria',
    path: '/categories/:id/edit',
    component: CategoryForm,
    exact: true
  },
  {
    name: 'cast_members.list',
    label: 'Listar membros de elenco',
    path: '/cast-members',
    component: CastMemberList,
    exact: true
  },
  {
    name: 'cast_members.create',
    label: 'Criar membro',
    path: '/cast-members/create',
    component: CastMemberForm,
    exact: true
  },
  {
    name: 'cast_members.edit',
    label: 'Editar membro',
    path: '/cast-members/:id/edit',
    component: CastMemberForm,
    exact: true
  },
  {
    name: 'genres.list',
    label: 'Listar gêneros',
    path: '/genres',
    component: GenreList,
    exact: true
  },
  {
    name: 'genres.create',
    label: 'Criar gênero',
    path: '/genres/create',
    component: GenreForm,
    exact: true
  },
  {
    name: 'genres.edit',
    label: 'Editar gênero',
    path: '/genres/:id/edit',
    component: GenreForm,
    exact: true
  },
];

export default routes;