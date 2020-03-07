const fs = require('fs');


export default (req, res)=>{
    try{
       const {query: {imageKey}} = req;

        console.info(`server side image key: ${imageKey}`);
        const imagePath = `./static/${imageKey}`;

        const imageData = fs.readFileSync(imagePath);
        res.writeHead(301, {'Content-Type':'image/png'});
        res.end(imageData, 'binary');
    }catch(e){
        console.error(`an erorr occurred while getting image data: ${e}`);
        res.status(500).json({message:e});
    }
};