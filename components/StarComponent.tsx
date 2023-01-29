import React, { useState, useEffect } from 'react';
import {Image} from '@nextui-org/react'

export default function StarComponent(props:any) {
    const baseUrl = 'http://localhost:8000'
    const [image, setImage] = useState('');

    useEffect(() => {
        fetch(baseUrl+'/result/'+props.dob)
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(url => setImage(url))
            .catch(error => console.error(error));
    }, [props.dob]);

    return (
        <div>
            {image && <Image src={image} alt="Generated Image" />}
        </div>
    );
};
