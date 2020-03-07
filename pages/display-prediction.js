const fetch = require('node-fetch');

const DisplayPrediction = props =>{
    const {imageKey, predictions} = props;

    const imagePath = `/api/image/${imageKey}`;

    return (
        <div>
            <div className="prediction-container">
                <div className="image-view">
                    <img src={imagePath}></img>
                    <div className="prediction-info">
                        <h2>Predictions ({predictions.length})</h2>
                        <ul>
                            {predictions.map(prediction=>(
                                    <li>{prediction.name}: {prediction.value}%</li>
                                )
                            )
                            }
                        </ul>
                    </div>
                </div>
            </div>

            <style jsx>{`
                
                .image-view img{
                    border-radius:250px;
                    height:200px;
                    width:200px;
                    float:left;
                }

                .prediction-info{
                    float:left;
                }

                .prediction-info ul li {
                    list-style:none;
                    padding:10px 5px;
                }

            `}</style>

        </div>
       
    )
}

DisplayPrediction.getInitialProps = async(ctx)=>{
    const {imageKey} = ctx.query;
    const {req} = ctx;

    const apiUrl = `http://${req.headers.host}/api/predictions/${imageKey}`;

    const result = await fetch(apiUrl, {
        method:'GET'
    });

    const predictions = (await result.json()).predictions

    return {
        imageKey:imageKey,
        predictions
    }
}

export default DisplayPrediction;