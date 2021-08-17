import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { ItemComponent } from './routes/item/item.component';
import { PageNotFoundComponent } from './routes/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: "search", component: HomeComponent },
  { path: "item", component: ItemComponent },
  { path: "", redirectTo: "/search", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
