import { createReadStream, createWriteStream } from "fs";
import { parse } from "csv-parse";

const readerStream = createReadStream('./restaurants.csv');
const createStream = createWriteStream('./restaurant.json');

const parser = parse({
    delimiter: ',', from_line: 2, cast: true
});

readerStream.pipe(parser)
    .on('data', (row) => {
        console.log('row: ', row);
        const obj = {
            _index: 'restaurants',
            _id: row[0],
            _source: {
                id: row[0],
                name: row[1],
                address: row[2],
                users: JSON.parse(row[3]),
                opening_time: row[4],
                closing_time: row[5],
                current_status: row[6],
            }
        };
        console.log(obj);
        createStream.write(JSON.stringify(obj) + "\n");
    }).on('end', () => {
        console.log('finished');
    }).on('error', (error) => {
        console.log('error: ', error);
    });

// readerStream.on('data', (chunk) => {
//     const jsonData = JSON.stringify(chunk);
//     console.log('jsonData: ', jsonData);
//     const value = JSON.parse(jsonData);
//     console.log('value: ', value);
// });