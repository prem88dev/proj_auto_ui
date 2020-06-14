import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ListAllProjectComponent } from './list-all-project/list-all-project.component';
import { HttpClientModule } from '@angular/common/http';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ProjectRevenueComponent } from './project-revenue/project-revenue.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const paths: Routes = [
  { path: 'dashboard/:year', component: DashboardComponent },
  { path: 'projectRevenue/:esaId/:year', component: ProjectRevenueComponent },
  { path: 'projectRevenue/:esaId', component: ProjectRevenueComponent },
  { path: 'projectRevenue', component: ProjectRevenueComponent },
  { path: 'projectList', component: ListAllProjectComponent },
  { path: 'addProject', component: AddProjectComponent },
  { path: 'editProject/:id', component: EditProjectComponent },
  { path: '**', component: DashboardComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    ListAllProjectComponent,
    EditProjectComponent,
    AddProjectComponent,
    ProjectRevenueComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(paths),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }