const fetch = require('node-fetch');
const FormData = require('form-data');
const sharp = require('sharp');

export default async (req, res)=>{

    try{
    
        const raw = await getData(req);

        //resize the image for faster processing
        const resized = await sharp(raw)
            .resize(256, 144)
            .toBuffer();

        //the prediction comes back as an array of results; we only care about the first one
        const predictions = await getPrediction(resized);

        const imageKey = await saveImage(resized, predictions);

        res.status(200).json({imageKey});

    }catch(e){
        console.error(`an erorr occurred while getting prediction: ${e}`);
        res.status(500).json({message:e});
    }
}

const getPrediction = async (imageBuffer)=>{
    const apiUrl = process.env.PREDICTION_SERVICE_URL;
    console.info(`prediction service url: ${apiUrl}`);

    const form = new FormData();
    form.append('image-data', imageBuffer, {
        contentType:'image/png',
        name: 'image-data',
        filename:'default'
    });

    const result = await fetch(apiUrl, {
        method: 'POST',
        body:form
    });

    //the prediction comes back as an array of results; we only care about the first one
    const prediction = (await result.json())[0];

    const predictions = prediction.map((item, index)=>{
        return {
                "name":mappings[index],
                "value":`${(item * 100)}`
            }
    });

    console.info(`server side predictions: ${predictions}`);
    return predictions;
};


const saveImage = async(imageBuffer, predictions)=>{

    const imageBase64 = imageBuffer.toString('base64');

    const esData = {
        predictions,
        imageBase64
    }

    const esUrl = `${process.env.ES_CLUSTER_URL}/images/_doc`;

    const result = await fetch(esUrl, {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(esData)
    });

    console.info(JSON.stringify(result));
    const docInfo = await result.json();

    console.info(docInfo);
    return docInfo._id;
};
/*
const saveImage = async(imageBuffer)=>{
    //save image to es
    const imageKey = `${uuid.v1()}.png`;
    const imagePath = `./static/${imageKey}`;

    fs.writeFileSync(imagePath, imageBuffer);

    return imageKey;
};
*/
const getData = async(req)=>{
    return new Promise((resolve, reject)=>{
        const data = []
        req.on('data', async(datum)=>{
            data.push(datum);
        });

        req.on('end', async()=>{
            const buff = Buffer.concat(data);

            console.info('returning data buffer');
            resolve(buff);
        });

    });
}

const mappings = ['juvenile', 'seedlings'];

export const config = {
    api: {
        bodyParser: false,
    },
}
