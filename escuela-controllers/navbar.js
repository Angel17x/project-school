(function(app) {
	app.NavbarComponent =
		ng.core.Component({
		selector: 'navbar',
		templateUrl: 'views/navbar.html',
		inputs:["name"],
		})
		.Class({
			constructor: [ng.router.Router,ng.router.ActivatedRoute,app.AppCallService,
        	function(router,active,service) {
					this.router=router;
					this.active=active;
					this.service=service;
        	}]
		});
        app.NavbarComponent.prototype.ngOnInit=function(){
   
				const showNavbar = (toggleId, navId, bodyId, headerId) =>{
				const toggle = document.getElementById(toggleId),
				nav = document.getElementById(navId),
				bodypd = document.getElementById(bodyId),
				headerpd = document.getElementById(headerId)
				
				// Validate that all variables exist
				if(toggle && nav && bodypd && headerpd){
				toggle.addEventListener('click', ()=>{
				// show navbar
				nav.classList.toggle('show2')
				// change icon
				toggle.classList.toggle('bx-x')
				// add padding to body
				bodypd.classList.toggle('body-pd')
				// add padding to header
				headerpd.classList.toggle('body-pd')
				})
				}
				}
				
				showNavbar('header-toggle','nav-bar','body-pd','header')
				
				/*===== LINK ACTIVE =====*/
				const linkColor = document.querySelectorAll('.nav_link')
				
				function colorLink(){
				if(linkColor){
				linkColor.forEach(l=> l.classList.remove('active'))
				this.classList.add('active')
				}
				}
				linkColor.forEach(l=> l.addEventListener('click', colorLink))
				
				 // Your code to run since DOM is loaded and ready
        }
		app.NavbarComponent.prototype.logout=function(){
            this.service.clearStorage();
			this.router.navigate(['/login']);
        }
        app.NavbarComponent.prototype.ngOnDestroy=function(){
            
        }
})(window.app || (window.app = {}));