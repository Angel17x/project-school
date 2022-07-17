(function(app) {
	app.InscriptionsComponent =
		ng.core.Component({
		  selector: 'inscriptions',
		  templateUrl: 'views/inscriptions.html'
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
        app.InscriptionsComponent.prototype.ngOnInit=function(){
            this.email = null;
            this.password = null;
            this.name = null;
            this.lastname = null;
            this.age = null;
            this.rep_name = null;
            this.rep_lastname = null;
            this.rep_age = null;
            this.address = null;
            this.address_2 = null;
            this.address_3 = null;
            this.getStorage(this.service.getStorage('user'));
        }
        
        app.InscriptionsComponent.prototype.callServicesUser=function(user){
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
        
        app.InscriptionsComponent.prototype.verifyUser = function(data){
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
        app.InscriptionsComponent.prototype.getStorage=function(data){
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
        app.InscriptionsComponent.prototype.register=function(){
            if(this.name==null || this.name == undefined || this.name == ""){
                this.mensaje = "Ingrese el nombre del niño/niña"
                $("#modalFailed").modal("show");
                return;
            }
            if(this.lastname==null || this.lastname == undefined || this.lastname == ""){
                this.mensaje = "Ingrese el apellido del niño/niña"
                $("#modalFailed").modal("show");
                return;
            }
            if(this.age==null || this.age == undefined || this.age == ""){
                this.mensaje = "Ingrese la edad del niño/niña"
                $("#modalFailed").modal("show");
                return;
            }
            if(this.rep_name==null || this.rep_name == undefined || this.rep_name == ""){
                this.mensaje = "Ingrese el nombre del reprensentante"
                $("#modalFailed").modal("show");
                return;
            }
            if(this.rep_lastname==null || this.rep_lastname == undefined || this.rep_lastname == ""){
                this.mensaje = "Ingrese el apellido del reprensentante"
                $("#modalFailed").modal("show");
                return;
            }
            if(this.rep_age==null || this.rep_age == undefined || this.rep_age == ""){
                this.mensaje = "Ingrese la edad del reprensentante"
                $("#modalFailed").modal("show");
                return;
            }
            if(this.address==null || this.address == undefined || this.address == ""){
                this.mensaje = "Ingrese la direccion"
                $("#modalFailed").modal("show");
                return;
            }
            this.mensaje = "Usuario registrado con éxito";
            $("#modalSuccess").modal("show");

        }

        app.InscriptionsComponent.prototype.clean=function(){
            this.name = null;
            this.lastname = null;
            this.age = null;
            this.rep_name = null;
            this.rep_lastname = null;
            this.rep_age = null;
            this.address = null;
            this.address_2 = null;
            this.address_3 = null;
        }
        app.InscriptionsComponent.prototype.ngOnDestroy=function(){
            
        }
})(window.app || (window.app = {}));