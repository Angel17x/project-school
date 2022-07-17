var domain="localhost:5500";
var base="http://"+domain+"/";
function getDomain(){
	return domain;
}
function doLogout(){
	localStorage.clear();
	sessionStorage.clear();
}
function getApi(){
	return "http://localhost:5500/api/";
}
function getEnlace(){
	return "deegle_auth";
}

function getPaguetodoId(){
	return "dfb8aca9-5259-4582-ad81-9ffe0ae75ad3"
}
function redirectUri(){
	return encodeURIComponent(redirectUriBase());
}
function redirectUriBase(){
	return base+"init";
}


