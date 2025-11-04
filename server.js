const http = require('http');
const url = require('url');
const API_KEY = "ce2a732f5a0e14956b8daece0587a76a";

const server = http.createServer(async(req,res)=>{
    if(req.url.startsWith('/api/weather') && req.method === 'GET'){
        const parsedUrl = url.parse(req.url,true);
        const city = parsedUrl.query.city;
        if(!city){
            res.writeHead(400,{ 'Content-Type':'application/json' });
            res.write(JSON.stringify({ error: 'City parameter is required.' }));
            res.end();
            return;
        }
        const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if(!response.ok){
            res.writeHead(404,{ 'Content-Type':'application/json' });
            res.write(JSON.stringify({ error: 'City not found.' }));
            res.end();
            return;
        }
        const weatherInfo = {
            city : data.name,
            temperature : data.main.temp + "°C",
            feels_like : data.main.feels_like + "°C",
            weather : data.weather[0].description,
            humidity : data.main.humidity + "%",
            wind_speed : data.wind.speed + " m/s"
        };
        res.writeHead(200,{ 'Content-Type':'application/json' });
        res.write(JSON.stringify(weatherInfo));
        res.end();
    } else{
        res.writeHead(404,{ 'Content-Type':'application/json' });
        res.write(JSON.stringify({ error: ' Route Not Found' }));
        res.end();
    }

});

server.listen(3000,()=>{
    console.log("Server running at http://localhost:3000/api/weather?city=CityName");
});