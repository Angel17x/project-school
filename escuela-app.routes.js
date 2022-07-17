(function(app) {
  app.routing = ng.router.RouterModule.forRoot([
		{path: '', redirectTo: 'init', pathMatch: 'full'},
		{path:'init',component:app.InitComponent},
		{path:'subjects',component:app.SubjectsComponent},
		{path:'notes',component:app.NotesComponent},
		{path:'login',component:app.LoginComponent},
		{path:'students',component:app.StudentsComponent},
		{path:'inscriptions',component:app.InscriptionsComponent},
		{path:'employees',component:app.EmployeesComponent},
		{path:'create-employee',component:app.CreateEmployeesComponent},
		{path:'update-employee',component:app.CreateEmployeesComponent},
		{path: '**', redirectTo: 'not-found', pathMatch: 'full'},
  ],{useHash: true});
})(window.app || (window.app = {}));