
import React from "react";
import { format } from "date-fns";
import { PhoneCall } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  session_type: string;
  message: string;
  status: "new" | "contacted" | "completed" | "cancelled";
  created_at: string;
}

interface AppointmentsListProps {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: Appointment["status"]) => void;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ appointments, onUpdateStatus }) => {
  const getStatusBadge = (status: Appointment["status"]) => {
    switch(status) {
      case "new":
        return <Badge variant="default">New</Badge>;
      case "contacted":
        return <Badge variant="secondary">Contacted</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Session Requests</CardTitle>
        <CardDescription>
          Manage your recent appointment and session requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No appointment requests yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Session Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <a href={`mailto:${appointment.email}`} className="text-primary hover:underline text-xs flex items-center gap-1">
                        {appointment.email}
                      </a>
                      <a href={`tel:${appointment.phone}`} className="text-muted-foreground hover:text-primary text-xs flex items-center gap-1">
                        <PhoneCall className="h-3 w-3" />
                        {appointment.phone}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.session_type}</TableCell>
                  <TableCell>{format(new Date(appointment.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => onUpdateStatus(appointment.id, "contacted")}
                        disabled={appointment.status !== "new"}
                      >
                        Mark Contacted
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => onUpdateStatus(appointment.id, "completed")}
                        disabled={appointment.status === "completed" || appointment.status === "cancelled"}
                      >
                        Complete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsList;
