(function(app) {
	app.StudentsComponent =
		ng.core.Component({
		  selector: 'students',
		  templateUrl: 'views/students.html'
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
        app.StudentsComponent.prototype.ngOnInit=function(){
            this.email = null;
            this.password=null;
            this.getStorage(this.service.getStorage('user'));
        }
        
        app.StudentsComponent.prototype.callServicesUser=function(user){
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
        
        app.StudentsComponent.prototype.verifyUser = function(data){
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
        app.StudentsComponent.prototype.getStorage=function(data){
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
        
        app.StudentsComponent.prototype.ngOnDestroy=function(){
            
        }
})(window.app || (window.app = {}));