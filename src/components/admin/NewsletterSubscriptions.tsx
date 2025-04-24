
import React from "react";
import { format } from "date-fns";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface NewsletterSubscription {
  id: string;
  email: string;
  created_at: string;
}

interface NewsletterSubscriptionsProps {
  subscriptions: NewsletterSubscription[];
}

const NewsletterSubscriptions: React.FC<NewsletterSubscriptionsProps> = ({ subscriptions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Newsletter Subscriptions</CardTitle>
        <CardDescription>
          Recent email subscriptions to your newsletter
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscriptions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No newsletter subscriptions yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Date Subscribed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <a href={`mailto:${subscription.email}`} className="text-primary hover:underline">
                        {subscription.email}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(subscription.created_at), "MMM d, yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsletterSubscriptions;
