
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, User, LogOut } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <div className="text-xl font-bold py-4 border-b">Admin Panel</div>
        <nav className="mt-6 space-y-2">
          <Link to="/admin/dashboard">
            <div
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin/dashboard")
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link to="/admin/blogs">
            <div
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin/blogs")
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <FileText className="mr-2 h-5 w-5" />
              <span>Blogs</span>
            </div>
          </Link>
          <Link to="/admin/facilitator">
            <div
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin/facilitator")
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <User className="mr-2 h-5 w-5" />
              <span>Facilitator</span>
            </div>
          </Link>
        </nav>
        <div className="absolute bottom-4 w-56">
          <Button variant="ghost" className="w-full flex items-center justify-start text-red-500" onClick={handleLogout}>
            <LogOut className="mr-2 h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
