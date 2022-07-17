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
                this.message("Ingrese el correo", "warning")
                return;
            }
            if(this.password==null || this.password==undefined){
                this.message("Ingrese la contraseña", "warning")
                return;
            }
            this.callServices();
        }
        app.LoginComponent.prototype.callServices=function(){
            let request = null;
            $("#pleaseWait").modal("show");
            let mensajeAll = "Error al procesar la petición";
            request = this.service.callServicesHttp('login', null, {email: this.email, password: this.password});
            request.subscribe(data => {
                if(data == null || data == undefined || data == ""){
                    this.message("Usuario o contraseña invalido", "error");
                    return;
                }
                if(data.status_http==200){
					delete data['status_http'];
                    this.verifyUser(data)        
                }
            },err => {
                $("#pleaseWait").modal("hide");
                this.message(this.service.processError(err,mensajeAll), "error");
            })
        }
        
        app.LoginComponent.prototype.verifyUser = function(data){
            if(!(data == null || data == undefined || data == "")){
                if(data.hasOwnProperty('email')){
                    if(data.email !== this.email){
                        this.message("Usuario o contraseña invalido", "error");
                        return;
                    }
                    if(data.hasOwnProperty('password')){
                        if(data.password === this.password){
                            $("#pleaseWait").modal("hide");
                            this.service.setStorage('user', data);
                            return this.router.navigate(['/init']);
                        }
                        this.message("Usuario o contraseña invalido", "error");
                        return;
                    }
                    this.message("Usuario o contraseña invalido", "error");
                    return;
                }
                this.message("Usuario o contraseña invalido", "error");
                return;
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
        app.LoginComponent.prototype.message=function(message, name){
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
        app.LoginComponent.prototype.ngOnDestroy=function(){
            
        }
})(window.app || (window.app = {}));