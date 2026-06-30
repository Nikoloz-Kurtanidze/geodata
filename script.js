let lat
let lng
let country_code
let city

function getLocation(){
    navigator.geolocation.getCurrentPosition(
        (position) => {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            //lat = 40.6667 //41.7955 //48.87869 //40.6667
            //lng = -73.9539 //45.0165 //2.3374 //-73.9539
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
    let err = await updateLocation()
    if (err === 0){
        updateCountry()
        updateCity()
        updateWeather()
    } else{
        alert("დაფიქსირდა შეცდომა")
    }
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
        if (Object.hasOwn(data, "city")){
            city = data.city
        }
        else if (Object.hasOwn(data, "village")){
            city = data.village
            container.querySelector("#city_name").textContent = data.village
        }

        return 0

    } catch (error){
        console.log(error)
        return 1
    }
}

async function updateCountry() {
     try {
        const response = await fetch(`https://countries.dev/alpha/${country_code.toUpperCase()}`)
        const json = await response.json()
        const data = json
        console.log(data)

        const container = document.querySelector(".country")
        container.querySelector("#country_name").textContent = data.name + " / " + data.nativeName + " " + data.flag
        container.querySelector("#population").textContent = "მოსახლეობა: " + data.population
        container.querySelector("#area").innerHTML = "ფართობი: " + data.area + " კმ<sup>2</sup>"
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
        const response = await fetch(`http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=nika1`)
        const json = await response.json()
        const data = json.geonames[0]
        console.log(data)

        const container = document.querySelector(".city")
        container.querySelector("#city_name").textContent = data.toponymName
        container.querySelector("#city_type").textContent = data.fcodeName
        container.querySelector("#population").textContent = "მოსახლეობა: " + data.population


        const response2 = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${city}`)
        const json2 = await response2.json()
        const data2 = json2
        console.log(data2)

        container.querySelector("#description").textContent = data2.extract
        if (Object.hasOwn(json2, "originalimage")){
            container.querySelector("img").src =  data2.originalimage.source
            container.querySelector("img").style.visibility = "visible"
        }
        else {
            container.querySelector("img").style.visibility = "hidden"
        }
        
    } catch (error){
        console.log(error)
    }
}

const map = {
    0: { text: "მოწმენდილი ცა", icon: "☀️" },
    1: { text: "უმეტესად მოწმენდილი", icon: "🌤️" },
    2: { text: "ნაწილობრივ ღრუბლიანი", icon: "⛅" },
    3: { text: "მოღრუბლული", icon: "☁️" },
    45: { text: "ნისლი", icon: "🌫️" },
    48: { text: "ჭირხლიანი ნისლი", icon: "🌫️" },
    51: { text: "სუსტი ჟინჟღილი", icon: "🌦️" },
    53: { text: "ზომიერი ჟინჟღილი", icon: "🌦️" },
    55: { text: "ძლიერი ჟინჟღილი", icon: "🌧️" },
    61: { text: "სუსტი წვიმა", icon: "🌦️" },
    63: { text: "ზომიერი წვიმა", icon: "🌧️" },
    65: { text: "ძლიერი წვიმა", icon: "🌧️" },
    71: { text: "სუსტი თოვლი", icon: "🌨️" },
    73: { text: "ზომიერი თოვლი", icon: "🌨️" },
    75: { text: "ძლიერი თოვლი", icon: "❄️" },
    80: { text: "ხანმოკლე წვიმა", icon: "🌦️" },
    81: { text: "ზომიერი ხანმოკლე წვიმა", icon: "🌧️" },
    82: { text: "ძლიერი თავსხმა", icon: "⛈️" },
    95: { text: "ელჭექი", icon: "⛈️" },
    96: { text: "ელჭექი და სეტყვა", icon: "⛈️" },
    99: { text: "ძლიერი ელჭექი და სეტყვა", icon: "⛈️" }
}

async function updateWeather() {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`)
    const json = await response.json()
    const data = json
    console.log(data)

    const container = document.querySelector(".weather")
    container.querySelector("#temperature").textContent = data.current_weather.temperature + data.current_weather_units.temperature
    container.querySelector("#weather").textContent = map[data.current_weather.weathercode].text
    container.querySelector("#icon").textContent = map[data.current_weather.weathercode].icon
}