const fs = require('fs');

fs.readFile('./restaurants.json', 'utf-8', (err, jsonStr) => {
    if (err) {
        console.log('Error occured on read file');
        return;
    }
    try {
        const restaurants = JSON.parse(jsonStr);
        let newData = '';
        restaurants?.forEach(element => {
            const obj = {
                _index: 'restaurants',
                _id: element._id.$oid,
                _source: {
                    id: element._id.$oid,
                    name: element.name,
                    address: element.address,
                    current_status: element.current_status,
                    opening_time: element.opening_time,
                    closing_time: element.closing_time
                }
            };

            newData += JSON.stringify(obj) + '\n';
        });
        fs.writeFile("./restaurant.json", newData, (err) => {
            if (err) {
                console.log('Error occured on write file');
                return;
            }
            try {
                console.log('success: ', jsonStr);
            } catch (error) {
                console.log('write error: ', error);
            }
        })
    } catch (error) {
        console.log('error: ', error);
    }
})