(function(app) {
    app.AppCallService = ng.core.
    Injectable().Class({
        constructor: [ng.http.Http, app.LoadingServiceComponent, ng.router.Router, function(http, loading,router) {
            this._url =getApi();
            this.http = http;
            this.loading = loading;
			this.timeout="18000";
			this.enlace=getEnlace();
			this.router=router;
        }]
	});
	app.AppCallService.prototype.callServices=function(path, method, parameters, head, auth, format_out,format_in,show,time){
		let url=this._url;
		let headers=new Headers();
		if(!(head==null || head==undefined || head=="")){
			headers=head;
		}
		var parametros="";
		if (path == undefined || path == '' || path == null) {
            url = '';
        } else {
            url = url+path;
        }
		if(!(format_in==null || format_in==undefined || format_in=="")){
			headers['Content-Type']=format_in.trim().toLowerCase();
		}
		if(auth){
			headers['Authorization']='bearer '+this.getAccessToken();
		}
		if(format_in==null && !auth){
			headers=null;
		}
		if(format_in=="multipart/form-data"){
			delete headers['Content-Type'];
			parametros=parameters;
		}else{
			if (!(parameters == undefined || parameters == null || parameters == '')) {
				if (jQuery.isEmptyObject(parameters)) {
					parametros = parameters;
				}else {
					if(format_in=="application/json"){
						parametros = JSON.stringify(parameters);
					}else{
						parametros = parameters;
					}
				}
			}
		}
		if(show){
			this.loading.showPleaseWait();
		}
		let peticion=null;
        switch (method) {
            case 'GET':{
                if(headers!=null){
					peticion = this.http.get(url,{headers});
				}else{
					peticion = this.http.get(url);
				}
            }break;
            case 'POST':{
				if(headers==null){
					 peticion = this.http.post(url, parametros,null);
				}else{
					 peticion = this.http.post(url, parametros,{headers});
				}
            }break;
            case 'PUT':{
                peticion = this.http.put(url, parametros,{headers});
            }break;
            case 'DELETE':{
				if(headers!=null){
					peticion = this.http.delete(url,{headers});
				}else{
					peticion = this.http.delete(url);
				}
            }break;
            default:{
                return null;
            }
        }
		if(time==null){
			time=this.timeout;
		}
		let resultado = peticion.timeout(time, new Error('TIMEOUT'))
		.map(res => {
            this.loading.hidePleaseWait();
			return this.processResponse(format_out,res);
        });
		return resultado;
	}
	
	app.AppCallService.prototype.processResponse=function(format,res){
		var status=null;
		if(res.hasOwnProperty('status')){
           status=res.status;
			if(status==202 || status=="202" || status=="403" || status==403){
				var aux = res.json();
				if(aux.hasOwnProperty("message")){
					if(!(aux.message==undefined || aux.message==null || aux.message=="")){
						if(aux.message=="UNAUTHORIZED_SESSION" || aux.message=="SESSION_CLOSED" 
						|| aux.message=="SESSION_EXPIRED" || aux.message=="SESSION_NOT_FOUND" || aux.message=="INVALID_AUTHORIZATION" ){
							doLogout();
							this.router.navigate(["/login"]);
						}
					}
				}	
			}else{
				if(status==401 || status==403){
					this.router.navigate(["/login"]);
				}
			}
        }
		if (format == "JSON") {
            try {
				var status=null;
				if(res.hasOwnProperty('status')){
                    status=res.status;
                }
                res = res.json();
				try{
                    var valor=Array.isArray(res);
					if(valor){
                        var aux=res;
                        res={
                            body:aux,
                            status_http:status
                        };
                    }else{
                        res.status_http=status; 
                    }
                }catch(err1){
                    console.log('Error al procesar',err1);
                }
                res.status_http=status;
				return res;
			} catch (err) {
                res = {
					status_http:500,
					message:"ERROR",
                    typeSys: 'ERROR',
                    value: 'NOT_JSON'
                };
                return res;
            }
        }else {
			if(format=="CSV"){
				 try {
					res = res._body;
					return res.toString();
				} catch (err) {
					res = "Error";
					return res;
				}
			}else{
				console.log('res',res);
				res=res._body.blob();
				return res
			}
           
        }
	}
	app.AppCallService.prototype.callServicesHttp=function(ser,querys,param){
		let request=null;
		switch(ser){
			case 'login':{
				request=this.callServices('project-naza/db.json',"GET",param,null,false,"JSON",null,true,null);
				return request;
			}break;
		}
    }
	app.AppCallService.prototype.setStorage=function(name, value){
		localStorage.setItem(name, JSON.stringify(value));
		return;
	}
	app.AppCallService.prototype.getStorage=function(name){
		let value = localStorage.getItem(name);
		return value;
	}
	app.AppCallService.prototype.clearStorage=function(){
		localStorage.clear();
		return;
	}
})(window.app || (window.app = {}));