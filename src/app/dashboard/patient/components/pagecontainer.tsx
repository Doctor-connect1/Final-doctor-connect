import SideNavigation from "./sidenavigation";

interface PageContainerProps {
    title: string;
    children: React.ReactNode;
}

export default function PageContainer({ title, children }: PageContainerProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <SideNavigation />
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full md:w-3/4">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-2xl font-semibold">
                        <span className="text-gray-800">{title}</span>
                    </h1>
                    <div className="space-y-8">{children}</div>
                </div>
            </main>
        </div>
    );
}
  