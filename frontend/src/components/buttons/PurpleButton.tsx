import { Button, Text } from '@chakra-ui/react';

type Props = {
	text: String;
	onClick: any;
	closeClick?: any;
	attributes?: any;
};

export function PurpleButton({ onClick, closeClick, text, attributes }: Props) {
	return (
		<Button
			colorScheme='system-purple'
			onClick={() => {
				onClick(attributes);
				closeClick != null ? closeClick() : null;
			}}
			borderRadius='xl'>
			<Text color='white' fontSize='sm'>
				{text}
			</Text>
		</Button>
	);
}
