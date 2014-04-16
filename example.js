/* 	Idea for UI for topics
	
	JSON object it could take in:
	
	{	"topic":	{
			"name":					"Engine",
			"votes":				240,
			"reported":				false,
			"childTopicsURL": 		"http://forum.com/Engine/Children",
			"topicQuestionsURL": 	"http://forum.com/Engine/Questions"
		}
	}
	
	and then on a vote it could send
	
	{	"topic":	{
			"name":					"Engine",
			"votes":				241,
		}
	}
	
	or on a report it could send
	
	{	"topic":	{
			"name":					"Engine",
			"reported":				true,
		}
	}
					
*/
angular.module('forum', ['ui.bootstrap']);

// constructor for 'topic' objects
function topic(name,votes){
	this.name = name;
	this.votes = votes;
	this.voteModel = 'Neutral';
	this.prevVote = 'Neutral'
	this.background = 'well well-lg';
}

// main angular controller
function TopicCtrl($scope, $modal) {
	
	// some example topics
	var topic1 = new topic("Powertrain",2);
	var topic2 = new topic("Exterior",2);
	var topic3 = new topic("Interior",2);
	
	// add topics to page scope, sort them
  	$scope.items = [topic1,topic2,topic3];
  	sortScope($scope);
  	
  	// handle vote on item
  	$scope.vote = function (item) {
  		applyVote($scope,item);
  	}
  	
  	// handle reporting an item
  	$scope.report = function (item){
	  	if(item.background=='well well-lg'){
	  		item.background = 'well well-lg-warn';
	  	}
	  	else{
	  		item.background = 'well well-lg';
	  	}
	  }
  	
  	// modal window for adding a new topic
  	$scope.openModal = function () {
		var modalInstance = $modal.open({
		  templateUrl: 'myModalContent.html',
		  controller: ModalInstanceCtrl,
		  resolve: {
			items: function () {
			  return $scope.items;
			}
		  }
		});

		modalInstance.result.then(function (newTopicName) {
		  $scope.items.push(new topic(newTopicName,0));
		}, function () {
		  console.log('modal closed');
		});
	  };
	  
	  
}

// angular controller for modal (used to add new topic)
var ModalInstanceCtrl = function ($scope, $modalInstance, items) {
  
	  $scope.ok = function (text) {
		if(text==""){
			 $scope.alerts.push({msg: "Another alert!"});
		}
		$modalInstance.close(text);
	  };

	  $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	  };
  
	  $scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	  };
};

// when an item is voted on, change its vote count accordingly
function applyVote($scope,item){
	if(item.voteModel=="Up"){
		if(item.prevVote=="Down"){
			item.votes += 2;
		}
		else{
			item.votes += 1;
		}
	}
	else if(item.voteModel=="Down"){
		if(item.prevVote=="Up"){
			item.votes -= 2;
		}
		else{
			item.votes -= 1;
		}
	}
	else{
		if(item.prevVote=="Down"){
			item.votes += 1;
		}
		else{
			item.votes -= 1;
		}
	}
	
	item.prevVote = item.voteModel;
	sortScope($scope);
}

// sort the scope items from most votes to least votes
function sortScope(scope){
	scope.items.sort(	function(a,b){
									if(a.votes < b.votes){
										return 1;
									}
									if(a.votes > b.votes){
										return -1;
									}
									return 0;
								});
}