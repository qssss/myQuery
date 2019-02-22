function MQuery(vArg) {
	this.elements = [];
	switch(typeof vArg) {
		case 'function':
			addEvent(window,'load',vArg)
			break;
		case 'string':
			switch(vArg[0]) {
				case '#': //id
					var node = document.getElementById(vArg.substring(1));
					this.elements.push(node);
					break;
				case '.': //className
					var nodes = document.getElementsByClassName(vArg.substring(1));
					this.elements = nodes;
					break;
				case '[': //Name [name=]
					var nodes = document.getElementsByName(vArg.substring(6,vArg.length-1));
					this.elements = nodes;
					break;
				default: //tagName
					var nodes = document.getElementsByTagName(vArg);
					this.elements = nodes;
					break;
			}
			break;
		case 'object': //body、document
			this.elements.push(vArg);
			break;
		default:
			console.log('error');
			break;
	}
	return this;
}

MQuery.prototype.click = function(fn) {
	for(var i = 0;i < this.elements.length;i++) {
		addEvent(this.elements[i],'click',fn)
	}
	return this;
}

MQuery.prototype.mouseover = function(fn) {
	for(var i = 0;i < this.elements.length;i++) {
		addEvent(this.elements[i],'mouseover',fn)
	}
	return this;
}

MQuery.prototype.mouseout = function(fn) {
	for(var i = 0;i < this.elements.length;i++) {
		addEvent(this.elements[i],'mouseout',fn)
	}
	return this;
}

MQuery.prototype.hover = function(fn1,fn2) {
	for(var i = 0;i < this.elements.length;i++) {
		addEvent(this.elements[i],'mouseover',fn1);
		addEvent(this.elements[i],'mouseout',fn2);
	}
	return this;
}

MQuery.prototype.css = function() {
	switch(arguments.length) {
		case 2:
			var attr = arguments[0];
			var value = arguments[1];
			for(var i = 0; i < this.elements.length; i++){
				this.elements[i].style[attr] = value;
			}
			break;
		case 1:
			switch(typeof arguments[0]) {
				case 'string':
					for(var i = 0; i < this.elements.length; i++){
						return this.elements[i].style[arguments[0]];
					}
					break;
				case 'object':
					var json = arguments[0];
					for(var i = 0;i < this.elements.length;i++) {
						for(var j in json) {
							this.elements[i].style[j] = json[j];
						}
					}
					break;
			}
			break;
	}
	return this;
}

MQuery.prototype.on = function() {
	switch(arguments.length) {
		case 1:  //对象 给相同的事件添加不同的方法
			var json = arguments[0];
			for(var i = 0;i < this.elements.length;i++) {
				for(var j in json) {
					addEvent(this.elements[i],j,json[j]);
				}
			}
			break;
		case 2:  //添加单个点击事件
			var json = arguments[0].split(' ');
			switch(json.length) {
				case 1:
					for(var i = 0;i < this.elements.length;i++) {
						addEvent(this.elements[i],arguments[0],arguments[1])
					}
					break;
				default:
					for(var i = 0;i < this.elements.length;i++) {
						for(var j in json){
							addEvent(this.elements[i],json[j],arguments[1]);
						}
					}
					break;
			}
			break;
		case 3:  //事件委托
			for(var i = 0;i < this.elements.length;i++) {
				var arg1 = arguments[0];
				var arg2 = arguments[1];
				var arg3 = arguments[2];
				addEvent(this.elements[i], arg1, function(e) {
					var e = e || window.event;
					var target = e.target || e.srcElement;
					console.log(target)
					//event.target.tagName
					if(target.tagName.toLowerCase() == arg2) {
						arg3.call(target);
					}
				})
			}
			break;
		default:  // 给不同的事件添加不同的方法
			console.log('error');
			break;
	}
	return this;
}

MQuery.prototype.toggle = function() {
	_arguments = arguments;
	for(var i = 0;i < this.elements.length;i++) {
		addToggele(this.elements[i]);
	}
	return this;
}

function addToggele(obj) {
	var count = 0;
	addEvent(obj,'click',function() {
		_arguments[count++ % _arguments.length].call(obj);
	})
	return this;
}

MQuery.prototype.eq = function(index) {
	return $(this.elements[index]);
}

function $(vArg) {
	return new MQuery(vArg);
}

// 通过事件监听 完成事件的绑定
function addEvent(obj, eventType, func){
	if(obj.addEventListener){
		obj.addEventListener(eventType, func, false);
	}else{
		obj.attachEvent("on" + eventType, func);
	}
}