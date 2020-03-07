const fetch = require('node-fetch');

export default async (req, res)=>{
    try{
       const {query: {imageKey}} = req;

        const predictions = await getImagePredictions(imageKey);

        res.status(200).json({predictions});
    }catch(e){
        console.error(`an erorr occurred while getting image data: ${e}`);
        res.status(500).json({message:e});
    }
};

const getImagePredictions = async (imageKey)=>{
    const esUrl = `${process.env.ES_CLUSTER_URL}/images/_doc/${imageKey}?_source_includes=predictions`;

    const result = await fetch(esUrl, {
        method:'GET'
    });

    const document = await result.json();

    return document._source.predictions;
};