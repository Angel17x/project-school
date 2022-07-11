(function(app) {
	app.LoginComponent =
		ng.core.Component({
		  selector: 'login',
		  templateUrl: 'views/login.html'
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
        app.LoginComponent.prototype.ngOnInit=function(){
            this.email = null;
            this.password = null;
            this.mensaje = null;
            this.getStorage(this.service.getStorage('user'));
        }
        app.LoginComponent.prototype.login=function(){
            if(this.email==null || this.email==undefined){
                this.mensaje = "Ingrese el correo";
                $("modalWarning").modal("show");
                return;
            }
            if(this.password==null || this.password==undefined){
                this.mensaje = "Ingrese la contraseña";
                $("modalWarning").modal("show");
                return;
            }
            this.callServices();
        }
        app.LoginComponent.prototype.callServices=function(){
            let request = null;
            $("#pleaseWait").modal("show");
            request = this.service.callServicesHttp('login', null, {email: this.email, password: this.password});
            request.subscribe(data => {
                if(data == null || data == undefined || data == ""){
                    this.mensaje = "Error al obtener el usuario";
                    $("#modalFailed").modal("show");
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
        
        app.LoginComponent.prototype.verifyUser = function(data){
            if(!(data == null || data == undefined || data == "")){
                if(data.hasOwnProperty('users')){
                    if(data.users.length!=0){
                        let user = data.users.find(x => x.email === this.email ? x : undefined);
                        if(user.password === this.password){
                            this.service.setStorage('user', user);
                            this.router.navigate(['/init']);
                        }else{
                            this.mensaje = "Usuario o contraseña invalido";
                            $("#modalFailed").modal("show");

                        }
                    }
                }
            }
        }
        app.LoginComponent.prototype.getStorage=function(data){
            if(data==null || data==undefined){
                this.service.clearStorage();
                this.router.navigate(['/login']);
                return;
            }
            let user = JSON.parse(this.service.getStorage('user'));

            if(!(user==null || user == undefined || user == "")){
                this.email=user?.email;
                this.password=user?.password;
                this.callServices();
            }else{
                this.service.clearStorage();
                this.router.navigate(['/login']);
                return;
            }
        }
        app.LoginComponent.prototype.ngOnDestroy=function(){
            
        }
})(window.app || (window.app = {}));