import { useMemo } from 'react';
import { Header } from '@/components/Header';
import { mockTickets, mockUsers, mockFeedback } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Ticket, Star, TrendingUp } from 'lucide-react';

const COLORS = ['hsl(199, 89%, 48%)', 'hsl(38, 92%, 50%)', 'hsl(262, 83%, 58%)', 'hsl(142, 76%, 36%)', 'hsl(215, 20%, 45%)'];

const AdminDashboard = () => {
  const statusData = useMemo(() => {
    const counts = mockTickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Open', value: counts['open'] || 0 },
      { name: 'In Progress', value: counts['in-progress'] || 0 },
      { name: 'Under QA', value: counts['under-qa'] || 0 },
      { name: 'Resolved', value: counts['resolved'] || 0 },
      { name: 'Closed', value: counts['closed'] || 0 },
    ];
  }, []);

  const categoryData = useMemo(() => {
    const counts = mockTickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count: value,
    }));
  }, []);

  const averageRating = useMemo(() => {
    if (mockFeedback.length === 0) return 0;
    const total = mockFeedback.reduce((sum, fb) => sum + fb.rating, 0);
    return (total / mockFeedback.length).toFixed(1);
  }, []);

  const resolutionRate = useMemo(() => {
    const resolved = mockTickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
    return ((resolved / mockTickets.length) * 100).toFixed(0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor performance, analyze trends, and manage your support team
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-6 rounded-xl animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Tickets</p>
                <p className="text-3xl font-bold">{mockTickets.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl animate-slide-up" style={{ animationDelay: '50ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Team Members</p>
                <p className="text-3xl font-bold">{mockUsers.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-info" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Rating</p>
                <p className="text-3xl font-bold">{averageRating}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl animate-slide-up" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Resolution Rate</p>
                <p className="text-3xl font-bold">{resolutionRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6 rounded-xl animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold mb-4">Tickets by Status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222 47% 10%)',
                      border: '1px solid hsl(222 30% 18%)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {statusData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl animate-slide-up" style={{ animationDelay: '250ms' }}>
            <h3 className="text-lg font-semibold mb-4">Tickets by Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                  <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222 47% 10%)',
                      border: '1px solid hsl(222 30% 18%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(174 72% 46%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="glass-card p-6 rounded-xl animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h3 className="text-lg font-semibold mb-4">Team Members</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {mockUsers.map((member) => {
              const assignedCount = mockTickets.filter((t) => t.assignedTo === member.id).length;
              return (
                <div key={member.id} className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assigned tickets</span>
                    <span className="font-medium">{assignedCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
