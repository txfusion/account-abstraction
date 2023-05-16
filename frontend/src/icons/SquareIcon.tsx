import * as React from 'react';
import { SVGProps } from 'react';
const SquareIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width={40}
		height={30}
		viewBox='0 0 50 40'
		fill='none'
		{...props}>
		<path
			fill='#A5B4FC'
			d='m25 0 25 15.01v9.976L25 40 0 24.986V15.01L25 0Z'
			className='ccompli2'
		/>
		<path
			fill='#4F46E5'
			fillRule='evenodd'
			d='M0 15.01 25 0l25 15.01v9.976L25 40 0 24.986V15.01ZM25 33.63l19.697-11.829v-3.607h-.001L25 30.02 5.304 18.195v3.607L25 33.631Zm0-9.126 15.102-9.067-3.68-2.208L25 20.088 13.577 13.23l-3.679 2.208L25 24.505Zm0-9.932 6.829-4.1L25 6.375l-6.829 4.098 6.829 4.1Z'
			className='ccustom'
			clipRule='evenodd'
		/>
		<path
			fill='#A5B4FC'
			fillOpacity={0.3}
			d='M25 0 0 15.01v9.976L25 40V0Z'
			className='ccompli2'
		/>
	</svg>
);
export default SquareIcon;
