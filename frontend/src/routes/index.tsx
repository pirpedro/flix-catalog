import { RouteProps } from "react-router-dom";
import CastMemberList from "../pages/cast-member/PageList";
import CastMemberCreate from "../pages/cast-member/PageForm";
import CategoryList from "../pages/category/PageList";
import CategoryCreate from "../pages/category/PageForm";
import Dashboard from "../pages/Dashboard";
import GenreList from "../pages/genre/PageList";
import GenreCreate from "../pages/genre/PageForm";

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
    component: CategoryCreate,
    exact: true
  },
  {
    name: 'categories.edit',
    label: 'Editar Categoria',
    path: '/categories/:id/edit',
    component: CategoryList,
    exact: true
  },
  {
    name: 'cast-members.list',
    label: 'Listar membros de elenco',
    path: '/cast-members',
    component: CastMemberList,
    exact: true
  },
  {
    name: 'cast-members.create',
    label: 'Criar membros de elenco',
    path: '/cast-members/create',
    component: CastMemberCreate,
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
    label: 'Criar gêneros',
    path: '/genres/create',
    component: GenreCreate,
    exact: true
  },
];

export default routes;