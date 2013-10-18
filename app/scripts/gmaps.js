/*global require*/
'use strict';

define('gmaps', ['async!https://maps.google.com/maps/api/js?key=AIzaSyCba6XRxc1HVooCU_usiGEccZfxa5Tjt2Y&sensor=false'],
function(){
    return window.google.maps;
});
