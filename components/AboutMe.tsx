import { Container, Text } from "@nextui-org/react";
import React, { useState, useEffect } from "react"

interface IAboutMe {
    physical: string;
    ending: string;
}

type Props = {
    aboutMe: IAboutMe;
}

export default function AboutMe(aboutMe: Props) {
    const [text, setText] = useState("")
    const [fullText, setFullText] = useState(
       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis nunc feugiat, blandit urna in, tempor eros. Donec eget interdum eros, eget eleifend diam. Nullam non lobortis justo. Sed nec mauris vel lectus convallis aliquam vel vulputate augue. In hac habitasse platea dictumst. Ut auctor tellus at tincidunt luctus. Duis augue metus, finibus id ornare sed, ornare eu enim. Donec quis blandit odio, ac sollicitudin mi. Pellentesque laoreet tincidunt sagittis. Nunc semper sapien blandit vestibulum auctor. Phasellus ut est vulputate lorem dictum blandit sodales rhoncus dolor. Donec ultricies, purus vel dignissim fermentum, risus diam consectetur erat, nec tincidunt nisl leo nec augue. Phasellus eget suscipit mauris. Etiam laoreet auctor est quis blandit." 
      )
    const [index, setIndex] = useState(0)

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
        <Container>
            <Text size={25} css={{ textAlign:'start', fontWeight: '$bold' }}>About You</Text>
            <Text>{text}</Text>
        </Container>
        </>
    )

}