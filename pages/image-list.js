const fetch = require('node-fetch');

const ImageList = props =>{
    const {images} = props;

    const formatDate = (dateString)=>{
        if(! dateString){
            return '';
        }

        const date = new Date(dateString);

        return date.toISOString().slice(0,10);
    }

    const getImageUrl = (imageKey)=>{
        return `/api/image/${imageKey}`;
    };

    const getPredictionLink = (imageKey)=>{
        return `display-prediction?imageKey=${imageKey}`;
    };

    const getPredictionClass = (prediction)=>{
        return (prediction >=  80) ? 'green' : 'dim';
    };

    return(
        <div>
            <div className='image-listing'>
                <h2>Prediction Information</h2>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>image key</th>
                            <th>juvenile</th>
                            <th>seedling</th>
                            <th>created</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {images.map((image, index)=>{
                            const {imageKey, predictions, created, juvenile, seedling} = image;
            
                            return (
                                <tr key={index}>
                                    <td className="image-cell"><img src={getImageUrl(imageKey)}></img></td>
                                    <td>{imageKey}</td>
                                    <td className={getPredictionClass(juvenile)}>{juvenile}%</td>
                                    <td className={getPredictionClass(seedling)}>{seedling}%</td>
                                    <td>{formatDate(created)}</td>
                                    <td><a href={getPredictionLink(imageKey)}>more</a></td>
                                </tr>)
                            })
                        }
                    </tbody>
                </table>
            </div>
            
            <style jsx>{`
                
                h2{
                    font-size:larger;
                }

                thead{
                    font-variant: small-caps;
                    color:#9e9e9e;
                }
                th{
                    text-align:left;
                    padding-right:25px;
                    padding-bottom:10px;
                }

                table{
                    border-collapse:collapse;
                    font-size:smaller;
                }
                
                td{
                    padding-right:25px;
                    padding:10px;
                    
                    color:#2e2e2e;
                    border-bottom:solid 1px #9e9e9e;
                    text-align:center;
                }

                img{
                    height:80%;
                    width:80%;
                }

                .image-cell{
                    width:100px;
                }

                .green{
                    background-color:#7cb876;
                    color:#fefefe;
                }


                .dim{
                    background-color:#fefefe;
                    color:#aeaeae;
                }

            `}</style>

        </div>
        
    )
};

ImageList.getInitialProps = async(ctx) =>{
    const {req} = ctx;

    const apiUrl = `http://${req.headers.host}/api/images`;

    const result = await fetch(apiUrl, {
        method:'GET'
    });

    const imageData = (await result.json());

    return {
        images:imageData.images
    }
};

export default ImageList;