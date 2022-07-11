(function(app) {
	app.InitComponent =
		ng.core.Component({
		  selector: 'init',
		  templateUrl: 'views/init.html'
		})
		.Class({
            constructor: [ng.router.ActivatedRoute,ng.router.Router,app.AppCallService,
                function(active,router,service) {
                    this.active=active;
                    this.router=router;
                    this.service=service;
                }
            ]
        });
        app.InitComponent.prototype.ngOnInit=function(){
            this.email = null;
            this.password;
            this.getStorage(this.service.getStorage('user'));
        }
        
        app.InitComponent.prototype.callServicesUser=function(user){
            let request = null;
            $("#pleaseWait").modal("show");
            request = this.service.callServicesHttp('login', null, user);
            request.subscribe(data => {
                if(data == null || data == undefined || data == ""){
                    this.service.clearStorage();
                    this.router.navigate(['/login']);
                    return;
                }
                if(data.status_http==200){
					delete data['status_http'];
                    this.verifyUser(data)        
                }
                $("#pleaseWait").modal("hide");
            },err => {
                $("#pleaseWait").modal("hide");
            })
        }
        
        app.InitComponent.prototype.verifyUser = function(data){
            if(!(data == null || data == undefined || data == "")){
                if(data.hasOwnProperty('users')){
                    if(data.users.length!=0){
                        let user = data.users.find(x => x.email === this.email ? x : undefined);
                        if(user.password === this.password){
                            return
                        }else{
                            this.service.clearStorage();
                            this.router.navigate(['/login']);
                        }
                    }
                }
            }
        }
        app.InitComponent.prototype.getStorage=function(data){
            if(data==null || data==undefined){
                this.service.clearStorage();
                this.router.navigate(['/login']);
                return;
            }
            let user = JSON.parse(this.service.getStorage('user'));

            this.email = user?.email;
            this.password = user?.password;

            if(!(user==null || user == undefined || user == "")){
                this.callServicesUser(user);
            }else{
                this.service.clearStorage();
                this.router.navigate(['/login']);
                return;
            }
        }
        
        app.InitComponent.prototype.ngOnDestroy=function(){
            
        }
})(window.app || (window.app = {}));