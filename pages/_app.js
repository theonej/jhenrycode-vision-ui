import React from 'react'
import App, {Container} from 'next/app'
import Template from './template'

class jhenrycode extends App {
    render(){
        const {Component, pageProps} = this.props

        return (
                <Template>
                    <Component {...pageProps} />
                </Template>
        )
    }
}

export default jhenrycode