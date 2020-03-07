import { loadGetInitialProps } from "next/dist/next-server/lib/utils"

function Template(props){
    return (
        <div className="layout">
            <div className="main-container">
                {props.children}
            </div>
        
            <style jsx global>{`
                #__next{
                    height:100%;
                }

                body, html{
                    font-family:"Proxima Nova",system-ui,sans-serif;
                    background-color:#efefef;
                    height:100%;
                    margin-top:10px;
                }

                .layout {
                    padding-top:10px;
                    height: 100%;
                    display: grid;
                    align-items: center;
                    justify-content: center;
                }
                .main-container{
                    padding:45px;
                    background:#fefefe;
                    border:solid 1px #bebebe;
                }
            `}</style>
        </div>
    )
}

export default Template