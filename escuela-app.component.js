(function(app) {
	app.AppComponent =
		ng.core.Component({
		  selector: 'escuela-app',
		  templateUrl: 'views/app.component.html'
		})
		.Class({
		  constructor: [function() {

		  }]
		});
})(window.app || (window.app = {}));