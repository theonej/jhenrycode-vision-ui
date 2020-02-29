const FormData = require('form-data');

import template from './template';

export default function Index(props){

    let file = null;

    const setFile = (event)=>{ 
        file = event.currentTarget.files[0];        
    };

    const getPrediction = async(event)=>{

        const form = new FormData();
        form.append('file', file);

        if(file){
            const apiUrl = '/api/prediction';
            const result = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': file.type
                },
                body:file
            });
    
            const prediction = await result.json();
            console.info(`prediction: ${prediction}`);

            window.location = `/display-prediction?prediction=${prediction}`;
        }

        event.preventDefault();
    };

    return(
        <div className="upload-container">
            <div>
                <h1>jhenrycode-vision</h1>
                <p>Please select an image</p>
                <div>
                    <input type="file" onChange={setFile} name="image-data" id="image-data"></input>
                        
                    <button onClick={getPrediction}>Get Prediction</button>

                </div>
            </div>


            <style jsx>{`
                
                h1{
                    font-weight:100;
                }

            `}</style>

        </div>
        
    )
}
