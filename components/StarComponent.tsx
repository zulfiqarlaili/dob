import React, { useState, useEffect } from 'react';
import { Image, Text } from '@nextui-org/react'
import router from 'next/router';

export default function StarComponent(props: any) {
    const baseUrl = 'https://dob.just-type.com'
    const [image, setImage] = useState('');

    useEffect(() => {
        fetch(baseUrl + '/result/' + props.dob)
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(url => setImage(url))
            .then(()=>router.push("/#StarComponent"))
            .catch(error => alert(error));
    }, [props.dob]);

    return (
        <div>
            <Text size={25} css={{ textAlign: 'center', fontWeight: '$bold' }}>Your result</Text>
            {image && <Image src={image} alt="Generated Image" />}
        </div>
    );
};
