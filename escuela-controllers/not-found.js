(function(app) {
	app.NotfoundComponent =
		ng.core.Component({
		  selector: 'not-found',
		  templateUrl: 'views/not-found.html'
		})
		.Class({
            constructor: [ng.router.ActivatedRoute,ng.router.Router,app.AppCallService,
                function(active,router,service) {
                    this.active=active;
                    this.router=router;
                    this.service=service;
                    this.msg=msg;
                }
            ]
        });
        app.NotfoundComponent.prototype.ngOnInit=function(){
            this.router.navigate(["/init"]);
        }
        app.NotfoundComponent.prototype.ngOnDestroy=function(){
            
        }
})(window.app || (window.app = {}));