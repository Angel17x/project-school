(function(app) {
	app.CreateEmployeesComponent =
		ng.core.Component({
		  selector: 'create-employees',
		  templateUrl: 'views/create-employees.html'
		})
		.Class({
            constructor: [ng.router.ActivatedRoute,ng.router.Router,app.AppCallService,app.MsgComponent,
                function(active,router,service, msg) {
                    this.active=active;
                    this.router=router;
                    this.service=service;
                    this.msg=msg;
                }
            ]
        });
        app.CreateEmployeesComponent.prototype.ngOnInit=function(){
            this.route = this.active.url._value[0].path;
            this.mensaje = null;
            this.email = null;
            this.password=null;
            
            this.id=null;
            this.nameEmployee=null;
            this.age = null;
            this.workArea = null;

            this.name=null;
            this.type = null;
            this.save = true;
            this.value=false;
            this.listArea = [
                {value: "web_developer", name: "Desarrollador web"},
                {value: "security", name: "Seguridad"},
                {value: "architect", name: "Arquitecto"},
                {value: "graphic_designer", name: "Diseñador gráfico"},
                {value: "counter", name: "Contador"}
            ]
            this.message = "Crear empleado";
            
            this.getStorage(this.service.getStorage('user'));
            this.getData();
        }
       app.CreateEmployeesComponent.prototype.getData=function(){
        if(this.active.hasOwnProperty('queryParams')){
            if(this.active.queryParams!=null || this.active.queryParams!=undefined){
                if(this.active.queryParams.hasOwnProperty('_value')){
                    if(this.active.queryParams._value!=null || this.active.queryParams._value!=undefined){
                            if(this.active.queryParams._value.hasOwnProperty('id')){
                                if(this.active.queryParams._value.id!=null || this.active.queryParams._value.id!=undefined){
                                    this.id = this.active.queryParams._value.id;    
                                    this.message = "Actualizar empleado";                                
                                }
                            }
                            if(this.active.queryParams._value.hasOwnProperty('name')){
                                if(this.active.queryParams._value.name!=null || this.active.queryParams._value.name!=undefined){
                                    this.nameEmployee = this.active.queryParams._value.name;
                                }
                            }
                            if(this.active.queryParams._value.hasOwnProperty('age')){
                                if(this.active.queryParams._value.age!=null || this.active.queryParams._value.age!=undefined){
                                    this.age = this.active.queryParams._value.age;
                                }
                            }
                            if(this.active.queryParams._value.hasOwnProperty('work_area')){
                                if(this.active.queryParams._value.work_area!=null || this.active.queryParams._value.work_area!=undefined){
                                    this.workArea = this.active.queryParams._value.work_area;
                                }
                            }
                        
                    }else{
                        if(this.active.queryParams._value)
                        this.router.navigate(['/home']);
                    }
                }else{
                    if(this.active.queryParams._value)
                    this.router.navigate(['/home']);
                }
            }else{
                this.router.navigate(['/home']);
            }
        }
       }
       app.CreateEmployeesComponent.prototype.done=function(){
        if(this.nameEmployee == null || this.nameEmployee == undefined){
            this.mensaje = "Debe ingresar el nombre del empleado"
            this.msg.warning();
            return;
        }
        if(this.age == null || this.age == undefined){
            this.mensaje = "Debe ingresar la edad del empleado"
            this.msg.warning();
            return;
        }
        if(this.workArea == null || this.workArea == undefined){
            this.mensaje = "Debe seleccionar el área del empleado"
            this.msg.warning();
            return;
        }
        this.callServicesEmployee();
       }
       app.CreateEmployeesComponent.prototype.callServicesEmployee=function(){
            let request = null;
            let json = {};
            let mensajeAll = "Error al procesar la petición";

            if(this.route === "create-employee"){

                json.name = this.nameEmployee;
                json.age = this.age;
                json.work_area = this.workArea;
                
                request = this.service.callServicesHttp('create-employee',null,json);
            }
            if(this.route === "update-employee"){

                let querys = '/'+this.id;

                json.name = this.nameEmployee;
                json.age = this.age;
                json.work_area = this.workArea;
                
                request = this.service.callServicesHttp('update-employee', querys, json);
            }
            request.subscribe(data => {
                console.log(data)
                if(data == null || data == undefined){
                    this.mensaje = "Error al procesar la petición";
                    this.msg.error();
                    return;
                }
                if(data.hasOwnProperty('status_http')){
                    if(data.status_http == 200){
                        if(this.route === "update-employee"){
                            this.mensaje = "Empleado actualizado con éxito";
                            this.msg.info()
                        }
                        if(this.route === "create-employee"){
                            this.mensaje = "Empleado creado con éxito";
                            this.msg.info()
                        }
                    }
                }
            }, err => {
                this.mensaje = this.service.processError(err, mensajeAll);
                this.msg.error()
            })
       }
        app.CreateEmployeesComponent.prototype.callServicesUser=function(user){
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
        app.CreateEmployeesComponent.prototype.verifyUser = function(data){
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
        app.CreateEmployeesComponent.prototype.getStorage=function(data){
            if(data==null || data==undefined){
                this.service.clearStorage();
                this.router.navigate(['/login']);
                return;
            }
            let user = JSON.parse(this.service.getStorage('user'));

            this.email = user?.email;
            this.password = user?.password;
            this.name = user?.name;
            this.type = user?.type;

            if(!(user==null || user == undefined || user == "")){
                this.callServicesUser(user);
            }else{
                this.service.clearStorage();
                this.router.navigate(['/login']);
                return;
            }
        }
        
        app.CreateEmployeesComponent.prototype.ngOnDestroy=function(){
            
        }
        app.CreateEmployeesComponent.prototype.message=function(message, name){
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
        app.CreateEmployeesComponent.prototype.clean=function(){
            this.nameEmployee=null;
            this.workArea = null;
            this.age=null;
        }
})(window.app || (window.app = {}));