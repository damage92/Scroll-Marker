var options_desc = {
	trasp: {
		type: "range_count",
		min: 0,
		max: 90,
		step: 1,
		title: "Trasparency",
		desc: "marker's trasparency Level",
		def_value: 50
	},
	
	color: {
		type: "color",
		title: "Color",
		desc: "marker color (if black, internal line is invisible)",
		def_value: "#b0b0b0"
	},
	
	height: {
		type: "range_count",
		min: 14,
		max: 50,
		step: 1,
		units: "pixel",		
		title: "Height",
		desc: "marker's height in pixels",
		def_value: 30
	},
	
	line_type: {
		type: "select",
		items: new Array(
			{name:"Dotted", value:"0"},
			{name:"Solid", value:"1"},
			{name:"No line", value:"2"}			
		),
		title: "Line type",
		desc: "type of line drawn into the marker",
		def_value: "0"
	},
	
	time_ch: {
		type: "checkbox",
		title: "Hide",
		desc: "hide the marker after some seconds",
		def_value: true,
		dependencies: new Array(
			{value: false, obj: "time"}		
		)
	},
	
	hide_click: {
		type: "checkbox",
		title: "Hide on click",
		desc: "hide the marker when click on page",
		def_value: true,
		dependencies: new Array()	
	},
	
	mode: {
		type: "select",
		items: new Array(
			{name:"Always", value:"always"},
			{name:"Only on page bottom", value:"bottom"},
			{name:"Only on page top", value:"top"},
			{name:"On page bottom and top", value:"top_bott"}
		),
		title: "Mode",
		desc: "when the marker should appear",
		def_value: "always"
	},

	black: {
		type: "checkbox",
		title: "Blacklist",
		desc: "the list is blacklist instead whitelist",
		def_value: false,
		dependencies: new Array()	
	},

	button: {
		type: "checkbox",
		title: "Show button",
		desc: "show the toolbar button to open the popup",
		def_value: true,
		dependencies: new Array()	
	},
	
	time: {
		type: "number",
		title: "Timeout",
		desc: "seconds after the marker disappear",
		def_value: "1.5",
		step: 0.5
	}

};

/*
	color: {
		type: "color",
		title: "Bars color",
		desc: "color of the bars",
		def_value: "#000000"	
	},

	b_color: {
		type: "color",
		title: "Border color",
		desc: "bar's border color",
		def_value: "#ffffff"
	},

	size: {
		type: "range_count",
		min: 3,
		max: 10,
		step: 1,
		title: "Size",
		desc: "the size of the bars",
		def_value: 5
	},
	
	alternative: {
		type: "checkbox",
		title: "Solve slow scrolling",
		desc: "use this option if you are experiencing slow scrolling",
		def_value: false,
		dependencies: new Array()	
	},
	
	auto_hide: {
		type: "checkbox",
		title: "Auto hide",
		desc: "auto hide the scrollbars after a few seconds",
		def_value: true,
		dependencies: new Array(
			{value: false, obj: "only_over"}
		)
	},
	
	only_over: {	
		type: "checkbox",
		title: "View bar only when mouse is over it",
		desc: "",
		def_value: false,
		dependencies: new Array()
	}
	
*/
