import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-muted/30 text-foreground">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
