import { ReactNode } from 'react';
import {
	Box,
	Container,
	Stack,
	SimpleGrid,
	Text,
	Link,
	VisuallyHidden,
	useColorModeValue,
	Button,
} from '@chakra-ui/react';

const ListHeader = ({ children }: { children: ReactNode }) => {
	return (
		<Text fontWeight={'500'} fontSize={'lg'} textColor='white' mb={2}>
			{children}
		</Text>
	);
};

const SocialButton = ({
	children,
	label,
	href,
}: {
	children?: ReactNode;
	label: string;
	href: string;
}) => {
	return (
		<Button
			bg='system-gray.100'
			rounded={'full'}
			w={8}
			h={8}
			cursor={'pointer'}
			as={'a'}
			href={href}
			display={'inline-flex'}
			alignItems={'center'}
			justifyContent={'center'}
			transition={'background 0.3s ease'}
			_hover={{
				bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
			}}>
			<VisuallyHidden>{label}</VisuallyHidden>
			{children}
		</Button>
	);
};

export default function Footer() {
	return (
		<footer>
			<Box className='inset-x-0 bottom-0' bg='system-purple.500'>
				<Container as={Stack} maxW={'6xl'} py={10}>
					<SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
						<Stack align={'flex-start'}>
							<ListHeader>Pages</ListHeader>
							<Link href={'/'} textColor='white'>
								Yield Farm
							</Link>
						</Stack>
					</SimpleGrid>
				</Container>
				<Box borderTopWidth={1} borderStyle={'solid'} borderColor='black'>
					<Container
						as={Stack}
						maxW={'6xl'}
						py={4}
						direction={{ base: 'column', md: 'row' }}
						spacing={4}
						justify={{ md: 'space-between' }}
						align={{ md: 'center' }}>
						<Text textColor='white'>© 2023 TxFusion. All rights reserved</Text>
						<Stack direction={'row'} spacing={6}>
							<SocialButton label={'Discord'} href={'#'} />
							<SocialButton label={'Site'} href={'#'} />
							<SocialButton label={'Site2'} href={'#'} />
						</Stack>
					</Container>
				</Box>
			</Box>
		</footer>
	);
}
