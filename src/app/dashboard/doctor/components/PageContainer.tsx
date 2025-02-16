interface PageContainerProps {
  title: string;
  children: React.ReactNode;
}

export default function PageContainer({ title, children }: PageContainerProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">
        <span className="text-gray-800">{title}</span>
      </h1>
      <div className="bg-white rounded-xl p-6">{children}</div>
    </div>
  );
}
