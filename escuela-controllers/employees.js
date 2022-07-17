(function(app) {
	app.EmployeesComponent =
		ng.core.Component({
		  selector: 'employees',
		  templateUrl: 'views/employees.html'
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
        app.EmployeesComponent.prototype.ngOnInit=function(){
            this.email = null;
            this.password=null;
            this.name=null;
            this.type = null;
            this.listRegister = [];
            this.value=false;
            this.employeeSelected = {};
            this.getStorage(this.service.getStorage('user'));
            this.getEmployees();
        }
        app.EmployeesComponent.prototype.getEmployees = function(){
            let request = null;
            $("#pleaseWait").modal("show");

            request = this.service.callServicesHttp('employees', null, null);
            request.subscribe(data => {
                if(data == null || data == undefined || data == ""){
                    this.service.clearStorage();
                    this.router.navigate(['/login']);
                    return;
                }
                if(data.status_http==200){
					delete data['status_http'];
                    this.listRegister = data?.employees.map(x => this.formattedData(x));      
                }
                $("#pleaseWait").modal("hide");
            },err => {
                $("#pleaseWait").modal("hide");
            })
        }
        app.EmployeesComponent.prototype.formattedData = function(data){
            
            let user = JSON.parse(this.service.getStorage('user'));
            if(user.hasOwnProperty("actions")){
                if(user.actions.length!=0){
                    data.actions = user.actions.flatMap(x => x.value === "CREATE" ? [] : x);
                }
            }
            return data;
        }
        app.EmployeesComponent.prototype.selectAction=function(data, action){
            this.employeeSelected = data;

            const { value } = action
            if(value === "UPDATE"){
                this.router.navigate(["/update-employee"], {queryParams: this.formattedDataSend(data)});
            }
            if(value === "DELETE"){
                $("#modalDelete").modal("show");
            }
        }
        app.EmployeesComponent.prototype.formattedDataSend=function(data){
            let obj = {
                id: data?.id,
                name: data?.name,
                age: data?.age,
                work_area: data?.work_area
            };
            return obj;
        }
        app.EmployeesComponent.prototype.translate2=function(value){
            return translate(value);
        }
        app.EmployeesComponent.prototype.callServicesUser=function(user){
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
        app.EmployeesComponent.prototype.verifyUser = function(data){
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
        app.EmployeesComponent.prototype.getStorage=function(data){
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
        
        app.EmployeesComponent.prototype.ngOnDestroy=function(){
            
        }
        app.EmployeesComponent.prototype.message=function(message, name){
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