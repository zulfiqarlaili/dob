import { Container, Text } from "@nextui-org/react";
import { useRouter } from "next/router";

export default function Result() {
    const router = useRouter();
    return (
        <Container display='flex' alignContent='center' justify='center'
        css={{
            textAlign:'center'
          }}>
            <Text>{router.query.dob}</Text>
        </Container>
    )
}