const errorLabel = document.querySelector("label[for='error-msg']")
const latInp = document.querySelector("#latitude")
const lonInp = document.querySelector("#longitude")
const airQuality = document.querySelector(".air-quality")
const airQualityStat = document.querySelector(".air-quality-status")
const srchBtn = document.querySelector(".search-btn")
const componentsEle = document.querySelectorAll(".component-val")



//  We got api from https://home.openweathermap.org  this is the Api provider which provides Provides current weather conditions for a specific location, including temperature, humidity, wind speed, and more.
const appId = "e6c3f4c19a75664b26de4ffe7b429327" 
const link = "https://api.openweathermap.org/data/2.5/air_pollution"	



// The getUserLocation function is responsible for retrieving the user's current location using the Geolocation API.
// The function starts by checking if the browser supports the Geolocation API by using the condition if (navigator.geolocation). The navigator.geolocation object provides access to the Geolocation API.

// If the browser supports the Geolocation API, it proceeds to call the getCurrentPosition method on the navigator.geolocation object. The getCurrentPosition method is used to asynchronously retrieve the user's current position.

// The getCurrentPosition method takes two callback functions as parameters: onPositionGathered and onPositionGatherError. These functions will be invoked depending on the outcome of the geolocation request.
const getUserLocation = () => { 
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(onPositionGathered, onPositionGatherError)
	} else {
		onPositionGatherError({ message: "Can't Access your location. Please enter your co-ordinates" })
	}
}                               
                                   


// The function starts by checking if the browser supports the Geolocation API by using the condition if (navigator.geolocation). The navigator.geolocation object provides access to the Geolocation API.
// If the browser supports the Geolocation API, it proceeds to call the getCurrentPosition method on the navigator.geolocation object. The getCurrentPosition method is used to asynchronously retrieve the user's current position.
// The getCurrentPosition method takes two callback functions as parameters: onPositionGathered and onPositionGatherError. These functions will be invoked depending on the outcome of the geolocation request.


const onPositionGathered = (pos) => {
	let lat = pos.coords.latitude.toFixed(4), lon = pos.coords.longitude.toFixed(4)

	latInp.value = lat
	lonInp.value = lon
	getAirQuality(lat, lon)
}


// getAirQuality function takes lat and lon as parameters, representing the latitude and longitude coordinates of the location for which you want to retrieve air quality data.
// The fetch function returns a promise that resolves to the server's response. It uses await to pause the execution of the function until the promise is resolved

const getAirQuality = async (lat, lon) => {
	const rawData = await fetch(`${link}?lat=${lat}&lon=${lon}&appid=${appId}`).catch(err => {
		onPositionGatherError({ message: "Something went wrong. Check your internet conection." })
		console.log(err)
	})
	const airData = await rawData.json()
	setValuesOfAir(airData)
	setComponentsOfAir(airData)
}

const setValuesOfAir = airData => {
	const aqi = airData.list[0].main.aqi
	console.log(aqi)
	let airStat = "", color = ""

	// Set Air Quality Index
	airQuality.innerText = aqi

	// Set status of air quality

	switch (aqi) {
		case 1:
			airStat = "Good"
			color = "rgb(19, 201, 28)"
			break
			case 2:
				airStat = "Fair"
				color = "rgb(15, 134, 25)"
				break
			case 3:
				airStat = "Moderate"
				color = "rgb(201, 204, 13)"
				break
			case 4:
				airStat = "Poor"
				color = "rgb(204, 83, 13)"
				break
		case 5:
			airStat = "Very Poor"
			color = "rgb(204, 13, 13)"
			break
		default:
			airStat = "Unknown"
	}

	airQualityStat.innerText = airStat
	airQualityStat.style.color = color
}

const setComponentsOfAir = airData => {
	let components = {...airData.list[0].components}
	componentsEle.forEach(ele => {
		const attr = ele.getAttribute('data-comp')
		ele.innerText = components[attr] += " μg/m³"
	})
}

const onPositionGatherError = e => {
	errorLabel.innerText = e.message
}

srchBtn.addEventListener("click", () => {
	getAirQuality(parseFloat(latInp.value).toFixed(4), parseFloat(lonInp.value).toFixed(4))
})

getUserLocation()
