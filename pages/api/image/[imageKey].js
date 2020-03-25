const fetch = require('node-fetch');

export default async (req, res)=>{
    try{

        const {query:{imageKey}} = req;

        const imageData = await getImage(imageKey);

        res.writeHeader(301, {'Content-Type': 'image/png'});
        res.end(imageData, 'binary');
    }catch(e){
        console.error(`an error occurred while getting image data: ${e}`);
        res.status(500).json({message:e});
    }
}

const getImage = async(imageKey)=>{
    const esUrl = `${process.env.ES_CLUSTER_URL}/images/_doc/${imageKey}?_source_includes=imageBase64`;
    
    const result = await fetch(esUrl, {
        method:'GET'
    });

    const document = await result.json();

    const buffer = new Buffer(document._source.imageBase64, 'base64');

    return buffer;
}
