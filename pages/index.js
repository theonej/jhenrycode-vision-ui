const FormData = require('form-data');

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
                headers:{
                    'Content-Type': file.type
                },
                body:file
            });

            const {imageKey} = await result.json();

            console.info(imageKey);
            window.location = `/display-prediction?imageKey=${imageKey}`;
        }
    };

    return (
        <div>
            <div>
                <h1>jhenrycode-vision</h1>
                <h2>please select an image</h2>
                <div>
                    <input type="file" name="image-data" id="iamge-data" onChange={setFile}></input>

                    <button onClick={getPrediction}>get prediction</button>
                </div>
            </div>

            <style jsx>{`

            `}</style>
        </div>
    )
}