(function(app) {
  app.AppModule =
    ng.core.NgModule({
		imports: [
			ng.platformBrowser.BrowserModule,
			ng.forms.FormsModule,
			ng.router.RouterModule,
			ng.http.HttpModule,
			app.routing	
		],
		declarations: [
			app.LoadingServiceComponent,
			
			app.NavbarComponent,
			app.InitComponent,
			app.SubjectsComponent,
			app.NotesComponent,
			app.StudentsComponent,
			app.InscriptionsComponent,
			app.LoginComponent,
			app.NotfoundComponent,
			app.AppComponent
		],
		providers: [
			app.AppCallService,
			
			app.LoadingServiceComponent
		],
		bootstrap: [app.AppComponent]
   }).Class({
      constructor: function() {}
   });
})(window.app || (window.app = {}));