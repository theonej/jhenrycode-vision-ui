const sharp = require('sharp');
const fetch = require('node-fetch');
const FormData = require('form-data');

const mappings = ['juvenile', 'seedlings'];

export default async (req, res)=>{
    try{
        const raw = await getData(req);

        const resized = await sharp(raw)
                                .resize(256, 144)
                                .toBuffer();

        //predictions will be in for [[0.0, 0.8, 0.2]]
        const predictions = await getPrediction(resized);
        
        const imageKey = await saveImage(resized, predictions);

        res.status(200).json({imageKey});
    }catch(e){
        console.error(`an error occurred while getting predictions for image: ${e}`);
        res.status(500).json({message:e});
    }
};

const getPrediction = async (imageBuffer)=>{
    const apiUrl = process.env.PREDICTION_SERVICE_URL;

    const form = new FormData();
    form.append('image-data', imageBuffer, {
        contentType:'image/png',
        name:'image-data',
        filename: 'default'
    });

    const result = await fetch(apiUrl, {
        method:'POST',
        body:form
    });

    const predictionData = (await result.json())[0];

    const predictions = predictionData.map((item, index)=>{
        return {
            "name":mappings[index],
            "value": `${(item * 100)}`
        }
    });

    return predictions;
};

const saveImage = async(imageBuffer, predictions)=>{
    const imageBase64 = imageBuffer.toString('base64');

    const created = new Date();

    const esData = {
        predictions,
        imageBase64,
        created
    };

    const esUrl = `${process.env.ES_CLUSTER_URL}/images/_doc`;

    const result = await fetch(esUrl, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(esData)
    });

    const docInfo = await result.json();

    return docInfo._id;
};

const getData = async(req)=>{
    return new Promise((resolve, reject)=>{
        const data = [];

        req.on('data', async(chunk)=>{
            data.push(chunk);
        });

        req.on('end', async()=>{
            const buffer = Buffer.concat(data);

            resolve(buffer);
        })
    });
};

export const config ={
    api:{
        bodyParser: false
    }
};