var map;
var places = [{
      placeName : "Paesano's",
      position : {lat: 44.762806, lng: -85.616607},
      description : "Best pizza in town!",
      hours : "11am to 11pm",
      id : null,
    },{
      placeName : "TCC High School",
      position : {lat: 44.768949, lng: -85.588067},
      description : "Home of the Trojans.",
      hours : "11am to 11pm",
      id : null,
    },{
      placeName : "Thirlby Field",
      position : {lat: 44.753432, lng: -85.627959},
      description : "My sports complex.",
      hours : "Fridat, 7pm to 11pm",
      id : null,
    },{
      placeName : "Poppycocks",
      position : {lat: 44.763916, lng: -85.6224569},
      description : "Great for dates!",
      hours : "11am to 11pm",
      id : null,
    },{
      placeName : "7 Monks",
      position : {lat: 44.7631081, lng: -85.6241574},
      description : "The place to grab a beer.",
      hours : "12 to 12pm",
      id : null,
    },{
      placeName : "Creepy State Hospital",
      position : {lat: 44.755217, lng: -85.6450499},
      description : "Scary stories get told here",
      hours : "24/7",
      id : null,
    },{
      placeName : "Clinch Park Marina",
      position : {lat: 44.7664838, lng: -85.6226803},
      description : "Big fancy boats!",
      hours : "24/7",
      id : null,
    },{
      placeName : "Hickory Hills",
      position : {lat: 44.7690972, lng: -85.6671996},
      description : "Go huck disks or flips!",
      hours : "10am to 10pm",
      id : null,
    }]

//----ViewModel ---- //

    function initMap() {
      //API map constructor that creates new map.
      map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 44.763916, lng: -85.6224569},
            zoom: 14,
            mapTypeId: 'hybrid',
        });

    //  this.positions = ko.observable(places)[0];
      var bounds = new google.maps.LatLngBounds();
      infoWindow = new google.maps.InfoWindow();
      ko.applyBindings(new ViewModel());


    //    bounds.extend(ViewModel.placeLocation()[i].marker[i])
    //    map.fitBounds(bounds);
    //    ViewModel.placeLocation()[i].setMap(map);

    }

var ViewModel = function(){
  var self = this;

  //Make the model array into a knockout observable array.
  self.placeLocation = ko.observableArray(places);

  //This stores the data in the input box into an observable string.
  self.filter = ko.observable('');

  //Loop over all model data elements and give them a marker
  for (i=0; i<places.length; i++) {
    var name = places[i].placeName;
    var position = places[i].position;
    var description = places[i].description;
    var hours = places[i].hours;
    var id = places[i].id;
    marker = new google.maps.Marker({
      map: map,
      position: position,
      title: name,
      description: description,
      animation: google.maps.Animation.DROP,
      id: i,
    })

    //push new marker to the array of markers
    self.placeLocation()[i].marker = marker;


    //add click listener to open window for this marker
    marker.addListener('click', function() {
      self.openInfoWindow(this, infoWindow);
    })

  }

  //Creates an infoWindow for each marker that was made above.
  self.openInfoWindow = function(marker, infoWindow) {
    if (infoWindow.marker != marker) {
      infoWindow.marker = marker;
      infoWindow.setContent('<div><p>' + marker.title + '</p> <p>' + marker.description + '</p> </div>');
      infoWindow.open(map, marker);
      infoWindow.addListener('closeClick', function() {
        infoWindow.setMarker(null);
      })
      infoWindow.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){
        marker.setAnimation(null);
      }, 720);
    }
  };

  self.setMark = function(clickedItem) {
        self.openInfoWindow(clickedItem.marker, infoWindow)
}

//make a function to filter the list!
  self.filterList = ko.computed(function() {
    return ko.utils.arrayFilter(self.placeLocation(), function(myPlace) {
      var matched = myPlace.placeName.toLowerCase().indexOf(self.filter().toLowerCase()) >= 0;
      myPlace.marker.setVisible(matched);
      return matched;
    })
  })

}
