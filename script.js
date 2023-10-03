const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const grantAccessContainer = document.querySelector(".grantlocatin-contaienr");
const formcontainer = document.querySelector(".form-contaienr");
const loadingcontaienr = document.querySelector(".loading-container");
const userinfo = document.querySelector(".user-info-container");
const apiErrorContainer = document.querySelector(".api-error-container");


let currentTab = userTab;
let API_KEY = "21734753dc54e8c0d4e48fc8969f2f81";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    }
    else{
        return;
    }

    if(!formcontainer.classList.contains("active")){
        grantAccessContainer.classList.remove("active");
        userinfo.classList.remove("active");    
        formcontainer.classList.add("active");
        
    }

    else{
        formcontainer.classList.remove("active"); 
        userinfo.classList.remove("active");
        apiErrorContainer.classList.remove("active");
        getfromSessionStorage();
    } 
}


userTab.addEventListener("click",()=>{ 
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});


function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
   
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");

 async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingcontaienr.classList.add("active");

   try{
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      loadingcontaienr.classList.remove("active");
      userinfo.classList.add("active");

      renderWeatherInfo(data);
   } 
   catch(err){
    // abhi karn hai
    
   }
}

function renderWeatherInfo(weatherInfo) {
    

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} ℃`;


   windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
   humidity.innerText = `${ weatherInfo?.main?.humidity}%`;
   cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}


function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
        
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantbtn = document.querySelector("[data-grantbtn");
grantbtn.addEventListener("click",getLocation);


const searchinput = document.querySelector("[data-seachinput]");
const searchbtn = document.querySelector("#btn");

btn.addEventListener("click",(e) =>{
    e.preventDefault()
let cityName = searchinput.value;

if(cityName === " ")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
        searchinput.value = " ";
})

async function fetchSearchWeatherInfo(city) {
    loadingcontaienr.classList.add("active");
    userinfo.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    apiErrorContainer.classList.remove("active");
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        if (!data.sys) {
            console.log(!data.sys);
            throw data;
            
          }
        
        loadingcontaienr.classList.remove("active");
        userinfo.classList.add("active");
        renderWeatherInfo(data);

       
    } catch(error) {
        console.log(`erorr ayaya hai sir ji` , error.message)
       loadingcontaienr.classList.remove("active");
    apiErrorContainer.classList.add("active");
    }
   
}