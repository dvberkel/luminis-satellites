(function(){
	var DocumentTree = function(name) {
		var _name = name;
		var _satellites = [];
	
		var performOnSatellites = function(aFunction) {
			for (var index = 0; index < _satellites.length; index++) {
				aFunction(_satellites[index]);
			}
		}
	
		this.add = function(satellite) {
			var body = this;
			satellite.getBody = function(){ return body };
			_satellites.push(satellite);
			return body;
		}
	
		this.accept = function(visitor, upToLevel) {
			if (typeof upToLevel == 'undefined') {upToLevel = -1;}
			visitor.visit(_name);
			if (upToLevel != 0) {
				performOnSatellites(function(satellite){
					satellite.accept(visitor, upToLevel - 1);
				});
			}
		}
	
		this.getBody = function() {
			return this;
		}
	
		this.pass = function(filter) {
			return filter(_name);
		}
	
		this.downTo = function(name, walker) {
			var filter = function(aName) { return aName == name; }
			performOnSatellites(function(satellite){
				if (satellite.pass(filter)) {
					walker.currentRoot(satellite)
				}
			});
		}
	
		this.up = function(walker) {
			walker.currentRoot(walker.currentRoot().getBody());
		}
	};
	window.DocumentTree = DocumentTree;

	var DocumentTreeWalker = function(documentTree) {
		var _walker = this;
		var _currentRoot = documentTree
		var _observers = [];
	
		var notify = function(direction) {
			for (var index = 0; index < _observers.length; index++) {
				var observer = _observers[index];
				if (observer[direction]) {
					observer[direction](_walker);
				}
			}
		}
	
		this.currentRoot = function(aDocumentTree) {
			if (typeof aDocumentTree != 'undefined') {
				_currentRoot = aDocumentTree;
			}
			return _currentRoot;
		}
	
		this.downTo = function(name) {
			_currentRoot.downTo(name, _walker);
			notify("down");
			return _walker;
		}
	
		this.up = function() {
			_currentRoot.up(_walker);
			notify("up");
			return _walker;
		}
	
		this.add = function(observer) {
			_observers.push(observer);
			return _walker;
		}
	}
	window.DocumentTreeWalker = DocumentTreeWalker;
})();

