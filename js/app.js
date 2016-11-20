var map;
var places = [{
      placeName : "Paesano's Pizza",
      position : {lat: 44.762806, lng: -85.616607},
      description : "Best pizza in town!",
      hours : "11am to 11pm",
      id : null,
    },{
      placeName : "The Chef's In",
      position : {lat: 44.7637009, lng: -85.6315601},
      description : "Sandwiches that are grilled to perfection.",
      hours : "11am to 11pm",
      id : null,
    },{
      placeName : "Dino's Pizza",
      position : {lat: 44.7597975, lng: -85.6133319},
      description : "Pizza open 24/7!.",
      hours : "24/7",
      id : null,
    },{
      placeName : "Poppycocks",
      position : {lat: 44.763916, lng: -85.6224569},
      description : "Great for dates!",
      hours : "11am to 11pm",
      id : null,
    },{
      placeName : "7 Monks Taproom",
      position : {lat: 44.7631081, lng: -85.6241574},
      description : "The place to grab a beer.",
      hours : "12 to 12pm",
      id : null,
    },{
      placeName : "Thats'sa Pizza: Munson Avenue",
      position : {lat: 44.763553, lng: -85.5888974},
      description : "Best located pizza to the High School.",
      hours : "11am to 9pm",
      id : null,
    },{
      placeName : "Mancino's Pizza And Grinders",
      position : {lat: 44.7873822, lng: -85.6382344},
      description : "Big fancy boats!",
      hours : "24/7",
      id : null,
    },{
      placeName : "Red Ginger",
      position : {lat: 44.7642706, lng: -85.6192659},
      description : "Sushi spot!",
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


var ViewModel = function() {
  var self = this;

  //Make the model array into a knockout observable array.
  self.placeLocation = ko.observableArray(places);

  //This stores the data in the input box into an observable string.
  self.filter = ko.observable('');

  //Loop over all model data elements and give them a marker
  places.forEach(function(place) {
    var name = place.placeName;
    var position = place.position;
    var description = place.description;
    var hours = place.hours;
    var id = place.id;
    marker = new google.maps.Marker({
      map: map,
      position: position,
      title: name,
      description: description,
      animation: google.maps.Animation.DROP,
    })

    //push new marker to the array of markers
  self.placeLocation().marker = marker;


    //add click listener to open window for this marker
  marker.addListener('click', function() {
    self.openInfoWindow(this, infoWindow);

    /* Yelp API Authentification using OAuth.
    This structure was adopted from the template provided in the Udacity Forums
    by the Udacity Coach MarkN. */
    function nonce_generate() {
      return (Math.floor(Math.random() * 1e12).toString());
    }

    var yelpUrl = 'https://api.yelp.com/v2/search?term=' + marker.title;
    var yelpKey	= 'P5cIq5VC4PHcZAv7rQvXUg';
    var yelpSecret = 'Jtd-Kf37xI4sR5HN_OMgyUBrEGw';
    var yelpToken	= 'N3DQ9X1GfyNQO2AS21j1NHWRlTNp-oI6';
    var yelpTokenSecret	= 'gyI1qeCST5mySeGGYRHfxrgyNig';

    var parameters = {
      oauth_consumer_key : yelpKey,
      oauth_token	: yelpToken,
      oauth_signature_method	: "hmac-sha1",
      oauth_timestamp	: Math.floor(Date.now() / 1000),
      oauth_nonce	: nonce_generate(),
      oauth_version : '1.0',
      callback : 'cb',
      term: 'restaurants',
      location: 'Traverse+City+Michigan+USA',
    };

    var encodedSignature = oauthSignature.generate('GET', yelpUrl, parameters, yelpSecret, yelpTokenSecret);
    parameters.oauth_signature = encodedSignature;

    var settings = {
      url : yelpUrl,
      data : parameters,
      chache : true,
      dataType : 'jsonp',
      success : function(results) {
        var yelpUrls;
        var yelpSnippets;
        var yelpStars;
        var response = results.businesses[0];
        response.url !== undefined ? yelpUrls = '<a href=' + response.url +  ' target="_blank">Read more</a>' : yelpUrls = '';
        response.snippet_text !== undefined ? yelpSnippets = response.snippet_text : yelpSnippets = 'No restaurant description available';
        response.rating_img_url_large !== undefined ? yelpStars = '<img src="' + response.rating_img_url_large + '"/>' : yelpStars = 'No restaurant rating available';
        contentString = '<div id="info-window"><h3>' + marker.title + '</h3><p>' + yelpStars + '</p><p>' + yelpSnippets + yelpUrls + '</p><p><span class="label">' + marker.cuisine + '</span><p></div>';
        infoWindow.open(map, marker);
        infoWindow.setContent(contentString);
      },
      fail : function(results) {
        contentString = '<div id="info-window"><h3>Yelp load has failed.</h3></div>';
        infoWindow.open(map, marker);
        infoWindow.setContent(contentString);
      },
    }
    $.ajax(settings);

    }) // close of mark listener.
  });  // close of for loop.

  //Creates an infoWindow for each marker that was made above.
  self.openInfoWindow = function(marker, infoWindow) {
    if (infoWindow.marker != marker) {
      infoWindow.marker = marker;
//      infoWindow.setContent('<div><p>' + marker.title + '</p> <p>' + marker.description + '</p> </div>');
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
};

//make a function to filter the list!
  self.filterList = ko.computed(function() {
    return ko.utils.arrayFilter(self.placeLocation(), function(myPlace) {
      var matched = myPlace.placeName.toLowerCase().indexOf(self.filter().toLowerCase()) >= 0;
      myPlace.marker.setVisible(matched);
      return matched;
    })
  })

}
