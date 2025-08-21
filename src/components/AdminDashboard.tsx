import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiClient, isAuthenticated, logout } from '@/lib/api';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  LogOut, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Search,
  Filter,
  Download,
  MapPin,
  Package,
  User,
  Phone,
  Mail,
  CalendarDays,
  Users as UsersIcon,
  DollarSign,
  FileText,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface FilterState {
  search: string;
  tripType: string | 'all';
  status: string | 'all';
  package: string | 'all';
  dateFrom: string;
  dateTo: string;
  participants: string | 'all';
  language: string | 'all';
}

interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

const AdminDashboard = () => {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'contacts'>('bookings');
  
  // Filter and sort states
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    tripType: 'all',
    status: 'all',
    package: 'all',
    dateFrom: '',
    dateTo: '',
    participants: 'all',
    language: 'all'
  });
  
  const [sort, setSort] = useState<SortState>({
    field: 'createdAt',
    direction: 'desc'
  });

  const content = {
    en: {
      title: "Admin Dashboard",
      subtitle: "Manage bookings and contact submissions",
      bookings: "Bookings",
      contacts: "Contacts",
      totalBookings: "Total Bookings",
      totalContacts: "Total Contacts",
      pendingBookings: "Pending",
      confirmedBookings: "Confirmed",
      cancelledBookings: "Cancelled",
      newContacts: "New",
      respondedContacts: "Responded",
      status: "Status",
      actions: "Actions",
      view: "View",
      confirm: "Confirm",
      cancel: "Cancel",
      markResponded: "Mark Responded",
      logout: "Logout",
      noBookings: "No bookings found",
      noContacts: "No contacts found",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      // New filter labels
      search: "Search...",
      filters: "Filters",
      clearFilters: "Clear Filters",
      tripType: "Trip Type",
      package: "Package",
      dateFrom: "Date From",
      dateTo: "Date To",
      participants: "Participants",
      language: "Language",
      all: "All",
      // Trip types
      culturalSpirit: "Cultural Spirit Adventures",
      storiesOnRoad: "Stories on the Road",
      footstepsOfHistory: "In the Footsteps of History",
      // Export
      exportData: "Export Data",
      // Sorting
      sortBy: "Sort by",
      createdAt: "Created Date",
      tripDate: "Trip Date",
      name: "Name",
      // Details
      tripDetails: "Trip Details",
      customerInfo: "Customer Information",
      bookingInfo: "Booking Information",
      addOns: "Add-ons",
      totalPrice: "Total Price",
      notes: "Notes"
    },
    ar: {
      title: "لوحة الإدارة",
      subtitle: "إدارة الحجوزات وطلبات التواصل",
      bookings: "الحجوزات",
      contacts: "التواصل",
      totalBookings: "إجمالي الحجوزات",
      totalContacts: "إجمالي التواصل",
      pendingBookings: "في الانتظار",
      confirmedBookings: "مؤكدة",
      cancelledBookings: "ملغية",
      newContacts: "جديدة",
      respondedContacts: "تم الرد",
      status: "الحالة",
      actions: "الإجراءات",
      view: "عرض",
      confirm: "تأكيد",
      cancel: "إلغاء",
      markResponded: "تم الرد",
      logout: "تسجيل خروج",
      noBookings: "لا توجد حجوزات",
      noContacts: "لا توجد رسائل",
      loading: "جاري التحميل...",
      error: "خطأ",
      success: "نجح",
      // New filter labels
      search: "بحث...",
      filters: "المرشحات",
      clearFilters: "مسح المرشحات",
      tripType: "نوع الرحلة",
      package: "الباقة",
      dateFrom: "التاريخ من",
      dateTo: "التاريخ إلى",
      participants: "المشاركون",
      language: "اللغة",
      all: "الكل",
      // Trip types
      culturalSpirit: "مغامرات بروح ثقافية",
      storiesOnRoad: "حكايات على الطريق",
      footstepsOfHistory: "على خطى التاريخ",
      // Export
      exportData: "تصدير البيانات",
      // Sorting
      sortBy: "ترتيب حسب",
      createdAt: "تاريخ الإنشاء",
      tripDate: "تاريخ الرحلة",
      name: "الاسم",
      // Details
      tripDetails: "تفاصيل الرحلة",
      customerInfo: "معلومات العميل",
      bookingInfo: "معلومات الحجز",
      addOns: "إضافات",
      totalPrice: "السعر الإجمالي",
      notes: "ملاحظات"
    }
  };

  // Trip type mapping
  const tripTypeMap = {
    'Cultural Spirit Adventures': content[language].culturalSpirit,
    'Stories on the Road': content[language].storiesOnRoad,
    'In the Footsteps of History': content[language].footstepsOfHistory
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/admin/login';
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, contactsRes] = await Promise.all([
        apiClient.getBookings(),
        apiClient.getContacts()
      ]);

      if (bookingsRes.success) {
        setBookings(bookingsRes.data || []);
      }

      if (contactsRes.success) {
        setContacts(contactsRes.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({
        title: content[language].error,
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtered and sorted bookings
  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.name?.toLowerCase().includes(searchLower) ||
        booking.email?.toLowerCase().includes(searchLower) ||
        booking.tripTitle?.toLowerCase().includes(searchLower) ||
        booking.phone?.toLowerCase().includes(searchLower)
      );
    }

    // Apply trip type filter
    if (filters.tripType && filters.tripType !== 'all') {
      filtered = filtered.filter(booking => booking.tripTitle === filters.tripType);
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    // Apply package filter
    if (filters.package && filters.package !== 'all') {
      filtered = filtered.filter(booking => booking.packageName === filters.package);
    }

    // Apply date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(booking => new Date(booking.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(booking => new Date(booking.date) <= new Date(filters.dateTo));
    }

    // Apply participants filter
    if (filters.participants && filters.participants !== 'all') {
      filtered = filtered.filter(booking => booking.participants === parseInt(filters.participants));
    }

    // Apply language filter
    if (filters.language && filters.language !== 'all') {
      filtered = filtered.filter(booking => booking.language === filters.language);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sort.field];
      let bValue = b[sort.field];

      if (sort.field === 'date' || sort.field === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [bookings, filters, sort]);

  // Get unique values for filter options
  const uniqueTripTypes = [...new Set(bookings.map(b => b.tripTitle))];
  const uniquePackages = [...new Set(bookings.map(b => b.packageName))];
  const uniqueParticipants = [...new Set(bookings.map(b => b.participants))].sort((a, b) => a - b);
  const uniqueLanguages = [...new Set(bookings.map(b => b.language))];

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const response = await apiClient.updateBookingStatus(id, status);
      if (response.success) {
        toast({
          title: content[language].success,
          description: "Status updated successfully"
        });
        fetchData(); // Refresh data
      }
    } catch (error) {
      toast({
        title: content[language].error,
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      tripType: 'all',
      status: 'all',
      package: 'all',
      dateFrom: '',
      dateTo: '',
      participants: 'all',
      language: 'all'
    });
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Trip Title', 'Package', 'Date', 'Participants', 'Status', 'Language', 'Total Price', 'Created'],
      ...filteredBookings.map(booking => [
        booking.name,
        booking.email,
        booking.phone,
        booking.tripTitle,
        booking.packageName,
        new Date(booking.date).toLocaleDateString(),
        booking.participants,
        booking.status,
        booking.language,
        booking.totalPrice || 0,
        new Date(booking.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary', icon: Clock, text: content[language].pendingBookings },
      confirmed: { variant: 'default', icon: CheckCircle, text: content[language].confirmedBookings },
      cancelled: { variant: 'destructive', icon: XCircle, text: content[language].cancelledBookings }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getContactStatusBadge = (status: string) => {
    if (status === 'responded') {
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {content[language].respondedContacts}
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {content[language].newContacts}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-elegant pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{content[language].loading}</p>
        </div>
      </div>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const newContacts = contacts.filter(c => c.status === 'new').length;
  const respondedContacts = contacts.filter(c => c.status === 'responded').length;

  return (
    <div className="min-h-screen bg-gradient-elegant pt-24">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold text-primary ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].title}
            </h1>
            <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].subtitle}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            {content[language].logout}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <Calendar className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{content[language].totalBookings}</p>
                  <p className="text-2xl font-bold text-primary">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-gold rounded-lg">
                  <Clock className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{content[language].pendingBookings}</p>
                  <p className="text-2xl font-bold text-secondary">{pendingBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{content[language].confirmedBookings}</p>
                  <p className="text-2xl font-bold text-green-600">{confirmedBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500 rounded-lg">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{content[language].cancelledBookings}</p>
                  <p className="text-2xl font-bold text-red-600">{cancelledBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <MessageSquare className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{content[language].totalContacts}</p>
                  <p className="text-2xl font-bold text-primary">{contacts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'bookings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('bookings')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            {content[language].bookings}
          </Button>
          <Button
            variant={activeTab === 'contacts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('contacts')}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            {content[language].contacts}
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'bookings' ? (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
                  <Filter className="h-5 w-5" />
                  {content[language].filters}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={content[language].search}
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                      className="pl-10"
                    />
                  </div>

                  {/* Trip Type */}
                  <Select value={filters.tripType} onValueChange={(value) => setFilters({...filters, tripType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={content[language].tripType} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{content[language].all}</SelectItem>
                      {uniqueTripTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Status */}
                  <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={content[language].status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{content[language].all}</SelectItem>
                      <SelectItem value="pending">{content[language].pendingBookings}</SelectItem>
                      <SelectItem value="confirmed">{content[language].confirmedBookings}</SelectItem>
                      <SelectItem value="cancelled">{content[language].cancelledBookings}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Package */}
                  <Select value={filters.package} onValueChange={(value) => setFilters({...filters, package: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={content[language].package} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{content[language].all}</SelectItem>
                      {uniquePackages.map(pkg => (
                        <SelectItem key={pkg} value={pkg}>{pkg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Date From */}
                  <Input
                    type="date"
                    placeholder={content[language].dateFrom}
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  />

                  {/* Date To */}
                  <Input
                    type="date"
                    placeholder={content[language].dateTo}
                    value={filters.dateTo}
                    onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  />

                  {/* Participants */}
                  <Select value={filters.participants} onValueChange={(value) => setFilters({...filters, participants: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={content[language].participants} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{content[language].all}</SelectItem>
                      {uniqueParticipants.map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Language */}
                  <Select value={filters.language} onValueChange={(value) => setFilters({...filters, language: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={content[language].language} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{content[language].all}</SelectItem>
                      {uniqueLanguages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {content[language].clearFilters}
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {filteredBookings.length} of {bookings.length} bookings
                    </span>
                    <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      {content[language].exportData}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sorting */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{content[language].sortBy}:</span>
                  <Select value={sort.field} onValueChange={(value) => setSort({...sort, field: value})}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">{content[language].createdAt}</SelectItem>
                      <SelectItem value="date">{content[language].tripDate}</SelectItem>
                      <SelectItem value="name">{content[language].name}</SelectItem>
                      <SelectItem value="status">{content[language].status}</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSort({...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc'})}
                    className="flex items-center gap-2"
                  >
                    {sort.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    {sort.direction === 'asc' ? 'Ascending' : 'Descending'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bookings List */}
            <Card>
              <CardHeader>
                <CardTitle className={isRTL ? 'font-arabic text-right' : 'font-english text-left'}>
                  {content[language].bookings} ({filteredBookings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredBookings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {content[language].noBookings}
                  </p>
                ) : (
                  <div className="space-y-6">
                    {filteredBookings.map((booking) => (
                      <div key={booking._id} className="border rounded-lg p-6 space-y-4">
                        {/* Header with Status */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-primary">{booking.tripTitle}</h4>
                              <p className="text-sm text-muted-foreground">{booking.packageName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(booking.status)}
                          </div>
                        </div>

                        {/* Customer Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <h5 className="font-medium flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {content[language].customerInfo}
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Name:</span>
                                <span>{booking.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{booking.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{booking.phone}</span>
                              </div>
                              {booking.age && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Age:</span>
                                  <span>{booking.age}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h5 className="font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {content[language].bookingInfo}
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />
                                <span className="font-medium">Trip Date:</span>
                                <span>{new Date(booking.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <UsersIcon className="h-4 w-4" />
                                <span className="font-medium">Participants:</span>
                                <span>{booking.participants}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                <span className="font-medium">Package:</span>
                                <span>{booking.packageName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="font-medium">Language:</span>
                                <span>{booking.language}</span>
                              </div>
                              {booking.totalPrice && (
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4" />
                                  <span className="font-medium">Total Price:</span>
                                  <span className="font-semibold text-green-600">
                                    {booking.totalPrice} {booking.language === 'en' ? 'SAR' : 'ريال'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Add-ons */}
                        {booking.addOns && booking.addOns.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="font-medium flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              {content[language].addOns}
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {booking.addOns.map((addon: string, index: number) => (
                                <Badge key={index} variant="outline">{addon}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        {booking.status === 'pending' && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {content[language].confirm}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                            >
                              {content[language].cancel}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className={isRTL ? 'font-arabic text-right' : 'font-english text-left'}>
                {content[language].contacts}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contacts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {content[language].noContacts}
                </p>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact._id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{contact.name}</h4>
                          <p className="text-sm text-muted-foreground">{contact.email}</p>
                          {contact.phone && (
                            <p className="text-sm text-muted-foreground">{contact.phone}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getContactStatusBadge(contact.status)}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Message:</span> {contact.message}
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Language: {contact.language}</span>
                        <span>Submitted: {new Date(contact.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
