var tafelsApp = angular.module('tafelsApp', []);
var TIMEOUT = 4;
function sortNumber(a, b) {
    return a - b;
}

tafelsApp.controller('TafelsCtrl', function ($scope, $timeout) {
	$scope.gestart = false;
	$scope.bedenktijd = 4;
	$scope.counterTimeout = null;
	$scope.tafels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	$scope.gekozenTafels = [];
	$scope.mogelijkeAntwoorden = []; 
	
	$scope.vermenigvuldigtal = 0;
	$scope.vermenigvuldiger = 0;
	$scope.correctAntwoord = 0;

	$scope.selecteerTafel = function(tafel) {
	    var idx = $scope.gekozenTafels.indexOf(tafel);
	
	    if (idx > -1) {
	    	$scope.gekozenTafels.splice(idx, 1);
	    }
	    else {
	    	$scope.gekozenTafels.push(tafel);
	    }		
	};
	
	$scope.start = function() {
		if ($scope.gekozenTafels.length > 0) {
			$scope.gestart = true;
			$scope.aantalSommen = 0;
			$scope.aantalGoed = 0;
			$scope.aantalFout = 0;
			$scope.nieuweSom();			
		}
	};

	$scope.nieuweSom = function() {
		$scope.counter = $scope.bedenktijd;
    	$scope.pauzetekst = 'Pauzeer';
		$scope.antwoord = '?';
		$scope.antwoordClass = 'label-warning';
		$scope.toonCorrectAntwoord = false;
		$scope.vermenigvuldigtal = Math.floor((Math.random() * 10) + 1);
		$scope.vermenigvuldiger = $scope.gekozenTafels[Math.floor(Math.random() * $scope.gekozenTafels.length)];
		$scope.correctAntwoord = $scope.vermenigvuldigtal * $scope.vermenigvuldiger;
		var antwoorden = [$scope.correctAntwoord];
		while (antwoorden.length < 7) {
			var antwoord = Math.floor((Math.random() * ($scope.vermenigvuldiger * 10)) + 1);
			if (antwoord >= $scope.vermenigvuldiger && antwoorden.indexOf(antwoord) == -1) {
				antwoorden.push(antwoord);
			}
		}
		antwoorden.sort(sortNumber)
		$scope.mogelijkeAntwoorden = antwoorden; 	
		$scope.counterTimeout = $timeout($scope.countDown, 1000);
	};
	
	$scope.goed = function() {
		document.getElementById('succesgeluid').play();
		$scope.aantalSommen++;
		$scope.aantalGoed++;	
		$scope.toonCorrectAntwoord = false;
		$scope.antwoordClass = 'label-success';
	};
	
	$scope.fout = function() {
		document.getElementById('foutgeluid').play();
		$scope.aantalSommen++;
		$scope.aantalFout++;
		$scope.toonCorrectAntwoord = true;
		$scope.antwoordClass = 'label-danger';
	};
	
	$scope.countDown = function() {
		$scope.counter--;
		if ($scope.counter == 0) {
			$timeout.cancel($scope.counterTimeout);
			$scope.fout();
			$scope.counter = TIMEOUT;
			$scope.counterTimeout = $timeout($scope.countDownNieuweSom, 1000);
		}
		else {
			$scope.counterTimeout = $timeout($scope.countDown, 1000);
		}
	};
	
	$scope.countDownNieuweSom = function() {
		$scope.counter--;
		if ($scope.counter == 0) {
			$timeout.cancel($scope.counterTimeout);
			$scope.nieuweSom();
		}
		else {
			$scope.counterTimeout = $timeout($scope.countDownNieuweSom, 1000);
		}
	};
	
	$scope.pauze = function() {
		if ($scope.pauzetekst == 'Pauzeer') {
			$timeout.cancel($scope.counterTimeout)
			$scope.pauzetekst = 'Ga verder';
		}
		else {
			$scope.counter = $scope.bedenktijd;
			$scope.pauzetekst = 'Pauzeer';
			$scope.counterTimeout = $timeout($scope.countDown, 1000);
		}
	}
	
	$scope.gekozenAntwoord = function(antwoord) {
		$timeout.cancel($scope.counterTimeout);
		$scope.antwoord = parseInt(antwoord);
		if ($scope.antwoord == $scope.correctAntwoord) {
			$scope.goed();
		}
		else {
			$scope.fout();
		}
		$scope.counter = TIMEOUT;
		$scope.counterTimeout = $timeout($scope.countDownNieuweSom, 1000);
	};
	
	$scope.andereTafels = function() {
		$timeout.cancel($scope.counterTimeout);
		$scope.gestart = false;
	};
});
