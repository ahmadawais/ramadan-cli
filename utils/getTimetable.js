const axios = require('axios');
const cheerio = require('cheerio');

function tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
}

module.exports = async (city) => {
    let data = [];
    try {
        const response = await axios.get(`https://www.urdupoint.com/islam/${city}-ramadan-calendar-sehar-aftar-timing.html`);
        const $ = cheerio.load(response.data);


        let columns = ['no', 'date', 'sehar', 'iftar'];
        let rows = [];

        $("#ramadan_calendar tbody tr").each((index, item) => {
            let row = [];
            let td = $(item).find('td');
            if (td.length > 0) {
                td.each((index, item) => { row.push(($(item).text())); });
                rows.push(row);
            }
        });

        rows.forEach(row => {

            let roza = row.reduce((result, field, index) => {
                result[columns[index]] = field;
                return result;
            }, {})

            roza.sehar = tConvert(roza.sehar);
            roza.iftar = tConvert(roza.iftar);
            roza.no = `#${roza.no}`;
            roza.date = new Date(roza.date).toISOString().substr(0, 10);
            data.push(roza);
        });
        return data;
    } catch (error) {
        return console.log('API is down');
    }
}
