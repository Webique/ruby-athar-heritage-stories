import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiClient, setAuthToken, setUser } from '@/lib/api';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const content = {
    en: {
      title: "Admin Login",
      subtitle: "Access the Ruby Heritage administration panel",
      username: "Username",
      password: "Password",
      login: "Login",
      loggingIn: "Logging in...",
      error: "Login failed",
      success: "Login successful",
      invalidCredentials: "Invalid username or password",
      required: "This field is required"
    },
    ar: {
      title: "تسجيل دخول الإدارة",
      subtitle: "الوصول إلى لوحة إدارة أثر روبي",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      login: "تسجيل الدخول",
      loggingIn: "جاري تسجيل الدخول...",
      error: "فشل تسجيل الدخول",
      success: "تم تسجيل الدخول بنجاح",
      invalidCredentials: "اسم المستخدم أو كلمة المرور غير صحيحة",
      required: "هذا الحقل مطلوب"
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username.trim() || !formData.password.trim()) {
      toast({
        title: content[language].error,
        description: content[language].required,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Attempting login with:', formData);
      console.log('API URL:', import.meta.env.VITE_API_URL || 'http://localhost:5001/api');
      
      const response = await apiClient.login(formData);
      console.log('Login response:', response);

      if (response.success) {
        // Store token and user data
        setAuthToken(response.data.token);
        setUser(response.data.user);

        toast({
          title: content[language].success,
          description: "Welcome to the admin panel!",
        });

        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      toast({
        title: content[language].error,
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-elegant pt-24 flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className={`text-2xl font-bold text-primary ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].title}
          </CardTitle>
          <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].subtitle}
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {content[language].username}
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`pl-10 ${isRTL ? 'text-right' : 'text-left'}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  placeholder={isRTL ? 'أدخل اسم المستخدم' : 'Enter username'}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {content[language].password}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 ${isRTL ? 'text-right' : 'text-left'}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter password'}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full btn-primary text-lg py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {content[language].loggingIn}
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  {content[language].login}
                </>
              )}
            </Button>
          </form>


        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
