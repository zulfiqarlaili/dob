import { Container, Text } from "@nextui-org/react";
import React, { useState, useEffect } from "react"

export default function AboutMe(props: any) {
    const [text, setText] = useState("")
    const [fullText, setFullText] = useState(props.aboutMe)
    const [index, setIndex] = useState(0)

    // setFullText('dfijhdfkjgbhdfolkjehd')
    useEffect(() => {
        if (index < fullText.length) {
            setTimeout(() => {
                setText(text + fullText[index])
                setIndex(index + 1)
            }, 5)
        }
    }, [index])

    return (
        <>
            <Container css={{
                paddingLeft: '$0',
                paddingRight: '$0',
            }}>
                <Text size={25} css={{ textAlign: 'start', fontWeight: '$bold' }}>About You</Text>
                <Text>{text}</Text>
            </Container>
        </>
    )

}