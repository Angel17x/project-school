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
            this.password;
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
        app.StudentsComponent.prototype.getStorage=function(data){
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
        
        app.StudentsComponent.prototype.ngOnDestroy=function(){
            
        }
})(window.app || (window.app = {}));