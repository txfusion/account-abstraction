import { Button, Text } from '@chakra-ui/react';

type Props = {
	text: String;
	onClick: any;
	closeClick?: any;
	attributes?: any;
	isLoading? :boolean
};

export function PurpleButton({ onClick, closeClick, text, attributes, isLoading }: Props) {
	return (
		<Button
			isLoading={isLoading}
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
