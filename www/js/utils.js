if (!Array.prototype.has) {
	Array.prototype.has = function (value) {
		return jQuery.inArray(value, this) > -1;
	};
	
	Object.defineProperty(Array.prototype, 'has', {
		enumerable : false,
	});
};

if (!Array.prototype.clear) {
	Array.prototype.clear = function () {
		while(this.length > 0)
			this.pop();
	};
	
	Object.defineProperty(Array.prototype, 'clear', {
		enumerable : false,
	});
};

if(!Number.prototype.formatMoney) {
	Number.prototype.formatMoney = function(c, d, t){
		var n = this, 
	        c = isNaN(c = Math.abs(c)) ? 2 : c, 
	        d = d == undefined ? "." : d, 
	        t = t == undefined ? "," : t, 
	        s = n < 0 ? "-" : "", 
	        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
	        j = (j = i.length) > 3 ? j % 3 : 0;
	   	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 	};
	Object.defineProperty(Number.prototype, 'formatMoney', {
		enumerable : false,
	});
}

if(!Number.prototype.formatNumber) {
	Number.prototype.formatToFixedInteger = function(numberOfDigits){
		var output = this.valueOf() + "";
		for (var i = 1; i < numberOfDigits; i++) {
			if (this < Math.pow(10, i))
				output = "0" + output;
		}
		return output;
	};
	Object.defineProperty(Number.prototype, 'formatToFixedInteger', {
		enumerable : false,
	});
}
