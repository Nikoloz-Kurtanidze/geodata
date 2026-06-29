let lat
let lng


function getLocation(){
    navigator.geolocation.getCurrentPosition(
        (position) => {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            updateInfo()
        },
        (error) => {
            console.error('Error:', error.message);
  })
}

document.getElementById("location_access").addEventListener("click", ()=>{
    getLocation()
})

function updateInfo(){
    updateLocation()
}

function updateLocation(){
    console.log(lat, lng)
    const map = document.getElementById("map")
    map.src = `https://maps.google.com/maps?q=${lat},${lng}&z=${15}&output=embed`
}