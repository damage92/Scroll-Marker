(function() {


if (window.top == window) {

	var prefs;
	var marker;
	var active = "false";
	var init = new Init();

	opera.extension.addEventListener('message', on_message, false);
	window.addEventListener('DOMContentLoaded', function(){init.loaded()}, false);
		
	//not on a timer!
	window.opera.addEventListener('BeforeEvent.mousewheel', on_mouse_wheel, false);

}


function Init() {

	this.c_load = false;

	this.loaded = function() {
		this.c_load = true;
		this.start();
	}

	this.start = function() {
	
		if ((prefs != undefined) && this.c_load && active == "true")
			marker = new Marker();

	}

	this.stop = function() {
		marker.destructor();
	}

}


function on_message(event) {

	message = event.data;

	if (message.title != undefined) {
	
		switch (event.data.title) {
		
		case "status":
		
			if (active != message.data) {
				active = message.data;
				if (message.data == "true") init.start();
				else init.stop();
			}


		break;

		case "status_request":
			opera.source.postMessage({title: "status", value: active});
		break;

		case "prefs":

			//read prefs
			prefs = {};
			for (opt in message.data)
				prefs[opt] = message.data[opt]
				
			//set usable prefs values
			prefs.time = prefs.time*1000;
			prefs.trasp = 1-(prefs.trasp/100);

			//apply new prefs
			if (marker != undefined) marker.apply_prefs();
			else init.start();

		break;


		}
	}

}

//events
function on_scroll_al(e) {
	marker.on_scroll_al(e);
}

function on_scroll_tb() {
	marker.on_scroll_tb();
}

function on_scroll_b() {
	marker.on_scroll_b();
}

function on_scroll_t() {
	marker.on_scroll_t();
}

function on_hide_timer() {
	marker.on_hide_timer();
}

function on_reset_timer() {
	marker.on_reset_timer();
}

function on_click() {
	marker.hide();
}

function on_key_press(e) {
	marker.scroll_input = e.keyCode;
}

function on_mouse_wheel() {

	try {marker.scroll_input = 0;}
	catch(e){}
}

function on_resize() {
	marker.main_div.setAttribute("width", document.documentElement.clientWidth);
	marker.draw_line();
}

function Marker() {

	this.apply_prefs = function() {
	
		//apparence
		this.main_div.setAttribute("height", prefs.height + "px");
		this.main_div.style.opacity = prefs.trasp;
		this.main_div.style.background = prefs.color;
		
		//hide on click
		if (prefs.hide_click == "true")
			document.addEventListener("click", on_click, false);
		else
			document.removeEventListener("click", on_click, false);

		//hide timer
		if (prefs.time_ch == "true")
			this.launch_hide_timer = function() {this.hide_timer = setTimeout(on_hide_timer, prefs.time)};
		else
			this.launch_hide_timer = function() {};
					
	
		//set mode
		document.removeEventListener("scroll", on_scroll_al);
		document.removeEventListener("scroll", on_scroll_t);
		document.removeEventListener("scroll", on_scroll_b);
		document.removeEventListener("scroll", on_scroll_tb);

		switch (prefs.mode) {
			case "always":
				document.addEventListener("scroll", on_scroll_al, false);
			break;	
	
			case "top_bott":	
				document.addEventListener("scroll", on_scroll_tb, false);
			break;	
	
			case "top":
				document.addEventListener("scroll", on_scroll_t, false);
			break;
	
			case "bottom":
				document.addEventListener("scroll", on_scroll_b, false);
			break;
		}
		
		this.draw_line();

	}


	this.draw_line = function() {
		
		//draw line and arrows
		width = document.documentElement.clientWidth;
		context = this.main_div.getContext("2d");
		context.clearRect(0, 0, width, prefs.height);

		/*
		col = "#";
		for (i=1; i<6; i=i+2) {
			c = parseInt(prefs.color.substr(i, 2), 16);
			c = Math.floor(c - c/2);
			col += (c.toString(16).length == 1 ? "0" : "") + c.toString(16);
		}
		*/

		context.fillStyle = "#060606";

		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(prefs.height, prefs.height/2);
		context.lineTo(0, prefs.height);
		context.fill();


		context.beginPath();
		context.moveTo(width, 0);
		context.lineTo(width - prefs.height, prefs.height/2);
		context.lineTo(width, prefs.height);
		context.fill();

		if (prefs.line_type == 1) {
			context.fillRect(prefs.height, prefs.height/2, width - prefs.height*2, 1);
		} else if (prefs.line_type == 0) {
			for (i = prefs.height; i < width - prefs.height; i = i - (-20))
				context.fillRect(i, prefs.height/2, 10, 1);
		}


	}
	
	this.hide = function() {
		this.main_div.style.visibility = "hidden";
	}

	this.show = function() {
		this.main_div.style.left = window.scrollX + "px";
		this.main_div.style.visibility = "visible";	
	}


	this.on_hide_timer = function() {
	
		this.hide_timer = 0;
		this.hide();
		
	}
	
	this.on_reset_timer = function() {
	
		this.reset_timer = 0;
		this.set_limits();
	}

	this.set_limits = function () {
		this.bottom_limit = window.innerHeight + window.scrollY + prefs.height/2;
		this.top_limit = window.scrollY - prefs.height/2;
	}


	this.on_scroll_tb = function() {

		clearTimeout(this.reset_timer);
		this.reset_timer = setTimeout(on_reset_timer, this.reset_time);
		
		this.on_scroll_check_bottom();
		this.on_scroll_check_top();
	}

	
	this.on_scroll_t = function () {

		clearTimeout(this.reset_timer);
		this.reset_timer = setTimeout(on_reset_timer, this.reset_time);

		this.on_scroll_check_top();
	}

	this.on_scroll_b = function () { 

		clearTimeout(this.reset_timer);
		this.reset_timer = setTimeout(on_reset_timer, this.reset_time);

		this.on_scroll_check_bottom();
	}


	this.on_scroll_check_top = function () {

		if (window.scrollY == 0) {

			this.main_div.style.top = this.top_limit+"px";
			
			this.show();
			this.set_limits();			
			
			clearTimeout(this.hide_timer);
			this.launch_hide_timer();			
		}

	}

	this.on_scroll_check_bottom = function () {

		if (window.scrollY + window.innerHeight == document.documentElement.scrollHeight) {

			this.main_div.style.top = this.bottom_limit+"px";
			
			this.show();
			this.set_limits();
			
			clearTimeout(this.hide_timer);
			this.launch_hide_timer();			
		}
	}
		

	this.on_scroll_al = function(e) {

		if (this.last_scrollY == window.scrollY) return;

		if (this.key_values.indexOf(this.scroll_input) == -1) {

			if (this.reset_timer == 0) {
	
				if (this.last_scrollY < window.scrollY)
					this.main_div.style.top = this.bottom_limit-prefs.height+"px";
				else
					this.main_div.style.top = this.top_limit+"px";

				this.show();

			}

			//restart timers		
			clearTimeout(this.reset_timer);
			clearTimeout(this.hide_timer);
			this.launch_hide_timer();
			this.reset_timer = setTimeout(on_reset_timer, this.reset_time);
		
		} else this.set_limits();

		this.last_scrollY = window.scrollY;
		
	}


	//Constructor
	
	//make div
	this.main_div = document.createElement("canvas");
	this.main_div.setAttribute("width", document.documentElement.clientWidth);
	this.main_div.style = "z-index:90000; position:absolute; left:0px; top:0px; visibility:hidden;";
	this.apply_prefs();

	document.body.appendChild(this.main_div);

	//initialize variables
	this.reset_time = 2000;
	this.hide_timer = 0;
	this.reset_timer = 0;
	this.scroll_input = 0;
	this.key_values = new Array(32, 33, 34);
	this.set_limits();	
	this.last_scrollY = window.scrollY;

	//connect events
	document.addEventListener('keypress', on_key_press, false);
	document.addEventListener('resize', on_resize, false);

	this.destructor = function() {

		document.removeEventListener('keypress', on_key_press);
		document.removeEventListener('resize', on_resize);

		document.removeEventListener("scroll", on_scroll_al);
		document.removeEventListener("scroll", on_scroll_t);
		document.removeEventListener("scroll", on_scroll_b);
		document.removeEventListener("scroll", on_scroll_tb);

		document.removeEventListener("click", on_click);

		document.body.removeChild(this.main_div);

		delete this;
	}
	
}


}());
