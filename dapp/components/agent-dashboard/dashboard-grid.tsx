export const DashboardGrid = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {children}
    </section>
  );
};

