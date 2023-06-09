import {
	Box,
	FormLabel,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Text,
} from '@chakra-ui/react';
import React from 'react';

type Props = {
	text: String;
	placeHolder: string;
	setValue: any;
	value?: any;
	size?: string;
	iconRight?: JSX.Element;
	iconLeft?: JSX.Element;
};

type PurpleButtonProps = Props &
	React.ComponentPropsWithoutRef<typeof Box> &
	React.ComponentPropsWithoutRef<typeof Input>;

export function PurpleInput({
	text,
	setValue,
	placeHolder,
	w,
	h,
	m,
	size,
	iconRight,
	iconLeft,
	value,
	type,
}: PurpleButtonProps) {
	return (
		<>
			<Box mb='4' w={w} h={h} m={m}>
				<FormLabel>
					<Text color='system-gray.500' fontSize='l'>
						{text}
					</Text>
				</FormLabel>
				<InputGroup size={size}>
					{iconLeft ? <InputLeftElement children={iconLeft} /> : null}
					<Input
						type={type}
						border='0.06rem'
						backgroundColor='system-gray.100'
						borderStyle='solid'
						borderColor='system-purple.500'
						borderRadius='3xl'
						placeholder={placeHolder}
						textColor='white'
						value={value}
						onChange={(e) => {
							setValue(e.currentTarget.value);
						}}
					/>
					{iconRight ? <InputRightElement children={iconRight} /> : null}
				</InputGroup>
			</Box>
		</>
	);
}
