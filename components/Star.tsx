import React, { useState, useEffect } from 'react';
import { Image, Text } from '@nextui-org/react'
import router from 'next/router';

export default function StarComponent(props: any) {
    const baseUrl = 'https://www.borndate.duckdns.org'
    // const baseUrl = 'http://localhost:8000'
    const [image, setImage] = useState('');

    const element = document.getElementById('bottom');

    useEffect(() => {
        props.handleLoading(true)
        fetch(baseUrl + '/result/' + props.dob)
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(url => setImage(url))
            .then(()=> {
                props.handleLoading(false)
                if(element) element.scrollIntoView({ behavior: 'smooth' })
            })
            .catch((error:any) => {
                alert(error)
                props.handleLoading(false)
            });
    }, [element, props.dob]);

    return (
        <div>
            <Text size={25} css={{ textAlign: 'center', fontWeight: '$bold' }}>Your result</Text>
            {image && <Image src={image} alt="Generated Image" />}
        </div>
    );
};
