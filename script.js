let lat
let lng
let country_code
let city

function getLocation(){
    navigator.geolocation.getCurrentPosition(
        (position) => {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            //lat = 40.6667
            //lng = -73.9539
            updateInfo()
        },
        (error) => {
            console.error('Error:', error.message);
  })
}

document.getElementById("location_access").addEventListener("click", ()=>{
    getLocation()
})

async function updateInfo(){
    await updateLocation()
    updateCountry()
    updateCity()
}


async function updateLocation(){
    const map = document.getElementById("map")
    map.src = `https://maps.google.com/maps?q=${lat},${lng}&z=${15}&output=embed`

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        const json = await response.json()
        const data = json.address
        console.log(data)

        const container = document.querySelector(".location")
        container.querySelector("#street_name").textContent = data.road
        container.querySelector("#district_name").textContent = data.suburb
        container.querySelector("#city_name").textContent = data.city
        container.querySelector("#country_name").textContent = data.country
        container.querySelector("#coordinates").textContent = lat + ", " + lng
        container.querySelector("#postal_code").textContent = "ფოსტის კოდი: " + data.postcode

        country_code = data.country_code
        city = data.city.toLowerCase()

    } catch (error){
        console.log(error)
    }
}

async function updateCountry() {
     try {
        const response = await fetch(`https://countries.dev/alpha/${country_code.toUpperCase()}`)
        const json = await response.json()
        const data = json
        console.log(data)

        const container = document.querySelector(".country")
        container.querySelector("#country_name").textContent = data.name + " / " + data.nativeName
        container.querySelector("#population").textContent = "მოსახლეობა: " + data.population
        container.querySelector("#area").textContent = "ფართობი: " + data.area + " კმ2"
        container.querySelector("#capital").textContent = "დედაქალაქი: " + data.capital
        container.querySelector("#country_code").textContent = "ქვეყნის კოდი: " + data.alpha2Code
        container.querySelector("#calling_code").textContent = "სატელეფონო კოდი: " + data.callingCodes[0]
        container.querySelector("#timezone").textContent = "timezone: " + data.timezones[0]
        container.querySelector("img").src =  data.flags.png

    } catch (error){
        console.log(error)
    }
}

async function updateCity() {
     try {
        const response = await fetch(`http://api.geonames.org/searchJSON?q=Tbilisi&maxRows=1&username=nika1`)
        const json = await response.json()
        const data = json
        console.log(data)

        const container = document.querySelector(".city")

    } catch (error){
        console.log(error)
    }
}