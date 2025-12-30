import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchInput } from '@/components/shared/SearchInput';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, Package } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/helpers';
import type { Order, OrderStatus, PaymentStatus } from '@/types';
import { mockOrders } from '@/services/mockData';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  processing: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  shipped: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

const paymentColors: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  paid: 'bg-green-500/10 text-green-500 border-green-500/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
  refunded: 'bg-muted text-muted-foreground border-muted',
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Orders"
          description="Manage customer orders and track fulfillment"
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search orders..."
            className="sm:w-80"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {order.orderNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[order.status]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={paymentColors[order.paymentStatus]}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/orders/${order.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
