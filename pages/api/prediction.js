const fetch = require('node-fetch');
const FormData = require('form-data');

export default async (req, res)=>{

    try{
        const data = []
        req.on('data', async(datum)=>{
            data.push(datum);
        });

        req.on('end', async()=>{
            const apiUrl = 'http://jhenrycode-vision-1387687315.us-east-1.elb.amazonaws.com:9001/prediction/plant_maturity';

            const buffer = Buffer.concat(data);

            const form = new FormData();
            form.append('image-data', buffer, {
                contentType:'image/png',
                name: 'image-data',
                filename:'default'
            });

            const result = await fetch(apiUrl, {
                method: 'POST',
                body:form
            });

            const prediction = await result.text();
            console.info(`prediction: ${JSON.stringify(prediction)}`);
            res.status(200).json(prediction);
        })

    }catch(e){
        console.error(`an erorr occurred while getting prediction: ${e}`);
        res.status(500).json({message:e});
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}