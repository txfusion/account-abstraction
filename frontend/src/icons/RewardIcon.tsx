import * as React from 'react';
import { SVGProps } from 'react';

const RewardIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width={30}
		height={30}
		viewBox='0 0 30 30'
		fill='none'
		{...props}>
		<path
			fill='#007DFC'
			fillRule='evenodd'
			d='M25.556 11.685A10 10 0 0 0 20 10V0A20 20 0 1 1 0 20h10a10 10 0 1 0 15.556-8.315Z'
			className='ccustom'
			clipRule='evenodd'
		/>
		<path
			fill='#007DFC'
			fillRule='evenodd'
			d='M10 0A10 10 0 0 1 0 10v10A20 20 0 0 0 20 0H10Z'
			className='ccustom'
			clipRule='evenodd'
		/>
	</svg>
);
export default RewardIcon;
