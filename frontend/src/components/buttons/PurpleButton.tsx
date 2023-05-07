import { Button, Text } from "@chakra-ui/react";

type Props = {
    text: String,
    onClick: any,
    attributes?: any

}

export function PurpleButton({ onClick, text, attributes }: Props) {
    return (
        <Button colorScheme="system-purple" onClick={() => onClick(attributes)} borderRadius="xl">
            <Text color="white" fontSize="sm">
                {text}
            </Text>
        </Button>
    );
};