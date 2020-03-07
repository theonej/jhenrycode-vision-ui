const fetch = require('node-fetch');

export default async (req, res)=>{
    try{
        const images = await getImages();

        res.status(200).json({images});
    }catch(e){
        console.error(`an erorr occurred while getting image data: ${e}`);
        res.status(500).json({message:e});
    }
};

const getImages = async ()=>{
    const esUrl = `${process.env.ES_CLUSTER_URL}/images/_search?_source_includes=predictions,created&size=100`;

    const result = await fetch(esUrl, {
        method:'GET'
    });

    const imageResults = await result.json();

    return imageResults.hits.hits.map((image)=>{
        return {
            imageKey:image._id,
            predictions:image._source.predictions,
            created:image._source.created,
            juvenile:image._source.predictions[0].value,
            seedling:image._source.predictions[1].value
        }
    });
};