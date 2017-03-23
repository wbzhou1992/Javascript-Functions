
//事件相关函数
var EventUtil = {

    addHandler: function(element, type, handler){
        if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    
    getButton: function(event){
        if (document.implementation.hasFeature("MouseEvents", "2.0")){
            return event.button;
        } else {
            switch(event.button){
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4: return 1;
            }
        }
    },
    
    getCharCode: function(event){
        if (typeof event.charCode == "number"){
            return event.charCode;
        } else {
            return event.keyCode;
        }
    },
    
    getClipboardText: function(event){
        var clipboardData =  (event.clipboardData || window.clipboardData);
        return clipboardData.getData("text");
    },
    
    getEvent: function(event){
        return event ? event : window.event;
    },
    
    getRelatedTarget: function(event){
        if (event.relatedTarget){
            return event.relatedTarget;
        } else if (event.toElement){
            return event.toElement;
        } else if (event.fromElement){
            return event.fromElement;
        } else {
            return null;
        }
    
    },
    
    getTarget: function(event){
        return event.target || event.srcElement;
    },
    
    getWheelDelta: function(event){
        if (event.wheelDelta){
            return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
        } else {
            return -event.detail * 40;
        }
    },
    
    preventDefault: function(event){
        if (event.preventDefault){
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

    removeHandler: function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },
    
    setClipboardText: function(event, value){
        if (event.clipboardData){
            event.clipboardData.setData("text/plain", value);
        } else if (window.clipboardData){
            window.clipboardData.setData("text", value);
        }
    },
    
    stopPropagation: function(event){
        if (event.stopPropagation){
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }

};
//工厂模式创建XHR对象，SimpleXhrFactory取得引用
var SimpleXhrFactory=(function(){
	var standard={createXhrObject:function(){
		return new XMLHttpRequest();
		}
	};
	var activeXNew={createXhrObject:function(){
		return new ActiveXObject('Msxml2.XMLHTTP');
		}
	};
	var activeXOld = {
		createXhrObject: function(){
			return new ActiveXObject('Microsoft.XMLHTTP');
		}
	};
	var testObject;
	try{
		testObject = standard.createXhrObject();
		return testObject;
	}
	catch(e){
		try{
			testObject = activeXNew.createXhrObject();
			return testObject;
		}
		catch(e){
			try{
				testObject = activeXOld.createXhrObject();
			}
			catch(e){
				throw new Error('No XHR object found in this environment.')
			}
		}
	}
})()


//去除字符串空格，创建一个对象包含私有函数
var DataParser = (function(){
	var whitespaceRegex= /\s+/;

	function stripWhitespace(str){
		return str.replace(whitespaceRegex,'');
	}
	function stringSplit(str,delimeter){
		return str.split(delimeter);
	}
	return {
		stringToArray:function(str,delimeter,stripWS){
			if(stripWS){
				str = stripWhitespace(str);
			}
			var outputArray = stringSplit(str,delimeter);
			return outputArray;
		}
	}
})()

//$函数，模仿jQuery的元素选择器，返回元素引用
function $(){
	var elements = [];
	for(var i = 0,len = arguments.length;i < len;++i){
		var element = arguments[i];
		if(typeof element === 'string'){
			element = document.getElementById(element);
		}
		if(arguments.length === 1){
			return element;
		}
		elements.push(element);
	}
	return elements;
}

//添加级联方法
(function(){
	function _$(els){
		this.elements = [];
		for(var i = 0,len = els.length;i < len;++i){
			var element = els[i];
			if(typeof element === 'string'){
				element = document.getElementById(element);
			}
			this.elements.push(element);
		}
	}
	_$.prototype = {
		each: function(fn){
			for(var i = 0,len = this.elements.length;++i){
				fn.call(this,this.elements);
			}
			return this;
		},
		setStyle: function(prop,val){
			this.each(function(el){
				el.style[prop] = val;
			});
			return this;
		},
		show: function(){
			var that = this;;
			this.each(function(el){
				that.setStyle('display','block');
			});
			return this;
		},
		addEvent: function(type,fn){
			var add = function(el){
				if(window.addEventListener){
					el.addEventListener(type,fn,false);
				}
				else if(window.attachEvent){
					el.attachEvent('on'+type,fn);
				}
			};
			this.each(function(el){
				add(el);
			});
			return this;
		}
	};
	window._$ = function(){
		return _$(arguments);
	};
})()


$(window).addEvent('load',function(){
	$('test-1','test-2').show().
	setStyle('color','red').
	addEvent('click',function(e){
		$(this).setStyle('color','green');
	});
});

//语法糖
Function.prototype.method = function(name,fn){
	this.prototype[name] = fn;
	return this;
}

(function(){
	function _$(els){
		//...
	}
	_$.method('addEvent',function(type,fn){
		//...
	});
	window.installHelper = function(scope,interface){
		scope[interface] = function(){
			return new _$(arguments);
		} 
	};
})();
installHelper(window,'$');
$('example').show();



var Interface = function(name,methods){
	if(arguments.length != 2){
		throw new Error("Interface constructor called with"+arguments.length+"arguments,but excepted exactly 2.");
	}
	this.name = name;
	this.methods = [];
	for(var i = 0,len = arguments.length;i < len;i++){
		if(typeof methods[i] !== 'string'){
			throw new Error("Interface construstor exceptes methods names to be"+"passed in as a string.");
		}
		this.methods.push(methods[i]);
	}
};

Interface.ensureImplements = function(object){
	if(arguments.length < 2){
		throw new Error("Function Interface ensureImplements called with"+argumensts.length+"arguments,but expected at least 2.");

	}
	for(var i = 1,len = arguments.length;i < len;i++){
		var interface = arguments[i];
		if(interface.constructor !== Interface){
			throw new Error("Function Interface.ensureImplements excepts arguments"+"two adn above to be instances of Interface.")

		}
		for(var j = 0,methodsLen = interface.methods.length;j < methodsLen;j++){
			var method = interface.methods[j];
			if(!object[method] || typeof method !== function){
				throw new Error("Function Interface.ensureImplements: object"+"dose not implement the"+interface.name+"interface.method"+method+"was not found.")
			}
		}
	}
};



var Composite = new Interface('Composite',['add','remove','getChild']);
var FormItem = new Interface('FormItem',['save']);

var Composite = function(id,method,action){

}

function addForm(formInstance){
	Interface.ensureImplements(formInstance,Composite,FormItem);
}

/*AjaxHandler interface*/
var AjaxHandler = new Interface('AjaxHandler',['request','createXhrObject']);
/*SimpleHandler class*/
var SimpleHandler = function(){};

SimpleHandler.prototype = {
	request: function(method,url,callback,postVars){
		var xhr = this.createXhrObject();
		xhr.onreadystatechange = function(){
			if(xhr.readyState !== 4) return;
			if(xhr.status === 200){
				callback.success(xhr.responseText,xhr.responseXML);
				callback.failure(xhr.status);
			};
			xhr.open(method,url,true);
			if(method !== 'POST') postVars = null;
			xhr.send(postVars);

		}
	},
		createXhrObject: function(){
			var methods = [
				function(){return new XMLHttpRequest();},
				function(){return new ActiveXObject('Msxml2.XMLHTTP');},
				function(){return new ActiveXObject('Microsoft.XMLHTTP');}
			];
			for(var i = 0,len = methods.length;i < len;i++){
				try{
					methods[i]();
				}
				catch(e){
					continue;
				}
				this.createXhrObject = methods[i];
				return methods[i];
			}
			throw new Error("SimpleHandler: Could not create an XHR object.");
	}
};


//shallow copy of an object
if(typeof Object.create !== 'function'){
	Object.create = function(o){
		var F = function(){};
		F.prototype = o;
		return new F();
	}
}

var anothre_stooge = Object.create(stooge);

//deep copy

function copyObj(obj){
	var str,newObj = obj.constructor === "object" ? {} : [];
	if(typeof obj !== "object"){
		return;
	}
	else if(window.JSON){
		str = JSON.stringify(obj);
		newObj = JSON.parse(str);
	}
	else{
		for(var i in obj){
			newObj[i] = typeof obj === "object" ? copyObj(obj[i]) : obj[i];
		}
	}
	return newObj;
}

function bind(fn,obj){
	return function(){
		return fn.apply(obj,arguments);
	}
}

function outputAttributes(elemnet){
	var len,i,attrName,attrValue,pairs = new Array();
	for(i=0,len=elemnet.attributes.length;i<len;i++){
		attrName = element.attributes[i].nodeName;
		attrValue = element.attributes[i].nodeValue;
		pairs.push(attrName+"="+"\"attrValue\"");
	}
	return pairs.join(" ");
}


function loadStyleString(css){
	var style = document.createElement("style");
	style.type = "text/css";
	try{
		style.appendChild(document.createTextNode(css));

	}
	catch(ex){
		style.styleSheet.cssText=css
	}
	var head  = document.getElementsByTagName("head")[0];
	head.appendChild(style);

}

