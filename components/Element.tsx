import { Card, Collapse, Container, Spacer, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface Element {
    name: string;
    personality: string;
    strength_and_weakness: string;
    relationship: string;
    compatibility: string;
    advice: string;
}


export default function Element(props: any) {
    const baseUrl = 'https://dob.just-type.com'
    // const baseUrl = 'http://localhost:8000'
    const [elements, setElements] = useState([]);

    const dob = props.dob;
    useEffect(() => {
        fetch(baseUrl + '/element/' + dob)
            .then(response => response.json())
            .then(json => {
                console.log(json.elements)
                if (json.elements.length > 0) setElements(json.elements)
            })
            .catch(error => alert(error));
    }, [dob]);

    return (
        <>
            {(elements.length > 0) &&
                (<>
                    <Container>
                        <Text  size='$2xl' css={{ fontWeight: '$bold' }}>Element of Dominance</Text>
                    </Container>
                    <Collapse.Group splitted>
                        {elements.map((element: Element, index: any) => {
                            return (
                                <Collapse
                                    key={index}
                                    shadow
                                    title={element.name}
                                    subtitle={element.personality}>
                                    <Text h4 b>Strength & Weakness</Text>
                                    <Text i>{element.strength_and_weakness}</Text>
                                    <Spacer y={1} />
                                    <Text h4 b>Relationship</Text>
                                    <Text i>{element.relationship}</Text>
                                    <Spacer y={1} />
                                    <Text h4 b>Compatibility</Text>
                                    <Text i>{element.compatibility}</Text>
                                    <Spacer y={1} />
                                    <Text h4 b>Advice</Text>
                                    <Text i>{element.advice}</Text>
                                </Collapse>
                            )
                        })}
                    </Collapse.Group>
                </>
                )
            }
        </>
    )
}