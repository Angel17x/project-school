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
            this.password=null;
            this.name=null;
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
                if(data.hasOwnProperty('email')){
                    if(data.email !== this.email){
                        this.service.clearStorage();
                        this.router.navigate(['/login']);
                    }
                    if(data.password !== this.password){
                        this.service.clearStorage();
                        this.router.navigate(['/login']);
                    }
                    return
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
            this.name = user?.name;
            
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
        app.InitComponent.prototype.message=function(message, name){
            this.mensaje = message;
            if(!message){
                return;
            }
            if(name === "error"){
                $("#modalFailed").modal("show");
                return;
            }
            if(name === "success"){
                $("#modalSuccess").modal("show");
                return;
            }
            if(name === "warning"){
                $("#modalWarning").modal("show");
                return;
            }
        }
})(window.app || (window.app = {}));