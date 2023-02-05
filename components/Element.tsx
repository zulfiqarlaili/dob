import { Card, Collapse, Container, Grid, Loading, Spacer, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";
import AboutMe from "./AboutMe";

interface Element {
    name: string;
    personality: string;
    strength_and_weakness: string;
    relationship: string;
    compatibility: string;
    advice: string;
}

interface IAboutMe {
    physical: string;
    ending: string;
}


export default function Element(props: any) {
    const baseUrl = 'https://dob.just-type.com'
    // const baseUrl = 'http://localhost:8000'
    const [elements, setElements] = useState([]);
    const [aboutMe, setAboutMe] = useState('');

    const dob = props.dob;
    useEffect(() => {
        fetch(baseUrl + '/element/' + dob)
            .then(response => response.json())
            .then(json => {
                setAboutMe('')
                if (json.elements.length > 0) setElements(json.elements)
                // setAboutMe(json.physical)
                getAboutMe(json.physical, json.ending)

            })
            .catch(error => alert(error));
    }, [dob]);

    async function getAboutMe(physical: string, ending: string) {
        const data = {
            physical: physical,
            ending: ending,
        };
        try {
            const response = await fetch(baseUrl + '/aboutMe/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            const additionalText = ' You can also bring the above diagram to metaphysician to get a deeper analysis.'
            setAboutMe(result+additionalText)
        } catch (error) {
            alert(error)
        }

    }

    return (
        <>
            {aboutMe ? (<AboutMe aboutMe={aboutMe} />) :
                (<Container>
                    <Text size={25} css={{ textAlign: 'start', fontWeight: '$bold' }}>About You</Text>
                    <Grid css={{ display: 'flex', alignItems: 'center' }}>
                        <Text>AI Generating</Text>
                        <Spacer x={0.3}/>
                        <Loading color='currentColor' type="points-opacity" />
                    </Grid>
                </Container>)}
            <Spacer y={1} />
            {(elements.length > 0) &&
                (<>
                    <Container>
                        <Text size='$2xl' css={{ fontWeight: '$bold' }}>Element of Dominance</Text>
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