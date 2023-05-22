
type Props = {
  activeStep: Step;
};

export default function Slider({ activeStep }: Props) {

  return (
    <ol className="grid grid-rows-4 grid-flow-col items-center justify-center">
      <li className="flex flex-col items-center justify-center space-y-2">
        <span className={`flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${activeStep == Step.WALLET ? 'bg-blue-300' : 'bg-gray-100'}`}>
          <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
        </span>
        <h3 className="font-medium leading-tight text-white">Connect Wallet</h3>
        <div className="border-l-2 border-gray-200 w-0 h-9" />
      </li>
      <li className="flex flex-col items-center justify-center space-y-2">
        <span className={`flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${activeStep == Step.ACCOUNT ? 'bg-blue-300' : 'bg-gray-100'}`}>
          <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
        </span>
        <h3 className="font-medium leading-tight text-white">Smart Account</h3>
        <div className="border-l-2 border-gray-200 w-0 h-9" />
      </li>
      <li className="flex flex-col items-center justify-center space-y-2 pb-11">
        <span className={`flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${activeStep == Step.SWAP ? 'bg-blue-300' : 'bg-gray-100'}`}>
          <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
        </span>
        <h3 className="font-medium leading-tight text-white">Swap</h3>
      </li>
    </ol>
  )
}

export enum Step {
  WALLET = "wallet",
  ACCOUNT = "account",
  SWAP = "swap"
}

