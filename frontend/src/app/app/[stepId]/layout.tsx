
import Slider, { Step } from "@/components/Slider"
import Providers from "@/providers/Providers"

type Param = {
    stepId: Step
}

export default function AppLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: Param
}) {
    return (
        <Providers>
            <div className="grid grid-cols-8 items-center justify-center">
                <div className="flex min-h-screen col-span-2 items-center justify-center border-r border-gray-200">
                    <Slider activeStep={params.stepId} />
                </div>
                <div className="flex min-h-screen col-span-6 items-center justify-center">
                    {children}
                </div>
            </div>
        </Providers>
    )
}
