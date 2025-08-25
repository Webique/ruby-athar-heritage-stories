import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, Users, Star, ArrowRight, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const BookingForm = ({ trip, isOpen, onClose, language, isRTL }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    date: '',
    tourType: '', // New field for Private Tour vs Group Tour
    package: '',
    participants: '1',
    addOns: []
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Helper function to check if an add-on is a meal
  const isMealAddon = (addonName) => {
    const mealKeywords = ['meal', 'lunch', 'dinner', 'وجبة', 'غداء', 'عشاء'];
    return mealKeywords.some(keyword => 
      addonName.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!trip || !formData.package || !formData.participants) return 0;
    
    const selectedPackage = trip.pricing.find(pkg => pkg.name === formData.package);
    if (!selectedPackage) return 0;
    
    let basePrice = 0;
    const participants = parseInt(formData.participants);
    
    // Extract price from package (handle different price formats)
    const priceText = selectedPackage.price;
    
    // Handle per-person pricing (SAR per person, ريال للشخص)
    if (priceText.includes('SAR per person') || priceText.includes('ريال للشخص')) {
      const priceMatch = priceText.match(/(\d+)/);
      if (priceMatch) {
        basePrice = parseInt(priceMatch[1]) * participants;
      }
    }
    // Handle fixed total pricing (like group packages)
    else if (priceText.includes('SAR') || priceText.includes('ريال')) {
      const priceMatch = priceText.match(/(\d+)/);
      if (priceMatch) {
        const extractedPrice = parseInt(priceMatch[1]);
        
        // Check if it's a group package with fixed total
        if (priceText.includes('Group Package') || priceText.includes('باقة المجموعات')) {
          // For group packages, check if it's per person or total
          if (priceText.includes('per person') || priceText.includes('للشخص')) {
            basePrice = extractedPrice * participants;
          } else {
            // Fixed total for group
            basePrice = extractedPrice;
          }
        } else if (priceText.includes('Total') || priceText.includes('المجموع')) {
          // Already total price, don't multiply
          basePrice = extractedPrice;
        } else {
          // Default: multiply by participants for individual packages
          basePrice = extractedPrice * participants;
        }
      }
    }
    
    // Add add-ons (excluding meals)
    let addOnsTotal = 0;
    let hasCustomTiming = false;
    
    formData.addOns.forEach(addonName => {
      const addon = trip?.addOns?.find(a => a.name === addonName);
      if (addon && !isMealAddon(addon.name)) {
        const addonPriceText = addon.price;
        const addonPriceMatch = addonPriceText.match(/(\d+)/);
        
        if (addonPriceMatch) {
          const addonPrice = parseInt(addonPriceMatch[1]);
          
          // Check for custom timing add-ons
          if (addon.name.includes('Custom Timing') || addon.name.includes('توقيت خاص')) {
            hasCustomTiming = true;
            if (addon.name.includes('Group') || addon.name.includes('مجموعة')) {
              // Group custom timing - fixed price
              addOnsTotal = addonPrice;
            } else {
              // Individual custom timing - per person
              addOnsTotal = addonPrice * participants;
            }
          } else if (addon.name.includes('VIP') || addon.name.includes('باقة VIP')) {
            // VIP package replaces base price
            addOnsTotal = addonPrice * participants;
          } else {
            // Regular add-on (per person)
            addOnsTotal += addonPrice * participants;
          }
        }
      }
    });
    
    // If custom timing is selected, it replaces the base package price
    if (hasCustomTiming) {
      return addOnsTotal;
    }
    
    // If VIP is selected, return only VIP price
    if (formData.addOns.some(addon => addon.includes('VIP'))) {
      return addOnsTotal;
    }
    
    return basePrice + addOnsTotal;
  };

  const totalPrice = calculateTotalPrice();

  // Debug price calculation
  console.log('Price Debug:', {
    trip: trip?.title,
    package: formData.package,
    participants: formData.participants,
    addOns: formData.addOns,
    totalPrice
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset add-ons when package changes (to avoid conflicts)
  const handlePackageChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      package: value,
      addOns: [] // Reset add-ons when package changes
    }));
  };

  // Handle tour type change
  const handleTourTypeChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      tourType: value,
      package: '', // Reset package when tour type changes
      addOns: [] // Reset add-ons when tour type changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare booking data for API
      const bookingData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        age: formData.age,
        date: formData.date,
        tourType: formData.tourType,
        package: formData.package,
        participants: formData.participants,
        addOns: formData.addOns,
        tripTitle: trip.title,
        language: language,
        totalPrice: totalPrice
      };

      // Submit to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://ruby-athar-heritage-stories.onrender.com'}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setShowConfirmation(true);
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          age: '',
          date: '',
          tourType: '',
          package: '',
          participants: '1',
          addOns: []
        });
      } else {
        console.error('Booking submission failed');
        alert('Failed to submit booking. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Error submitting booking. Please try again.');
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  const content = {
    en: {
      title: 'Book Your Journey',
      name: 'Full Name',
      phone: 'Phone Number',
      email: 'Email Address',
      age: 'Age',
      date: 'Preferred Date',
      tourType: 'Tour Type',
      package: 'Select Package',
      participants: 'Number of Participants',
      addOns: 'Add-Ons (Optional)',
      submit: 'Submit Booking',
      confirmation: 'Booking Submitted!',
      confirmationMessage: 'Thank you for your booking request. We will contact you via WhatsApp shortly.',
      close: 'Close'
    },
    ar: {
      title: 'احجز رحلتك',
      name: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      age: 'العمر',
      date: 'التاريخ المفضل',
      tourType: 'نوع الجولة',
      package: 'اختر الباقة',
      participants: 'عدد المشاركين',
      addOns: 'إضافات اختيارية',
      submit: 'إرسال الحجز',
      confirmation: 'تم إرسال الحجز!',
      confirmationMessage: 'شكراً لك على طلب الحجز. سنتواصل معك عبر واتساب قريباً.',
      close: 'إغلاق'
    }
  };

  if (showConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`max-w-[95vw] sm:max-w-md mx-2 max-h-[90vh] overflow-y-auto [&>button]:hidden ${isRTL ? 'text-right' : 'text-left'}`}>
          <DialogHeader className="px-2 sm:px-0 sticky top-0 bg-background z-10 pb-2">
            <DialogTitle className={`text-lg sm:text-xl font-bold text-primary text-center ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].confirmation}
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-4 sm:py-6 px-2 sm:px-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className={`text-sm sm:text-base text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].confirmationMessage}
            </p>
          </div>

          <div className={`flex justify-center sm:pt-4 px-2 sm:px-0 ${isRTL ? 'sm:justify-start' : 'sm:justify-end'}`}>
            <Button onClick={handleClose} className="btn-primary w-full sm:w-auto text-sm py-2">
              {content[language].close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

      return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`max-w-[95vw] sm:max-w-md mx-2 max-h-[90vh] overflow-y-auto [&>button]:hidden ${isRTL ? 'text-right' : 'text-left'}`}>
          <DialogHeader className="px-2 sm:px-0 sticky top-0 bg-background z-10 pb-2">
            <DialogTitle className={`text-lg sm:text-xl font-bold text-primary ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].title}
            </DialogTitle>
            <p className={`text-xs sm:text-sm text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {trip?.title}
            </p>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 px-2 sm:px-0">
          <div className="space-y-2">
            <Label htmlFor="name" className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].name}
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className={`text-sm py-2 ${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].phone}
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className={`text-sm py-2 ${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].email}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={`text-sm py-2 ${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].age}
            </Label>
            <Input
              id="age"
              name="age"
              type="number"
              min="1"
              max="120"
              required
              value={formData.age}
              onChange={handleInputChange}
              className={`text-sm py-2 ${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].date}
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.date}
              onChange={handleInputChange}
              className={`text-sm py-2 ${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {language === 'en' ? 'Please select your preferred date for the journey' : 'يرجى اختيار التاريخ المفضل للرحلة'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tourType" className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].tourType}
            </Label>
            <select
              id="tourType"
              name="tourType"
              required
              value={formData.tourType}
              onChange={handleTourTypeChange}
              className={`w-full px-3 py-2 border border-input rounded-md text-sm bg-background ${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="">{language === 'en' ? 'Select Tour Type' : 'اختر نوع الجولة'}</option>
              <option value="private">{language === 'en' ? 'Private Tour' : 'جولة خاصة'}</option>
              <option value="group">{language === 'en' ? 'Group Tour' : 'جولة مجموعة'}</option>
            </select>
            <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {language === 'en' 
                ? 'Private Tour: Exclusive for you and your chosen companions. Group Tour: Join other travelers on the same package.' 
                : 'جولة خاصة: حصرية لك ولرفقائك المختارين. جولة مجموعة: انضم إلى مسافرين آخرين في نفس الباقة.'
              }
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="package" className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].package}
            </Label>
            <select
              id="package"
              name="package"
              required
              value={formData.package}
              onChange={handlePackageChange}
              className={`w-full px-3 py-2 border border-input rounded-md text-sm bg-background ${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
              disabled={!formData.tourType}
            >
              <option value="">{language === 'en' ? 'Select Package' : 'اختر الباقة'}</option>
              {trip?.pricing?.filter(pkg => {
                if (!formData.tourType) return false;
                if (formData.tourType === 'private') {
                  return pkg.name.includes('Private Tour') || pkg.name.includes('جولة خاصة') || 
                         pkg.name.includes('Individual') || pkg.name.includes('Couple') || 
                         pkg.name.includes('Three People') || pkg.name.includes('باقة الفرد') ||
                         pkg.name.includes('باقة الزوجين') || pkg.name.includes('باقة ثلاثة أشخاص');
                } else if (formData.tourType === 'group') {
                  return pkg.name.includes('Group Tour') || pkg.name.includes('جولة مجموعة') ||
                         pkg.name.includes('Group Package') || pkg.name.includes('باقة المجموعات');
                }
                return false;
              }).map((pkg, idx) => (
                <option key={idx} value={pkg.name}>
                  {pkg.name} - {pkg.price}
                </option>
              ))}
            </select>
            {!formData.tourType && (
              <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {language === 'en' ? 'Please select a tour type first' : 'يرجى اختيار نوع الجولة أولاً'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="participants" className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].participants}
            </Label>
            <Input
              id="participants"
              name="participants"
              type="number"
              min="1"
              max="20"
              required
              value={formData.participants}
              onChange={handleInputChange}
              className={`text-sm py-2 ${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Add-Ons Selection */}
          {trip?.addOns && trip.addOns.length > 0 && (
            <div className="space-y-2">
              <Label className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {content[language].addOns}
              </Label>
              <div className="space-y-2">
                {trip.addOns.map((addon, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`addon-${idx}`}
                        checked={formData.addOns.includes(addon.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Special handling for VIP package
                            if (addon.name.includes('VIP') || addon.name.includes('باقة VIP')) {
                              setFormData(prev => ({
                                ...prev,
                                addOns: [addon.name] // Replace all with VIP only
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                addOns: [...prev.addOns, addon.name]
                              }));
                            }
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              addOns: prev.addOns.filter(name => name !== addon.name)
                            }));
                          }
                        }}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <Label htmlFor={`addon-${idx}`} className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
                        {addon.name} {!isMealAddon(addon.name) && `(+${addon.price})`}
                        {addon.name.includes('VIP') || addon.name.includes('باقة VIP') && (
                          <span className="text-xs text-muted-foreground ml-1">
                            {language === 'en' ? '(replaces standard package)' : '(تحل محل الباقة القياسية)'}
                          </span>
                        )}
                      </Label>
                    </div>
                    {isMealAddon(addon.name) && (
                      <p className={`text-xs text-orange-600 font-medium ${isRTL ? 'font-arabic text-right mr-6' : 'font-english ml-6'}`}>
                        {language === 'en' 
                          ? '* Not included in total price - pay when you receive the meal' 
                          : '* غير مشمول في السعر الإجمالي - ادفع عند تلقي الوجبة'
                        }
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Price Display */}
          {formData.package && (
            <div className={`border-t pt-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="bg-muted/50 rounded-lg p-3 md:p-4">
                <h4 className={`text-sm md:text-base font-semibold text-primary mb-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {language === 'en' ? 'Price Summary' : 'ملخص السعر'}
                </h4>
                
                {/* Package Details */}
                <div className="space-y-2 mb-3">
                  {/* Selected Date */}
                  {formData.date && (
                    <div className="flex justify-between items-center text-sm bg-primary/5 p-2 rounded">
                      <span className={`text-primary font-medium ${isRTL ? 'font-arabic' : 'font-english'}`}>
                        {language === 'en' ? 'Selected Date' : 'التاريخ المختار'}
                      </span>
                      <span className="font-medium text-primary">
                        {formData.date}
                      </span>
                    </div>
                  )}

                  {/* Tour Type */}
                  {formData.tourType && (
                    <div className="flex justify-between items-center text-sm bg-secondary/5 p-2 rounded">
                      <span className={`text-secondary font-medium ${isRTL ? 'font-arabic' : 'font-english'}`}>
                        {language === 'en' ? 'Tour Type' : 'نوع الجولة'}
                      </span>
                      <span className="font-medium text-secondary">
                        {formData.tourType === 'private' 
                          ? (language === 'en' ? 'Private Tour' : 'جولة خاصة')
                          : (language === 'en' ? 'Group Tour' : 'جولة مجموعة')
                        }
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className={isRTL ? 'font-arabic' : 'font-english'}>
                      {formData.package}
                    </span>
                    <span className="font-medium">
                      {trip?.pricing?.find(pkg => pkg.name === formData.package)?.price}
                    </span>
                  </div>
                  
                  {parseInt(formData.participants) > 1 && (
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span className={isRTL ? 'font-arabic' : 'font-english'}>
                        {language === 'en' ? 'Participants' : 'المشاركون'}: {formData.participants}
                      </span>
                      <span>
                        × {formData.participants}
                      </span>
                    </div>
                  )}
                </div>

                {/* Add-Ons */}
                {formData.addOns.length > 0 && (
                  <div className="space-y-2 mb-3">
                    <h5 className={`text-xs md:text-sm font-medium text-primary ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {language === 'en' ? 'Add-Ons' : 'الإضافات'}
                    </h5>
                    {formData.addOns.map((addonName, idx) => {
                      const addon = trip?.addOns?.find(a => a.name === addonName);
                      if (!addon) return null;
                      
                      const isMeal = isMealAddon(addon.name);
                      
                      return (
                        <div key={idx} className="space-y-1">
                          <div className={`flex justify-between items-center text-sm ${isMeal ? 'text-orange-600' : ''}`}>
                            <span className={isRTL ? 'font-arabic' : 'font-english'}>
                              {addon.name}
                              {isMeal && (
                                <span className="text-xs font-normal text-orange-500 ml-1">
                                  {language === 'en' ? '(not included)' : '(غير مشمول)'}
                                </span>
                              )}
                            </span>
                            <span className={`font-medium ${isMeal ? 'line-through text-orange-400' : ''}`}>
                              +{addon.price} {parseInt(formData.participants) > 1 && `× ${formData.participants}`}
                            </span>
                          </div>
                          {isMeal && (
                            <p className={`text-xs text-orange-600 ${isRTL ? 'font-arabic text-right mr-2' : 'font-english ml-2'}`}>
                              {language === 'en' 
                                ? 'Pay when you receive the meal' 
                                : 'ادفع عند تلقي الوجبة'
                              }
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Total */}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-base md:text-lg font-bold text-primary ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {language === 'en' ? 'Total' : 'المجموع'}
                    </span>
                    <span className="text-xl md:text-2xl font-bold text-secondary">
                      {totalPrice} {language === 'en' ? 'SAR' : 'ريال'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={`flex flex-col sm:flex-row gap-2 pt-4 ${isRTL ? 'sm:justify-start' : 'sm:justify-end'}`}>
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto text-sm py-2">
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button 
              type="submit" 
              className="btn-primary w-full sm:w-auto text-sm py-2"
              disabled={!formData.date || !formData.tourType || !formData.package}
            >
              {content[language].submit}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const TripModal = ({ trip, isOpen, onClose, language, isRTL }) => {
  if (!trip) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto mx-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        <DialogHeader className="px-2 md:px-0">
          <DialogTitle className={`text-xl sm:text-2xl font-bold text-primary ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
            {trip.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className={`space-y-4 md:space-y-6 px-2 md:px-0 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Experience Description */}
          <div className="space-y-2 md:space-y-3">
            <h3 className={`text-base md:text-lg font-semibold text-primary ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
              {language === 'en' ? 'Experience Description' : 'وصف التجربة'}
            </h3>
            <p className={`text-sm md:text-body text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
              {trip.fullDescription}
            </p>
          </div>

          {/* Experience Details */}
          <div className="space-y-2 md:space-y-3">
            <h3 className={`text-base md:text-lg font-semibold text-primary ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
              {language === 'en' ? 'Experience Details' : 'تفاصيل التجربة'}
            </h3>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {trip.details.map((detail, idx) => (
                <div key={idx} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className={`text-xs md:text-sm text-muted-foreground ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div className="space-y-2 md:space-y-3">
            <h3 className={`text-base md:text-lg font-semibold text-primary ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
              {language === 'en' ? "What's Included in the Base Price" : 'ما يشمله السعر الأساسي'}
            </h3>
            <div className={`grid grid-cols-1 gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {trip.included.map((item, idx) => (
                <div key={idx} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-secondary rounded-full flex-shrink-0"></div>
                  <span className={`text-xs md:text-sm text-muted-foreground ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Stations */}
          {trip.experienceStations && (
            <div className="space-y-2 md:space-y-3">
              <h3 className={`text-base md:text-lg font-semibold text-primary ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
                {language === 'en' ? 'Experience Stations' : 'محطات التجربة'}
              </h3>
              <div className={`grid grid-cols-1 gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {trip.experienceStations.map((station, idx) => (
                  <div key={idx} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs md:text-sm font-bold text-accent-foreground">{idx + 1}</span>
                    </div>
                    <span className={`text-xs md:text-sm text-muted-foreground ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
                      {station}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add-Ons */}
          {trip.addOns && (
            <div className="space-y-2 md:space-y-3">
              <h3 className={`text-base md:text-lg font-semibold text-primary ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
                {language === 'en' ? 'Add-Ons' : 'إضافات اختيارية'}
              </h3>
              <div className={`grid grid-cols-1 gap-3 md:gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                {trip.addOns.map((addon, idx) => (
                  <div key={idx} className={`border border-border rounded-lg p-3 md:p-4 bg-card ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`text-sm md:text-base font-semibold text-primary ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
                        {addon.name}
                      </h4>
                      <span className="text-base md:text-lg font-bold text-secondary">
                        +{addon.price}
                      </span>
                    </div>
                    <p className={`text-xs md:text-sm text-muted-foreground ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
                      {addon.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Packages */}
          <div className="space-y-2 md:space-y-3">
            <h3 className={`text-base md:text-lg font-semibold text-primary ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
              {language === 'en' ? 'Pricing Packages' : 'باقات الأسعار'}
            </h3>
            <div className={`grid grid-cols-1 gap-3 md:gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {trip.pricing.map((pkg, idx) => (
                <div key={idx} className={`border border-border rounded-lg p-3 md:p-4 bg-card ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h4 className={`text-sm md:text-base font-semibold text-primary mb-2 ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
                    {pkg.name}
                  </h4>
                  <p className={`text-base md:text-lg font-bold text-secondary mb-2 ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
                    {pkg.price}
                  </p>
                  <p className={`text-xs md:text-sm text-muted-foreground ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
                    {pkg.description}
                  </p>
                  {pkg.optional && (
                    <p className={`text-xs text-muted-foreground mt-1 ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
                      {pkg.optional}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="space-y-2 md:space-y-3">
            <h3 className={`text-base md:text-lg font-semibold text-primary ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
              {language === 'en' ? 'Important Notes' : 'ملاحظات مهمة'}
            </h3>
            <div className={`grid grid-cols-1 gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {trip.notes.map((note, idx) => (
                <div key={idx} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-accent rounded-full flex-shrink-0"></div>
                  <span className={`text-xs md:text-sm text-muted-foreground ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}>
                    {note}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`flex justify-end pt-4 md:pt-6 px-2 md:px-0 ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <Button onClick={onClose} className="btn-primary text-sm py-2 px-4">
            {language === 'en' ? 'Close' : 'إغلاق'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const JourneyContent = () => {
  const { language, isRTL, setLanguage } = useLanguage();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTripForBooking, setSelectedTripForBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Initialize language from URL parameter on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang === 'en' || urlLang === 'ar') {
      setLanguage(urlLang);
    }
  }, [location.search, setLanguage]);

  // Scroll to hash target with custom offsets per section
  useEffect(() => {
    const hash = location.hash ? location.hash.replace('#', '') : '';
    // Defer until after render to ensure elements exist
    requestAnimationFrame(() => {
      if (hash) {
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          const isMobile = window.innerWidth < 768; // md breakpoint
          const offsets: Record<string, number> = {
            top: isMobile ? 50 : 150,
            'stories-on-the-road': isMobile ? 250 : 350, // slightly deeper so it's above the section
            'cultural-spirit-adventures': isMobile ? 120 : 180,
          };
          const offset = offsets[hash] ?? (isMobile ? 80 : 150);
          const top = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } else {
        // No hash: don't force scroll so normal navigation stays at top naturally
      }
    });
  }, [location]);

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleBookJourney = (trip) => {
    setIsLoading(true);
    setSelectedTripForBooking(trip);
    
    // Simulate a brief loading delay for smooth UX
    setTimeout(() => {
      setIsLoading(false);
      setIsBookingOpen(true);
    }, 800);
  };

  const content = {
    en: {
      title: "Your Journey Awaits",
      subtitle: "Discover the hidden treasures of the Arabian Peninsula through our curated experiences",
      trips: [
        {
          id: 1,
          title: "Al-A'sha Experience – Wadi Hanifah",
          location: "Wadi Hanifah – Riyadh",
          duration: "2-3 Hours",
          groupSize: "5-15 People",
          rating: 4.7,
          highlights: ["Poetic journey", "Nature exploration", "Cultural experience", "Writing activity"],
          price: "From 85 SAR",
          originalPrice: "120 SAR",
          isOnSale: true,
          saleEndDate: "2024-12-31",
          image: "/src/assets/gallery/instruments.jpg",
          fullDescription: "A poetic journey through the heart of Wadi Hanifah, where enchanting nature meets the verses of Al-A'sha, offering an authentic and inspiring cultural experience.",
          details: [
            "Duration: 2–3 hours",
            "Location: Wadi Hanifah – Riyadh",
            "Language: Arabic (English translation available upon request)",
            "Participants: 5–15 people",
            "Timing: Every Saturday from 6:15 PM to 8:00 PM"
          ],
          included: [
            "🗺️ Guided field tour led by a guide sharing Al-A'sha's poems and stories",
            "📜 Interactive cards and brochure for all stations",
            "✍️ Writing activity (pens and papers for your own verses)",
            "☕ Light refreshments",
            "🌅 Closing session in the heart of the valley with a poetic farewell",
            "🛠️ Full organization and preparation of all stops and the route"
          ],
          addOns: [
            {
              name: "Custom Timing - Basic",
              price: "400 SAR per person",
              description: "Special/custom timings as requested by the client"
            },
            {
              name: "Custom Timing - Premium",
              price: "450 SAR per person",
              description: "Premium custom timings with enhanced services"
            },
            {
              name: "Custom Timing - Group",
              price: "3700 SAR",
              description: "Special/custom timings for groups"
            }
          ],
          pricing: [
            {
              name: "Private Tour - Standard Experience",
              price: "85 SAR per person",
              originalPrice: "120 SAR per person",
              description: "Basic package with all included features - LIMITED TIME OFFER!",
              optional: ""
            },
            {
              name: "Private Tour - Premium Package",
              price: "150 SAR per person",
              description: "Private session + additional hospitality",
              optional: ""
            },
            {
              name: "Group Tour (10 people)",
              price: "1300 SAR",
              description: "Best value for groups",
              optional: ""
            }
          ],
          notes: [
            "The experience does not include transportation to/from the meeting point",
            "Comfortable clothing and shoes recommended for walking",
            "Advance booking is required to confirm participation",
            "Available every Saturday from 6:15 PM to 8:00 PM"
          ]
        },
        {
          id: 2,
          title: "Noor Al-Manjour Tour",
          location: "Darb Al-Manjour, between East and West Tuwaiq Mountains",
          duration: "4-5 Hours",
          groupSize: "5-20 People",
          rating: 4.8,
          highlights: ["Interactive activities", "Sunset viewpoint", "Abu Fanous legend", "Cultural insights"],
          price: "From 300 SAR",
          image: "/src/assets/gallery/marketplace.jpg",
          fullDescription: "Embark on a cultural, historical, and field adventure through Darb Al-Manjour, where nature meets legends and heritage. Experience an exploratory journey between past and present, with interactive activities and a closing session that deepens your connection to the land and its stories.",
          details: [
            "Duration: 4–5 hours (1.5 hours transfer – 1–2 hours on site – 1.5 hours return)",
            "Location: Darb Al-Manjour, between East and West Tuwaiq Mountains",
            "Distance: 6 km",
            "Difficulty: Moderate",
            "Elevations: Highest point 965 m – Lowest point 702 m",
            "Participants: 5–20 people",
            "Language: Arabic (English translation available upon request)",
            "Target Audience: History lovers, nature enthusiasts, and cultural adventure seekers"
          ],
          included: [
            "🚗 Transportation to/from Riyadh",
            "🗺️ Guided tour narrating legends and heritage along the path",
            "☕ Drinks and light snacks",
            "📜 Interactive activity cards and brochures",
            "✍️ Group \"Abu Fanous Letter\" writing session",
            "🛠️ Full organization of the route and stops"
          ],
          experienceStations: [
            "Welcome and introduction to the plan and precautions",
            "Abu Fanous Station: Legend narration",
            "Walking through rocky terrain while sharing heritage and historical information",
            "Reaching the sunset viewpoint and panoramic view",
            "Closing session: hospitality, participant sharing, and writing \"Abu Fanous Letter\""
          ],
          pricing: [
            {
              name: "Private Tour - Standard Experience",
              price: "300 SAR per person",
              description: "Includes: transportation, guide, drinks, activities, and full organization",
              optional: ""
            },
            {
              name: "Private Tour - Premium Package",
              price: "350 SAR per person",
              description: "Private session or additional hospitality",
              optional: ""
            },
            {
              name: "Group Tour (10 people)",
              price: "2700 SAR",
              description: "Best value for groups",
              optional: ""
            }
          ],
          addOns: [
            {
              name: "Morning Trip (Sunrise)",
              price: "400 SAR per person",
              description: "Special morning timing from 4:00 AM to 8:00 AM"
            },
            {
              name: "Evening Trip",
              price: "400 SAR per person",
              description: "Special evening timing from 4:00 PM to 7:00 PM"
            },
            {
              name: "Custom Timing - Basic",
              price: "400 SAR per person",
              description: "Special/custom timings as requested by the client"
            },
            {
              name: "Custom Timing - Premium",
              price: "450 SAR per person",
              description: "Premium custom timings with enhanced services"
            },
            {
              name: "Custom Timing - Group",
              price: "3700 SAR",
              description: "Special/custom timings for groups"
            }
          ],
          notes: [
            "Comfortable clothing and shoes recommended for walking",
            "Advance booking required to confirm participation",
            "Morning trip: at sunrise, from 4:00 AM to 8:00 AM",
            "Evening trip: from 4:00 PM to 7:00 PM",
            "Special/custom timings available upon request"
          ]
        },
        {
          id: 3,
          title: "Diriyah Tour",
          location: "Diriyah, Riyadh",
          duration: "2.5-3 Hours",
          groupSize: "1-10 People",
          rating: 4.9,
          highlights: ["Ancient mud-brick streets", "Historic palaces", "Heritage stories", "Leadership history"],
          price: "From 200 SAR",
          image: "/src/assets/gallery/desert-ruins.jpg",
          fullDescription: "Discover the historic heart of Saudi Arabia with a cultural and historical adventure in Diriyah, the birthplace of the Saudi state. Walk through its ancient mud-brick streets, explore historic palaces, and immerse yourself in stories of heritage, leadership, and resilience.",
          details: [
            "Duration: 2.5–3 hours",
            "Location: Diriyah, Riyadh",
            "Difficulty: Easy to moderate",
            "Participants: 1–10 people",
            "Language: English / Arabic",
            "Includes transportation"
          ],
          included: [
            "Guided historical tour",
            "Full organization of stops and itinerary",
            "Entry tickets (50 SAR per person)",
            "Transportation within the tour",
            "Transportation to/from the meeting point"
          ],
          addOns: [
            {
              name: "Lunch/Dinner",
              price: "150 SAR per person",
              description: "Delicious local cuisine at a traditional restaurant"
            },
            {
              name: "Custom Timing - Basic",
              price: "400 SAR per person",
              description: "Special/custom timings as requested by the client"
            },
            {
              name: "Custom Timing - Premium",
              price: "450 SAR per person",
              description: "Premium custom timings with enhanced services"
            },
            {
              name: "Custom Timing - Group",
              price: "3700 SAR",
              description: "Special/custom timings for groups"
            }
          ],
          pricing: [
            {
              name: "Private Tour - Individual Package",
              price: "250 SAR per person",
              description: "Base package with all included features",
              optional: ""
            },
            {
              name: "Private Tour - Group Package (4–10 people)",
              price: "200 SAR per person",
              description: "Discounted rate for groups",
              optional: ""
            },
            {
              name: "Group Tour (4–10 people)",
              price: "200 SAR per person",
              description: "Group tour with other participants",
              optional: ""
            }
          ],
          notes: [
            "Comfortable walking shoes recommended",
            "Advance booking required to confirm participation",
            "Price includes transportation",
            "Diriyah timings: Saturday to Tuesday: 9:00 AM to 12:00 midnight; Wednesday to Friday: 9:00 AM to 1:00 AM",
            "Turaif District: daily from 5:00 PM to 12:00 midnight"
          ]
        },
        {
          id: 4,
          title: "Masmak Tour",
          location: "Central Riyadh – Al-Masmak & Al-Zal Market",
          duration: "2-4 Hours",
          groupSize: "5-15 People",
          rating: 4.9,
          highlights: ["Historical Riyadh", "Al-Masmak Fortress", "Al-Zal Market", "Cultural heritage"],
          price: "From 200 SAR",
          image: "/src/assets/gallery/trade-route.jpg",
          fullDescription: "Explore the history and culture of Riyadh in a unique journey from Al-Masmak Fortress, where the story of the capture of Riyadh began, to Al-Zal Market, one of the oldest traditional markets in the region. Learn about key historical events and immerse yourself in the vibrant heritage while enjoying shopping at the historic market.",
          details: [
            "Duration: 2–4 hours",
            "Location: Central Riyadh – Al-Masmak & Al-Zal Market",
            "Participants: 5–15 people",
            "Language: English (Arabic translation available upon request)",
            "Includes transportation within the tour"
          ],
          included: [
            "Guided cultural and historical tour",
            "Full organization of the route and stops",
            "Entry tickets to Al-Masmak Fortress",
            "Interactive cards and brochures for all stations",
            "Light refreshments",
            "Opportunities to shop at Al-Zal Market and take photos"
          ],
          addOns: [
            {
              name: "Custom Timing - Basic",
              price: "400 SAR per person",
              description: "Special/custom timings as requested by the client"
            },
            {
              name: "Custom Timing - Premium",
              price: "450 SAR per person",
              description: "Premium custom timings with enhanced services"
            },
            {
              name: "Custom Timing - Group",
              price: "3700 SAR",
              description: "Special/custom timings for groups"
            }
          ],
          pricing: [
            {
              name: "Private Tour - Individual Package",
              price: "250 SAR per person",
              description: "Base package with all included features",
              optional: ""
            },
            {
              name: "Private Tour - Group Package (4–15 people)",
              price: "200 SAR per person",
              description: "Discounted rate for groups",
              optional: ""
            },
            {
              name: "Group Tour (4–15 people)",
              price: "200 SAR per person",
              description: "Group tour with other participants",
              optional: ""
            }
          ],
          notes: [
            "Comfortable clothing and shoes recommended for walking",
            "Advance booking required to confirm participation",
            "Price includes guided tour, organization, and light refreshments",
            "Sunday to Thursday: 8:00 AM to 9:00 PM",
            "Friday: 4:00 PM to 8:00 PM",
            "Saturday: 9:00 AM to 8:00 PM"
          ]
        },
        {
          id: 5,
          title: "Riyadh Full Tour",
          location: "Riyadh – Multiple Locations",
          duration: "8-9 Hours",
          groupSize: "1-10 People",
          rating: 5.0,
          highlights: ["Al-Masmak Palace", "Al-Zal Market", "National Museum", "Al-Murabba", "Traditional Cuisine"],
          price: "From 450 SAR",
          image: "/src/assets/gallery/calligraphy.jpg",
          fullDescription: "A comprehensive full-day experience exploring the heart of Saudi Arabia's capital. Discover the rich history and culture of Riyadh through visits to iconic landmarks, traditional markets, and cultural institutions.",
          details: [
            "Duration: 8–9 hours",
            "Location: Riyadh – Multiple Locations",
            "Difficulty: Easy",
            "Participants: 1–10 people",
            "Language: Arabic/English",
            "Includes transportation and certified guide"
          ],
          included: [
            "Certified tour guide (Arabic/English)",
            "Transportation to/from meeting point + during the tour",
            "Full organization of the itinerary",
            "Water and light refreshments"
          ],
          experienceStations: [
            "Al-Masmak Palace – Learn about the recapture of Riyadh and the beginning of Saudi unification",
            "Al-Zal Market – Explore Riyadh's oldest traditional market + shopping time",
            "National Museum – Discover the history of the Arabian Peninsula through interactive exhibits",
            "Al-Murabba – Walk through the historic district and take photos"
          ],
          addOns: [
            {
              name: "Traditional Meal",
              price: "150 SAR per person",
              description: "Taste authentic Saudi cuisine at a traditional restaurant"
            },
            {
              name: "VIP Package",
              price: "700 SAR per person",
              description: "Private car + Personal guide + Photography + Gifts (replaces standard package)"
            },
            {
              name: "Custom Timing - Basic",
              price: "400 SAR per person",
              description: "Special/custom timings as requested by the client"
            },
            {
              name: "Custom Timing - Premium",
              price: "450 SAR per person",
              description: "Premium custom timings with enhanced services"
            },
            {
              name: "Custom Timing - Group",
              price: "3700 SAR",
              description: "Special/custom timings for groups"
            }
          ],
          pricing: [
            {
              name: "Private Tour - Individual Package",
              price: "600 SAR per person",
              description: "Base package with all included features",
              optional: ""
            },
            {
              name: "Private Tour - Couple Package (2 people)",
              price: "550 SAR per person",
              description: "Discounted rate for couples",
              optional: "Total: 1100 SAR"
            },
            {
              name: "Private Tour - Three People Package",
              price: "500 SAR per person",
              description: "Special rate for three people",
              optional: "Total: 1500 SAR"
            },
            {
              name: "Private Tour - Group Package (4–10 people)",
              price: "450 SAR per person",
              description: "Best value for groups",
              optional: "Total: 1800–4500 SAR"
            },
            {
              name: "Group Tour (4–10 people)",
              price: "450 SAR per person",
              description: "Group tour with other participants",
              optional: "Total: 1800–4500 SAR"
            }
          ],
          notes: [
            "Personal purchases not included",
            "Optional meal available as add-on",
            "VIP services available as separate package",
            "Comfortable clothing and walking shoes recommended"
          ]
        }
      ],
      cta: "Book This Journey",
      viewDetails: "View Details"
    },
    ar: {
      title: "رحلة تنتظرك",
      subtitle: "اكتشف كنوز شبه الجزيرة العربية المخفية من خلال تجاربنا المختارة",
      trips: [
        {
          id: 1,
          title: "تجربة الأعشى – وادي حنيفة",
          location: "وادي حنيفة – الرياض",
          duration: "2-3 ساعات",
          groupSize: "5-15 شخص",
          rating: 4.7,
          highlights: ["رحلة شعرية", "استكشاف الطبيعة", "تجربة ثقافية", "نشاط كتابي"],
          price: "ابتداءً من 85 ريال",
          originalPrice: "120 ريال",
          isOnSale: true,
          saleEndDate: "2024-12-31",
          image: "/src/assets/gallery/instruments.jpg",
          fullDescription: "رحلة شعرية في قلب وادي حنيفة، حيث تمتزج الطبيعة الساحرة مع قصائد الأعشى، فتعيش تجربة ثقافية أصيلة ومُلهمة.",
          details: [
            "المدة: ساعتان – 3 ساعات",
            "الموقع: وادي حنيفة – الرياض",
            "اللغة: العربية (مع إمكانية توفير ترجمة بالإنجليزية عند الطلب)",
            "عدد المشاركين: 5 – 15 شخص",
            "التوقيت: كل سبت من 6:15 م إلى 8:00 م"
          ],
          included: [
            "🗺️ جولة إرشادية ميدانية بقيادة مرشد/قائد يروي قصائد وقصص الأعشى",
            "📜 بطاقات وبروشور تفاعلي يرافقك خلال المحطات",
            "✍️ نشاط كتابي (أقلام وأوراق لتدوين أبياتك الخاصة)",
            "☕ مشروبات خفيفة",
            "🌅 جلسة ختامية في قلب الوادي مع وداع شعري",
            "🛠️ تنظيم وتجهيز كامل لنقاط التوقف ومسار الرحلة"
          ],
          addOns: [
            {
              name: "توقيت خاص - أساسي",
              price: "400 ريال للشخص",
              description: "توقيت خاص على طلب العميل"
            },
            {
              name: "توقيت خاص - بريميوم",
              price: "450 ريال للشخص",
              description: "توقيت خاص بريميوم مع خدمات محسنة"
            },
            {
              name: "توقيت خاص - مجموعة",
              price: "3700 ريال",
              description: "توقيت خاص لمجموعات"
            }
          ],
          pricing: [
            {
              name: "جولة خاصة - التجربة القياسية",
              price: "85 ريال للشخص",
              originalPrice: "120 ريال للشخص",
              description: "الباقة الأساسية مع جميع المميزات المدرجة - عرض محدود الوقت!",
              optional: ""
            },
            {
              name: "جولة خاصة - باقة بريميوم",
              price: "150 ريال للشخص",
              description: "جلسة خاصة + ضيافة إضافية",
              optional: ""
            },
            {
              name: "جولة مجموعة (10 أشخاص)",
              price: "1300 ريال",
              description: "أفضل قيمة للمجموعات",
              optional: ""
            }
          ],
          notes: [
            "التجربة لا تشمل المواصلات من/إلى نقطة اللقاء",
            "ينصح بارتداء ملابس وأحذية مريحة للمشي",
            "الحجز المسبق مطلوب لتأكيد مشاركتك",
            "متاح كل سبت من 6:15 م إلى 8:00 م"
          ]
        },
        {
          id: 2,
          title: "جولة نور المنجور",
          location: "درب المنجور، بين شرق وغرب جبال طويق",
          duration: "4-5 ساعات",
          groupSize: "5-20 شخص",
          rating: 4.8,
          highlights: ["أنشطة تفاعلية", "نقطة الغروب", "أسطورة أبو فانوس", "رؤى ثقافية"],
          price: "ابتداءً من 300 ريال",
          image: "/src/assets/gallery/marketplace.jpg",
          fullDescription: "انطلق في رحلة ثقافية وتاريخية ومغامرة ميدانية عبر درب المنجور، حيث الطبيعة تلتقي بالأساطير والتراث. عش تجربة استكشافية بين الماضي والحاضر، مع أنشطة تفاعلية وجلسة ختامية تعزز ارتباطك بالأرض وقصصها.",
          details: [
            "المدة: 4–5 ساعات (ساعة ونصف انتقال – 1–2 ساعة في الموقع – ساعة ونصف للعودة)",
            "الموقع: درب المنجور، بين شرق وغرب جبال طويق",
            "المسافة: 6 كم",
            "الصعوبة: متوسطة",
            "ارتفاعات: أعلى نقطة 965 م – أدنى نقطة 702 م",
            "عدد المشاركين: 5 – 20 شخص",
            "اللغة: العربية (مع إمكانية ترجمة بالإنجليزية عند الطلب)",
            "الفئة المستهدفة: عشاق التاريخ والطبيعة والمغامرة الثقافية"
          ],
          included: [
            "🚗 النقل من وإلى الرياض",
            "🗺️ مرشد سياحي يروي الأساطير والتراث خلال المسار",
            "☕ مشروبات ووجبات خفيفة",
            "📜 بطاقات وبروشور تفاعلي للأنشطة",
            "✍️ جلسة كتابة \"رسالة أبو فانوس\" الجماعية",
            "🛠️ تنظيم كامل للمسار ونقاط التوقف"
          ],
          experienceStations: [
            "استقبال وتعريف بالخطة والاحتياطات",
            "محطة أبو فانوس: سرد الأسطورة",
            "المشي عبر التضاريس الصخرية وسرد المعلومات التراثية والتاريخية",
            "الوصول إلى نقطة الغروب ومشاهدة المنظر البانورامي",
            "الجلسة الختامية: ضيافة، مشاركة المشاركين، وكتابة \"رسالة أبو فانوس\""
          ],
          pricing: [
            {
              name: "جولة خاصة - التجربة القياسية",
              price: "300 ريال للشخص",
              description: "تشمل: النقل، المرشد، المشروبات، الأنشطة، والتنظيم الكامل",
              optional: ""
            },
            {
              name: "جولة خاصة - باقة بريميوم",
              price: "350 ريال للشخص",
              description: "جلسة خاصة أو ضيافة إضافية",
              optional: ""
            },
            {
              name: "جولة مجموعة (10 أشخاص)",
              price: "2700 ريال",
              description: "أفضل قيمة للمجموعات",
              optional: ""
            }
          ],
          addOns: [
            {
              name: "رحلة الصبح",
              price: "400 ريال للشخص",
              description: "توقيت صبحي خاص من 4:00 ص إلى 8:00 ص"
            },
            {
              name: "رحلة العصر",
              price: "400 ريال للشخص",
              description: "توقيت عصري خاص من 4:00 م إلى 7:00 م"
            },
            {
              name: "توقيت خاص - أساسي",
              price: "400 ريال للشخص",
              description: "توقيت خاص على طلب العميل"
            },
            {
              name: "توقيت خاص - بريميوم",
              price: "450 ريال للشخص",
              description: "توقيت خاص بريميوم مع خدمات محسنة"
            },
            {
              name: "توقيت خاص - مجموعة",
              price: "3700 ريال",
              description: "توقيت خاص لمجموعات"
            }
          ],
          notes: [
            "ينصح بارتداء ملابس وأحذية مريحة للمشي",
            "الحجز المسبق مطلوب لتأكيد المشاركة",
            "رحلة الصبح: من 4:00 ص إلى 8:00 ص",
            "رحلة العصر: من 4:00 م إلى 7:00 م",
            "توقيت خاص متاح على طلب العميل"
          ]
        },
        {
          id: 3,
          title: "جولة الدرعية",
          location: "الدرعية، الرياض",
          duration: "2.5-3 ساعات",
          groupSize: "1-10 أشخاص",
          rating: 4.9,
          highlights: ["شوارع طينية قديمة", "قصور تاريخية", "قصص التراث", "تاريخ القيادة"],
          price: "ابتداءً من 200 ريال",
          image: "/src/assets/gallery/desert-ruins.jpg",
          fullDescription: "اكتشف قلب التاريخ في المملكة العربية السعودية مع مغامرة ثقافية وتاريخية في الدرعية، مسقط رأس الدولة السعودية. تجول في شوارعها الطينية القديمة، استكشف القصور القديمة، وانغمس في قصص التراث والقيادة والصمود.",
          details: [
            "المدة: 2.5–3 ساعات",
            "الموقع: الدرعية، الرياض",
            "الصعوبة: سهلة إلى متوسطة",
            "عدد المشاركين: 1–10 أشخاص",
            "اللغة: الإنجليزية / العربية",
            "يشمل النقل"
          ],
          included: [
            "الجولة الإرشادية والتاريخية",
            "تنظيم كامل لنقاط التوقف والمسار",
            "تذاكر الدخول (50 ريال لكل شخص)",
            "النقل من موقع الانطلاق إلى الدرعية والعودة"
          ],
          addOns: [
            {
              name: "الغداء/العشاء",
              price: "150 ريال للشخص",
              description: "مأكولات محلية لذيذة في مطعم تقليدي"
            },
            {
              name: "توقيت خاص - أساسي",
              price: "400 ريال للشخص",
              description: "توقيت خاص على طلب العميل"
            },
            {
              name: "توقيت خاص - بريميوم",
              price: "450 ريال للشخص",
              description: "توقيت خاص بريميوم مع خدمات محسنة"
            },
            {
              name: "توقيت خاص - مجموعة",
              price: "3700 ريال",
              description: "توقيت خاص لمجموعات"
            }
          ],
          pricing: [
            {
              name: "جولة خاصة - باقة الفرد الواحد",
              price: "250 ريال للشخص",
              description: "الباقة الأساسية مع جميع المميزات المدرجة",
              optional: ""
            },
            {
              name: "جولة خاصة - باقة المجموعات (4–10 أشخاص)",
              price: "200 ريال للشخص",
              description: "سعر مخفض للمجموعات",
              optional: ""
            },
            {
              name: "جولة مجموعة (4–10 أشخاص)",
              price: "200 ريال للشخص",
              description: "جولة مجموعة مع مشاركين آخرين",
              optional: ""
            }
          ],
          notes: [
            "ينصح بارتداء أحذية مريحة للمشي",
            "الحجز المسبق مطلوب لتأكيد المشاركة",
            "السعر يشمل النقل",
            "أوقات الدرعية: من السبت إلى الثلاثاء: من 9:00 ص إلى 12:00 منتصف الليل؛ من الأربعاء إلى الجمعة: من 9:00 ص إلى 1:00 ص",
            "حي الطريف: يومياً من 5:00 م إلى 12:00 منتصف الليل"
          ]
        },
        {
          id: 4,
          title: "جولة المصمك",
          location: "وسط الرياض – المصمك وسوق الزل",
          duration: "2-4 ساعات",
          groupSize: "5-15 شخص",
          rating: 4.9,
          highlights: ["الرياض التاريخية", "قلعة المصمك", "سوق الزل", "التراث الثقافي"],
          price: "ابتداءً من 200 ريال",
          image: "/src/assets/gallery/trade-route.jpg",
          fullDescription: "استكشف تاريخ وثقافة الرياض في رحلة فريدة من قلعة المصمك، حيث بدأت قصة استعادة الرياض، إلى سوق الزل، أحد أقدم الأسواق التقليدية في المنطقة. تعلم عن الأحداث التاريخية المهمة وانغمس في التراث النابض بالحياة مع الاستمتاع بالتسوق في السوق التاريخي.",
          details: [
            "المدة: 2–4 ساعات",
            "الموقع: وسط الرياض – المصمك وسوق الزل",
            "عدد المشاركين: 5–15 شخص",
            "اللغة: الإنجليزية (مع إمكانية توفير ترجمة بالعربية عند الطلب)",
            "يشمل النقل"
          ],
          included: [
            "جولة ثقافية وتاريخية إرشادية",
            "تنظيم كامل للمسار ونقاط التوقف",
            "تذاكر الدخول لقلعة المصمك",
            "بطاقات وبروشور تفاعلي لجميع المحطات",
            "مشروبات خفيفة",
            "فرص للتسوق في سوق الزل والتقاط الصور"
          ],
          addOns: [
            {
              name: "توقيت خاص - أساسي",
              price: "400 ريال للشخص",
              description: "توقيت خاص على طلب العميل"
            },
            {
              name: "توقيت خاص - بريميوم",
              price: "450 ريال للشخص",
              description: "توقيت خاص بريميوم مع خدمات محسنة"
            },
            {
              name: "توقيت خاص - مجموعة",
              price: "3700 ريال",
              description: "توقيت خاص لمجموعات"
            }
          ],
          pricing: [
            {
              name: "جولة خاصة - باقة الفرد الواحد",
              price: "250 ريال للشخص",
              description: "الباقة الأساسية مع جميع المميزات المدرجة",
              optional: ""
            },
            {
              name: "جولة خاصة - باقة المجموعات (4–15 شخص)",
              price: "200 ريال للشخص",
              description: "سعر مخفض للمجموعات",
              optional: ""
            },
            {
              name: "جولة مجموعة (4–15 شخص)",
              price: "200 ريال للشخص",
              description: "جولة مجموعة مع مشاركين آخرين",
              optional: ""
            }
          ],
          notes: [
            "ينصح بارتداء ملابس وأحذية مريحة للمشي",
            "الحجز المسبق مطلوب لتأكيد المشاركة",
            "السعر يشمل الجولة الإرشادية والتنظيم والمشروبات الخفيفة",
            "الأحد إلى الخميس: من 8:00 ص إلى 9:00 م",
            "الجمعة: من 4:00 م إلى 8:00 م",
            "السبت: من 9:00 ص إلى 8:00 م"
          ]
        },
        {
          id: 5,
          title: "جولة الرياض الكاملة",
          location: "الرياض – مواقع متعددة",
          duration: "8-9 ساعات",
          groupSize: "1-10 أشخاص",
          rating: 5.0,
          highlights: ["قصر المصمك", "سوق الزل", "المتحف الوطني", "حي المربع", "المأكولات التقليدية"],
          price: "ابتداءً من 450 ريال",
          image: "/src/assets/gallery/calligraphy.jpg",
          fullDescription: "تجربة شاملة ليوم كامل تستكشف قلب عاصمة المملكة العربية السعودية. اكتشف التاريخ والثقافة الغنية للرياض من خلال زيارة المعالم الشهيرة والأسواق التقليدية والمؤسسات الثقافية.",
          details: [
            "المدة: 8–9 ساعات",
            "الموقع: الرياض – مواقع متعددة",
            "الصعوبة: سهلة",
            "عدد المشاركين: 1–10 أشخاص",
            "اللغة: العربية/الإنجليزية",
            "يشمل النقل والمرشد المعتمد"
          ],
          included: [
            "مرشد سياحي معتمد (عربي/إنجليزي)",
            "النقل من وإلى نقطة اللقاء + أثناء الجولة",
            "تنظيم كامل للمسار",
            "ماء ومشروبات خفيفة"
          ],
          experienceStations: [
            "قصر المصمك – تعلم عن استعادة الرياض وبداية توحيد المملكة",
            "سوق الزل – استكشف أقدم سوق تقليدي في الرياض + وقت للتسوق",
            "المتحف الوطني – اكتشف تاريخ شبه الجزيرة العربية من خلال المعارض التفاعلية",
            "حي المربع – تجول في الحي التاريخي والتقط الصور"
          ],
          addOns: [
            {
              name: "وجبة تقليدية",
              price: "150 ريال للشخص",
              description: "تذوق المأكولات السعودية الأصيلة في مطعم تقليدي"
            },
            {
              name: "باقة VIP",
              price: "700 ريال للشخص",
              description: "سيارة خاصة + مرشد شخصي + تصوير + هدايا (تحل محل الباقة القياسية)"
            },
            {
              name: "توقيت خاص - أساسي",
              price: "400 ريال للشخص",
              description: "توقيت خاص على طلب العميل"
            },
            {
              name: "توقيت خاص - بريميوم",
              price: "450 ريال للشخص",
              description: "توقيت خاص بريميوم مع خدمات محسنة"
            },
            {
              name: "توقيت خاص - مجموعة",
              price: "3700 ريال",
              description: "توقيت خاص لمجموعات"
            }
          ],
          pricing: [
            {
              name: "جولة خاصة - باقة الفرد الواحد",
              price: "600 ريال للشخص",
              description: "الباقة الأساسية مع جميع المميزات المدرجة",
              optional: ""
            },
            {
              name: "جولة خاصة - باقة الزوجين (شخصان)",
              price: "550 ريال للشخص",
              description: "سعر مخفض للزوجين",
              optional: "المجموع: 1100 ريال"
            },
            {
              name: "جولة خاصة - باقة ثلاثة أشخاص",
              price: "500 ريال للشخص",
              description: "سعر خاص لثلاثة أشخاص",
              optional: "المجموع: 1500 ريال"
            },
            {
              name: "جولة خاصة - باقة المجموعات (4–10 أشخاص)",
              price: "450 ريال للشخص",
              description: "أفضل قيمة للمجموعات",
              optional: "المجموع: 1800–4500 ريال"
            },
            {
              name: "جولة مجموعة (4–10 أشخاص)",
              price: "450 ريال للشخص",
              description: "جولة مجموعة مع مشاركين آخرين",
              optional: "المجموع: 1800–4500 ريال"
            }
          ],
          notes: [
            "المشتريات الشخصية غير مشمولة",
            "الوجبة الاختيارية متاحة كإضافة",
            "خدمات VIP متاحة كباقة منفصلة",
            "ينصح بارتداء ملابس وأحذية مريحة للمشي"
          ]
        }
      ],
      cta: "احجز هذه الرحلة",
      viewDetails: "عرض التفاصيل"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-elegant pt-20 md:pt-24">
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-16" id="top">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className={`text-3xl sm:text-4xl md:text-hero font-bold text-primary mb-4 md:mb-6 px-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].title}
          </h1>
          <p className={`text-base sm:text-lg md:text-large text-muted-foreground max-w-3xl mx-auto px-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].subtitle}
          </p>
        </div>

        {/* Journey Cards */}
        <div className="space-y-12 max-w-7xl mx-auto">
          {/* Section 1: على خطى التاريخ | In the Footsteps of History - UNIQUE_ID_1 */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {language === 'en' ? 'In the Footsteps of History' : 'على خطى التاريخ'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
              {content[language].trips.filter(trip => [3, 4, 5].includes(trip.id)).map((trip) => (
                <Card key={trip.id} className="card-premium animate-scale-in hover:shadow-glow transition-all duration-300 h-full flex flex-col">
                  <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className={`text-lg sm:text-xl font-bold text-primary mb-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                          {trip.title}
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className={isRTL ? 'font-arabic' : 'font-english'}>{trip.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className={isRTL ? 'font-arabic' : 'font-english'}>{trip.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className={isRTL ? 'font-arabic' : 'font-english'}>{trip.groupSize}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start">
                        {/* Sale Badge */}
                        {trip.isOnSale && (
                          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-lg">
                            {language === 'en' ? 'SALE!' : 'تخفيض!'}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1 bg-gradient-gold px-2 py-1 sm:px-3 rounded-full">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-foreground fill-current" />
                          <span className="text-secondary-foreground font-semibold text-xs sm:text-sm">{trip.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6 flex-1 flex flex-col">
                    <p className={`text-sm sm:text-body text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {trip.fullDescription}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className={`text-sm sm:text-base font-semibold text-primary ${isRTL ? 'font-arabic' : 'font-english'}`}>
                        {language === 'en' ? 'Highlights' : 'أبرز المميزات'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {trip.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full flex-shrink-0"></div>
                            <span className={isRTL ? 'font-arabic' : 'font-english'}>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 md:pt-4 mt-auto">
                      <div className="text-center sm:text-left">
                        {/* Sale Badge */}
                        {trip.isOnSale && (
                          <div className="mb-2">
                            <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                              {language === 'en' ? '🔥 SALE! 29% OFF' : '🔥 تخفيض! خصم 29%'}
                            </span>
                          </div>
                        )}
                        
                        <div className="text-xl sm:text-2xl font-bold text-primary">
                          {trip.isOnSale ? (
                            <div className="flex items-center gap-2">
                              <span className="text-red-600">{trip.price}</span>
                              {trip.originalPrice && (
                                <span className="text-lg text-muted-foreground line-through">
                                  {trip.originalPrice}
                                </span>
                              )}
                            </div>
                          ) : (
                            trip.price
                          )}
                        </div>
                        
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {trip.isOnSale ? (
                            <span className="text-red-600 font-medium">
                              {language === 'en' ? 'Limited Time Offer - Save 35 SAR!' : 'عرض محدود الوقت - وفر 35 ريال!'}
                            </span>
                          ) : (
                            language === 'en' ? 'Starting price per person' : 'السعر الابتدائي للشخص'
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          className="btn-gold w-full sm:w-auto text-sm py-2"
                          onClick={() => handleViewDetails(trip)}
                        >
                          {content[language].viewDetails}
                        </Button>
                        <Button 
                          className="btn-primary w-full sm:w-auto text-sm py-2"
                          onClick={() => handleBookJourney(trip)}
                        >
                          {content[language].cta}
                          <ArrowRight className={`h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 ${isRTL ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Section 2: حكايات على الطريق | Stories on the Road - UNIQUE_ID_2 */}
          <div className="space-y-6" id="stories-on-the-road">
            <div className="text-center">
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {language === 'en' ? 'Stories on the Road' : 'حكايات على الطريق'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
              {content[language].trips.filter(trip => [1].includes(trip.id)).map((trip) => (
                <Card key={trip.id} className="card-premium animate-scale-in hover:shadow-glow transition-all duration-300 h-full flex flex-col">
                  <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className={`text-lg sm:text-xl font-bold text-primary mb-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                          {trip.title}
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className={isRTL ? 'font-arabic' : 'font-english'}>{trip.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className={isRTL ? 'font-arabic' : 'font-english'}>{trip.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className={isRTL ? 'font-arabic' : 'font-english'}>{trip.groupSize}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start">
                        {/* Sale Badge */}
                        {trip.isOnSale && (
                          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-lg">
                            {language === 'en' ? 'SALE!' : 'تخفيض!'}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1 bg-gradient-gold px-2 py-1 sm:px-3 rounded-full">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-foreground fill-current" />
                          <span className="text-secondary-foreground font-semibold text-xs sm:text-sm">{trip.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6 flex-1 flex flex-col">
                    <p className={`text-sm sm:text-body text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {trip.fullDescription}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className={`text-sm sm:text-base font-semibold text-primary ${isRTL ? 'font-arabic' : 'font-english'}`}>
                        {language === 'en' ? 'Highlights' : 'أبرز المميزات'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {trip.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full flex-shrink-0"></div>
                            <span className={isRTL ? 'font-arabic' : 'font-english'}>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 md:pt-4 mt-auto">
                      <div className="text-center sm:text-left">
                        {/* Sale Badge */}
                        {trip.isOnSale && (
                          <div className="mb-2">
                            <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                              {language === 'en' ? '🔥 SALE! 29% OFF' : '🔥 تخفيض! خصم 29%'}
                            </span>
                          </div>
                        )}
                        
                        <div className="text-xl sm:text-2xl font-bold text-primary">
                          {trip.isOnSale ? (
                            <div className="flex items-center gap-2">
                              <span className="text-red-600">{trip.price}</span>
                              {trip.originalPrice && (
                                <span className="text-lg text-muted-foreground line-through">
                                  {trip.originalPrice}
                                </span>
                              )}
                            </div>
                          ) : (
                            trip.price
                          )}
                        </div>
                        
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {trip.isOnSale ? (
                            <span className="text-red-600 font-medium">
                              {language === 'en' ? 'Limited Time Offer - Save 35 SAR!' : 'عرض محدود الوقت - وفر 35 ريال!'}
                            </span>
                          ) : (
                            language === 'en' ? 'Starting price per person' : 'السعر الابتدائي للشخص'
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          className="btn-gold w-full sm:w-auto text-sm py-2"
                          onClick={() => handleViewDetails(trip)}
                        >
                          {content[language].viewDetails}
                        </Button>
                        <Button 
                          className="btn-primary w-full sm:w-auto text-sm py-2"
                          onClick={() => handleBookJourney(trip)}
                        >
                          {content[language].cta}
                          <ArrowRight className={`h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 ${isRTL ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Section 3: مغامرات بروح ثقافية | Cultural Spirit Adventures - UNIQUE_ID_3 */}
          <div className="space-y-6" id="cultural-spirit-adventures">
            <div className="text-center">
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {language === 'en' ? 'Cultural Spirit Adventures' : 'مغامرات بروح ثقافية'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
              {content[language].trips.filter(trip => [2].includes(trip.id)).map((trip) => (
                <Card key={trip.id} className="card-premium animate-scale-in hover:shadow-glow transition-all duration-300 h-full flex flex-col">
                  <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className={`text-lg sm:text-xl font-bold text-primary mb-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                          {trip.title}
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className={isRTL ? 'font-arabic' : 'font-english'}>{trip.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className={isRTL ? 'font-arabic' : 'font-english'}>{trip.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className={isRTL ? 'font-arabic' : 'font-english'}>{trip.groupSize}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start">
                        {/* Sale Badge */}
                        {trip.isOnSale && (
                          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-lg">
                            {language === 'en' ? 'SALE!' : 'تخفيض!'}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1 bg-gradient-gold px-2 py-1 sm:px-3 rounded-full">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-foreground fill-current" />
                          <span className="text-secondary-foreground font-semibold text-xs sm:text-sm">{trip.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6 flex-1 flex flex-col">
                    <p className={`text-sm sm:text-body text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {trip.fullDescription}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className={`text-sm sm:text-base font-semibold text-primary ${isRTL ? 'font-arabic' : 'font-english'}`}>
                        {language === 'en' ? 'Highlights' : 'أبرز المميزات'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {trip.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full flex-shrink-0"></div>
                            <span className={isRTL ? 'font-arabic' : 'font-english'}>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 md:pt-4 mt-auto">
                      <div className="text-center sm:text-left">
                        {/* Sale Badge */}
                        {trip.isOnSale && (
                          <div className="mb-2">
                            <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                              {language === 'en' ? '🔥 SALE! 29% OFF' : '🔥 تخفيض! خصم 29%'}
                            </span>
                          </div>
                        )}
                        
                        <div className="text-xl sm:text-2xl font-bold text-primary">
                          {trip.isOnSale ? (
                            <div className="flex items-center gap-2">
                              <span className="text-red-600">{trip.price}</span>
                              {trip.originalPrice && (
                                <span className="text-lg text-muted-foreground line-through">
                                  {trip.originalPrice}
                                </span>
                              )}
                            </div>
                          ) : (
                            trip.price
                          )}
                        </div>
                        
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {trip.isOnSale ? (
                            <span className="text-red-600 font-medium">
                              {language === 'en' ? 'Limited Time Offer - Save 35 SAR!' : 'عرض محدود الوقت - وفر 35 ريال!'}
                            </span>
                          ) : (
                            language === 'en' ? 'Starting price per person' : 'السعر الابتدائي للشخص'
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          className="btn-gold w-full sm:w-auto text-sm py-2"
                          onClick={() => handleViewDetails(trip)}
                        >
                          {content[language].viewDetails}
                        </Button>
                        <Button 
                          className="btn-primary w-full sm:w-auto text-sm py-2"
                          onClick={() => handleBookJourney(trip)}
                        >
                          {content[language].cta}
                          <ArrowRight className={`h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 ${isRTL ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Trip Details Modal */}
        <TripModal 
          trip={selectedTrip}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          language={language}
          isRTL={isRTL}
        />

        {/* Booking Form Modal */}
        <BookingForm 
          trip={selectedTripForBooking}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          language={language}
          isRTL={isRTL}
        />

        {/* Loading Popup */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-background rounded-lg p-8 shadow-2xl border border-border max-w-sm mx-4">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <div>
                  <h3 className={`text-lg font-semibold text-primary ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {language === 'en' ? 'Preparing Your Journey...' : 'نحضر رحلتك...'}
                  </h3>
                  <p className={`text-sm text-muted-foreground mt-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {language === 'en' ? 'Please wait while we set up your booking form' : 'يرجى الانتظار بينما نعد نموذج الحجز الخاص بك'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Journey = () => {
  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <Header />
      <JourneyContent />
      <Footer />
    </div>
  );
};

export default Journey; 