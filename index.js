import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const apiKey = 'cd912186aba59f948ce522ca72832181'; // You might want to keep the API key in an environment variable for security.

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/post', async (req, res) => {
    const location = req.body.value;

    try {
        const latlong = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${apiKey}`);
        const maindata=await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latlong.data[0].lat}&lon=${latlong.data[0].lon}&units=metric&appid=cd912186aba59f948ce522ca72832181`);
        console.log(maindata.data);
        let tempvalue=maindata.data.main.temp;
        let humidity=maindata.data.main.humidity;
        console.log(tempvalue);
        let windspeed=maindata.data.wind.speed;
        let clouds=maindata.data.weather[0].description;
        console.log(clouds);
        if (latlong.data.length > 0) {
            const { lat, lon, country } = latlong.data[0];

            res.render('index', {
                country: country,
                tempareture: tempvalue,
                humidity: humidity,
                windspeed : windspeed
            });
        } else {
            res.render('index', {
                country: 'Not Found',
                tempareture: "Not found",
                humidity : "Not found",
                windspeed :"not found"
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.render('index', {
            country: 'Error occurred',
        });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

