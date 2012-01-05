// ==UserScript==
// @name          Scroll Marker 0.5
// @description	  A marker that helps you to read long pages
// @author        Damage92
// @homepage      http://stylecode.altervista.org
// @exclude http://acid3.acidtests.org/
// ==/UserScript==

(function() {

function get_value(par) {return parseInt(par.split("px")[0])}

if (window.top == window) {

	var prefs = new Prefs();
	var marker;

	opera.extension.addEventListener('message', get_msg, false);
	init_time = setTimeout(check_init, 100);

}

function init() {

//	screen = new Screen();
	page = new Page();

	marker = new Marker();
	decide_activation();
}

function check_init() {
	if ((prefs.msg != undefined) && (document.body != null)) init();
	else init_time = setTimeout(check_init, 500);
}


function Prefs() {
	//default values
	this.back_port;

	this.opa = "0.5";
	this.time = "1500";
	this.time_ch = "1";
	this.mode = "always";
	this.active = "true";
	this.listed = "true";
//	this.black = "false";
	this.hide_click = "true";
	this.color = "#b0b0b0";
	this.height = "30";
	this.line_type = "1";
	
} 

function decide_activation(old_active, old_listed) {

	//decide if activate or deactivate the marker
	var old_status;
	var new_status;

	if (prefs.active != "list") new_status = prefs.active;
	else prefs.listed == "true" ? new_status = "true" : new_status = "false";

	if (old_active != "list") old_status = old_active;
	else old_listed == "true" ? old_status = "true" : old_status = "false";

	if (old_status != new_status)
		new_status == "true" ? marker.activate_marker() : marker.deactivate_marker();

}


function get_msg(event) { //called from the message event handler

	if (event.data.title != undefined) {
		switch (event.data.title) {
		case "status":
			prefs.msg = event.data.data;

			//copy old prefs
			var old_active = prefs.active;
			var old_listed = prefs.listed;

			//set new prefs
			if (prefs.msg[3]) prefs.active = prefs.msg[3];
			if (prefs.msg[4]) prefs.listed = prefs.msg[4];

			decide_activation(old_active, old_listed);

		break;
	
		case "prefs":

			prefs.msg = event.data.data;
			prefs.back_port = event.source;

			if (prefs.msg[0]) prefs.opa = (100 - prefs.msg[0]) / 100;
			if (prefs.msg[1]) prefs.time = prefs.msg[1] * 1000;
			if (prefs.msg[2]) prefs.mode = prefs.msg[2];
//			if (prefs.msg[3]) prefs.active = prefs.msg[3];
//			if (prefs.msg[4]) prefs.listed = prefs.msg[4];
//			if (prefs.msg[5]) prefs.black = prefs.msg[5];
			if (prefs.msg[6]) prefs.hide_click = prefs.msg[6];
			if (prefs.msg[7]) prefs.color = prefs.msg[7];
			if (prefs.msg[8]) prefs.height = prefs.msg[8];
			if (prefs.msg[9]) prefs.time_ch = prefs.msg[9];			
			if (prefs.msg[10]) prefs.line_type = prefs.msg[10];

			if (prefs.time_ch == "false") prefs.time = 0;

			if (marker != undefined) marker.apply_prefs();

		break;


		}

	}


}


function Marker() {

	this.hdl_ref_aspect = function() {marker.ref_aspect();}
	this.ref_aspect = function() {
//		screen.ref_width();
//		screen.ref_height();

		var width = window.innerWidth;
		this.cont.style.width = width - this.border + "px";
		this.line.style.width = width - 61 + "px";
		this.ref_pos();
	}

/* not sure if this is nice

	this.hdl_hide_fade = function() {marker.hide_fade()}
	this.hide_fade = function() {
		if (parseFloat(this.back.style.opacity) > this.fade_target) {
			this.back.style.opacity = this.back.style.opacity - 0.1;
			this.fade_time = setTimeout(this.hdl_hide_fade, 50);
		} else if (parseFloat(this.back.style.opacity) == 0)
			this.cont.style.display = "none";
	}
*/

	this.hdl_ref_pos = function() {marker.ref_pos();}
	this.ref_pos = function() {

		this.ref_pos_time = 0;
		this.old_scrollY = window.scrollY;
//		this.back.style.opacity = this.back.style.opacity / 2;
//		this.fade_target = 0.2;
//		this.hide_fade();

		this.bottom_pos = window.innerHeight + window.scrollY - (prefs.height/2) + "px";
		this.top_pos = window.scrollY - (prefs.height/2) + "px";
	}

	this.set = function() {
		if (window.scrollY > this.old_scrollY) this.cont.style.top = this.bottom_pos;
		else this.cont.style.top = this.top_pos;

	}

	//hide marker
	this.hdl_hide = function() {marker.hide()}
	this.hide = function() {

		clearTimeout(this.hide_time);
		this.hide_time = 0;
//		clearTimeout(this.fade_time);
//		this.fade_target = 0;
//		this.hide_fade();
		this.cont.style.display = "none";
	}

	this.check_space = function(e) {
		if ( (e.keyCode == "32") || (e.keyCode == "33") || (e.keyCode == "34")  ) marker.hdl_ref_pos();
	}
/*
	this.hdl_wheel = function(e) {marker.wheel(e)}
	this.wheel = function(event) {
		console.log(event.target);
	}
*/

	//check if the marker should be viewed
	this.hdl_show = function(e) {marker.show(e)}
	this.show = function(event) {

		this.cont.style.left = window.scrollX + (this.border/2) + "px";

		//check if there is a vertical scroll
		if ( (this.old_y != window.scrollY)) {

			this.old_y = window.scrollY;

			//determine if view the marker
			if ( ((prefs.mode == "bottom" || prefs.mode == "top_bott") && (page.get_height() == (window.scrollY + window.innerHeight))) || ( (prefs.mode == "top" || prefs.mode == "top_bott") && (window.scrollY == 0 ) && (this.old_scrollY != 0) ) || (prefs.mode == "always")) {

				//when scrolling stops, show the marker				
				if ( (prefs.mode == "always" && this.ref_pos_time == 0) || (prefs.mode == "bottom" || prefs.mode == "top_bott" || prefs.mode == "top") ) {
					this.set();

					this.cont.style.display = "inline";
					this.back.style.opacity = prefs.opa;
				}

				//hide timeout
				if (this.hide_time != 0) clearTimeout(this.hide_time);
				if (prefs.time != 0) this.hide_time = setTimeout(marker.hdl_hide, parseInt(prefs.time));	


			}

			//ref_pos timeout
			if (this.ref_pos_time != 0) clearTimeout(this.ref_pos_time);
			this.ref_pos_time = setTimeout(marker.hdl_ref_pos, 2000);

		}

	}

	//deactivate totally the marker
	this.hdl_deactivate_marker = function() {marker.deactivate_marker()}
	this.deactivate_marker = function() {

		window.removeEventListener('scroll', this.hdl_show, false);
		window.removeEventListener('resize', this.hdl_ref_aspect, false);
		if (prefs.hide_click == "true")
			window.removeEventListener('click', this.hdl_hide, false);
	}

	//activate totally the marker
	this.hdl_activate_marker = function() {marker.activate_marker()}
	this.activate_marker = function() {

		this.ref_pos();
		window.addEventListener('scroll', this.hdl_show, false);
		window.addEventListener('resize', this.hdl_ref_aspect, false);
		if (prefs.hide_click == "true")
			window.addEventListener('click', this.hdl_hide, false);

		if (prefs.mode == "bottom" || prefs.mode == "top" || prefs.mode == "top_bott")
			window.addEventListener('keypress', this.check_space, false);
	}


	this.apply_prefs = function() {
		this.back.style.opacity = prefs.opa;
		this.back.style.height = prefs.height + "px";
		this.back.style.background = prefs.color;
		
		this.cont.style.height = prefs.height + "px";
		
		this.line.style.height = prefs.height + "px";
		this.line.style.backgroundPosition = "0px " + prefs.height/2 + "px";
	
		this.arr_sx.style.top = (prefs.height-14)/2 + "px";	
		this.arr_dx.style.top = (prefs.height-14)/2 + "px";

		this.line.style.display = "inline";
		switch (prefs.line_type) {

			case "0":
	 		this.line.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAABCAYAAADn9T9+AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sHFAkwI6uGJpoAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAFUlEQVQI12NgQICHDAwM/9HwfZgkAG0xBb1uGg3+AAAAAElFTkSuQmCC)";
			break;

			case "1":
		 	this.line.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sHFAktBh/unsEAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAADUlEQVQI12NgYGD4DwABBAEApOCsMQAAAABJRU5ErkJggg==)";
			break;

			case "2":
			this.line.style.display = "none";
			break;

		}
		
		if (prefs.hide_click == "true")
			window.addEventListener('click', this.hdl_hide, false);

		if (prefs.mode == "bottom" || prefs.mode == "top" || prefs.mode == "top_bott")
			window.addEventListener('keypress', this.check_space, false);		
	
		window.removeEventListener('click', this.hdl_hide, false);
		if ( (prefs.hide_click == "true"))
			window.addEventListener('click', this.hdl_hide, false);
	
	
	}

	this.cont = document.createElement('div');
	this.cont.setAttribute("id", "ScrollMarker");
	this.cont.style = "top:0px; position:absolute; visibility:visible; display:none; opacity:1; padding:0px;";
//	this.cont.style.height = prefs.height + "px";
	this.cont.style.zIndex=90000;

	this.back = document.createElement('div');
	this.back.style = "width:100%; position:absolute; padding:0px;";
//	this.back.style.height = prefs.height + "px";
//	this.back.style.background = prefs.color;
//	this.back.style.opacity = prefs.opa;


	this.line = document.createElement('img');
	this.line.style = "padding:0px; background-repeat: repeat-x;";
//	this.line.style.height = prefs.height + "px";
//	this.line.style.backgroundPosition = "0px " + prefs.height/2 + "px";

	this.arr_sx = document.createElement('img');
	this.arr_sx.style = "float:left; margin-left:5px; padding:0px; height:14px; position:relative";
//	this.arr_sx.style.top = (prefs.height-14)/2 + "px";
	this.arr_sx.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sHEQg4DYmVO1gAAACKSURBVCjPlZJBDsMgDATHUfoq+1vwiPAt86oeyKGlsihtyEq+oJ1dS0ZUNfFSAai1cqUNON7TgNRaYzZRoqptEpbdvYyPIvIXmsId2i7WP8zsE9rX3FiQmTUzSx1cgkJrWm4atd/wyh0oA8Xdl5sEIAIi8hP6So932mfmMT0CHcrxwwIPd3/OzF0nu6o/8Ob0XsUAAAAASUVORK5CYII=";

	this.arr_dx = document.createElement('img');
	this.arr_dx.style = "float:right; margin-right:5px; padding:0px; height:14px; position:relative;";
//	this.arr_dx.style.top = (prefs.height-14)/2 + "px";
	this.arr_dx.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sHEQg4G31BjgkAAABoSURBVCjPlZJLCsAwCAXHfk7lrQrpIXovT9VFukkhEEz07QQno0EhEFXdgQ0oQD2I5QKev5CFofTNU8hrdiFVratZJfr6AGUA2jemI9l9BpOZCXCnTFGru9PMKsHbK+EzasBpZm8H8wFkchttrR+4nAAAAABJRU5ErkJggg==";

	this.apply_prefs();

	this.cont.appendChild(this.back);
	this.back.appendChild(this.arr_sx);
	this.back.appendChild(this.arr_dx);
	this.back.appendChild(this.line);
	document.body.appendChild(this.cont);

	this.hide_time = 0;
	this.ref_pos_time = 0;
	this.old_y = window.scrollY;
	this.border = 20;

	this.ref_aspect();

}

/*
function Screen() {

	this.ref_height = function () {
		this.screen_size.style.height = "100%";
		res = this.screen_size.offsetHeight;
		this.screen_size.style.height = "0px";
		
		this.height = res;
	}

	this.ref_width = function () {
		this.screen_size.style.width = "100%";
		res = this.screen_size.offsetWidth;
		this.screen_size.style.width = "0px";
		
		this.width = res;
	}

	this.get_height = function() {return this.height;}
	this.get_width = function() {return this.width;}
	
	this.screen_size = document.createElement("div");
	this.screen_size.style="position:absolute;width:0px;height:0px;left:0px;top:0px;visibility:hidden;z-index:0";
	document.body.appendChild(this.screen_size);
	
	this.ref_width();
	this.ref_height();
	this.width = this.get_width();
	this.height = this.get_height();

}
*/
function Page() {

	this.get_height = function () {
		return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, 
		document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
	}

	this.get_width = function () {
		return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth,
		document.documentElement.offsetWidth, document.body.clientWidth, document.documentElement.clientWidth);
	}

}

}());
