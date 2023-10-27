import { Button, Card, Collapse, Container, Grid, Loading, Modal, Spacer, Text, textWeights, useModal } from "@nextui-org/react";
import { useEffect, useState } from "react";
import AboutMe from "./AboutMe";

interface Element {
    name: string;
    color: string;
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
    // Using firebase hard to handle .env
    const baseUrl = 'https://www.borndate.duckdns.org'
    // const baseUrl = 'http://localhost:8000'
    const [elements, setElements] = useState([]);
    const [aboutMe, setAboutMe] = useState('');
    const [error, setError] = useState('');
    const { setVisible, bindings } = useModal();

    const dob = props.dob;
    useEffect(() => {
        fetch(baseUrl + '/element/' + dob)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(json => {
                setAboutMe('')
                if (json.elements.length > 0) setElements(json.elements)
                // setAboutMe(json.physical)
                getAboutMe(json.physical, json.ending)

            })
            .catch((error) => {
                // alert(error)
                setError(error.message)
                setVisible(true)
            });
    }, [dob]);

    async function getAboutMe(physical: string, ending: string) {
        const data = {
            physical: physical,
            ending: ending,
        };
        const response = await fetch(baseUrl + '/aboutMe/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            const result = json
            const additionalText = ' Additionally, you may consult with a metaphysician to obtain an in-depth analysis of above diagram.'
            setAboutMe(result + additionalText)
        }).catch((error) => {
            // alert(error)
            setError(error.message)
            setVisible(true)
        });;

    }

    return (
        <>
            <Modal
                scroll
                width="400px"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                {...bindings}>
                <Modal.Header>
                    <Text id="modal-title" size={18} weight='extrabold' color="error">
                        Error
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Text id="modal-description">
                        {error}
                    </Text>
                </Modal.Body>
            </Modal>
            {aboutMe ? (<AboutMe aboutMe={aboutMe} />) :
                (<Container css={{
                    paddingLeft: '$0',
                    paddingRight: '$0',
                }}>
                    <Text size={25} css={{ textAlign: 'start', fontWeight: '$bold' }}>About You</Text>
                    <Container css={{ display: 'flex', alignContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '300px', minWidth: '200px' }}>
                        <Container display='flex' direction='row' alignItems='baseline' justify='center'>
                            <Text>AI Generating</Text>
                            <Spacer x={0.3} />
                            <Loading color='currentColor' type="points-opacity" />
                        </Container>
                    </Container>
                </Container>)}
            <Spacer y={1} />
            {(elements.length > 0) &&
                (<>
                    <Container css={{
                        paddingLeft: '$0',
                        paddingRight: '$0',
                    }}>
                        <Text size='$2xl' css={{ fontWeight: '$bold' }}>Element of Dominance</Text>
                    </Container>
                    <Collapse.Group splitted css={{
                        paddingLeft: '$0',
                        paddingRight: '$0',
                    }}>
                        {elements.map((element: Element, index: any) => {
                            return (
                                <Collapse
                                    expanded={true}
                                    disabled={true}
                                    showArrow={false}
                                    key={index}
                                    shadow
                                    title={<Text
                                        css={{
                                            fontSize: '$2xl',
                                            fontWeight: 'bold',
                                            color: element.color
                                        }}>{element.name}</Text>}
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