import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

const SignUp = () => {
  const { signup, loading } = useAuth();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    nationality: "",
    phone: "",
    city: "",
    country: "",
    occupation: "",
    marital_status: "",
    sleep_hours: "",
    exercise_frequency: "",
    smoking_status: "",
    alcohol_consumption: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  // Enhanced validation functions
  const validateEmail = (email: string): string | null => {
    if (!email) return "Email address is required";
    if (email.length > 254) return "Email address is too long";
    
    // More comprehensive email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (password.length > 128) return "Password is too long (maximum 128 characters)";
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    if (!/(?=.*[@$!%*?&])/.test(password)) return "Password must contain at least one special character (@$!%*?&)";
    if (/\s/.test(password)) return "Password cannot contain spaces";
    
    return null;
  };

  const validateFullName = (name: string): string | null => {
    if (!name) return "Full name is required";
    if (name.trim().length < 2) return "Full name must be at least 2 characters long";
    if (name.trim().length > 100) return "Full name is too long (maximum 100 characters)";
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) return "Full name can only contain letters, spaces, hyphens, and apostrophes";
    if (name.trim().split(' ').length < 2) return "Please enter your full name (first and last name)";
    
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone) return "Phone number is required";
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) return "Phone number must be at least 10 digits";
    if (cleanPhone.length > 15) return "Phone number is too long (maximum 15 digits)";
    if (!/^[\+]?[\d\s\-\(\)]+$/.test(phone)) return "Phone number contains invalid characters";
    
    return null;
  };

  const validateAge = (dob: string): string | null => {
    if (!dob) return "Date of birth is required";
    
    const birthDate = new Date(dob);
    const today = new Date();
    
    if (birthDate >= today) return "Date of birth must be in the past";
    
    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) return "You must be at least 18 years old to register";
    if (age > 120) return "Please enter a valid date of birth";
    
    return null;
  };

  const validateText = (value: string, fieldName: string, minLength: number = 2, maxLength: number = 50): string | null => {
    if (!value) return `${fieldName} is required`;
    if (value.trim().length < minLength) return `${fieldName} must be at least ${minLength} characters long`;
    if (value.trim().length > maxLength) return `${fieldName} is too long (maximum ${maxLength} characters)`;
    if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
    
    return null;
  };

  const validateSleepHours = (hours: string): string | null => {
    if (!hours) return null; // Optional field
    const numHours = parseFloat(hours);
    if (isNaN(numHours)) return "Sleep hours must be a valid number";
    if (numHours < 0) return "Sleep hours cannot be negative";
    if (numHours > 24) return "Sleep hours cannot exceed 24 hours";
    if (numHours < 3) return "Please enter a realistic sleep duration (at least 3 hours)";
    
    return null;
  };

  const validatePage1 = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate full name
    const nameError = validateFullName(formData.full_name);
    if (nameError) newErrors.full_name = nameError;
    
    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    // Validate date of birth
    const dobError = validateAge(formData.dob);
    if (dobError) newErrors.dob = dobError;
    
    // Validate gender
    if (!formData.gender) newErrors.gender = "Please select your gender";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePage2 = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate nationality
    const nationalityError = validateText(formData.nationality, "Nationality", 2, 50);
    if (nationalityError) newErrors.nationality = nationalityError;
    
    // Validate phone
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    
    // Validate city
    const cityError = validateText(formData.city, "City", 2, 50);
    if (cityError) newErrors.city = cityError;
    
    // Validate country
    const countryError = validateText(formData.country, "Country", 2, 50);
    if (countryError) newErrors.country = countryError;
    
    // Validate occupation (if provided)
    if (formData.occupation) {
      const occupationError = validateText(formData.occupation, "Occupation", 2, 100);
      if (occupationError) newErrors.occupation = occupationError;
    }
    
    // Validate sleep hours (if provided)
    const sleepError = validateSleepHours(formData.sleep_hours);
    if (sleepError) newErrors.sleep_hours = sleepError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time validation on blur
  const handleBlur = (fieldName: string) => {
    const newErrors = { ...errors };
    
    switch (fieldName) {
      case 'full_name':
        const nameError = validateFullName(formData.full_name);
        if (nameError) newErrors.full_name = nameError;
        else delete newErrors.full_name;
        break;
      case 'email':
        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;
        else delete newErrors.email;
        break;
      case 'password':
        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;
        else delete newErrors.password;
        break;
      case 'phone':
        const phoneError = validatePhone(formData.phone);
        if (phoneError) newErrors.phone = phoneError;
        else delete newErrors.phone;
        break;
      case 'dob':
        const dobError = validateAge(formData.dob);
        if (dobError) newErrors.dob = dobError;
        else delete newErrors.dob;
        break;
    }
    
    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Apply formatting for specific fields
    let formattedValue = value;
    
    if (name === 'full_name') {
      // Capitalize first letter of each word, limit special characters
      formattedValue = value.replace(/[^a-zA-Z\s'-]/g, '').replace(/\b\w/g, l => l.toUpperCase());
    } else if (name === 'phone') {
      // Allow only numbers, spaces, dashes, parentheses, and plus sign
      formattedValue = value.replace(/[^\d\s\-\(\)\+]/g, '');
    } else if (name === 'nationality' || name === 'city' || name === 'country') {
      // Capitalize and remove numbers/special chars except spaces and hyphens
      formattedValue = value.replace(/[^a-zA-Z\s'-]/g, '').replace(/\b\w/g, l => l.toUpperCase());
    } else if (name === 'sleep_hours') {
      // Allow only numbers and decimal point
      formattedValue = value.replace(/[^\d.]/g, '');
      // Prevent multiple decimal points
      const parts = formattedValue.split('.');
      if (parts.length > 2) {
        formattedValue = parts[0] + '.' + parts.slice(1).join('');
      }
    } else if (name === 'occupation') {
      // Remove leading/trailing spaces and limit length
      formattedValue = value.slice(0, 100);
    }
    
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user makes selection
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (validatePage1()) setPage(2);
  };
  const handlePrevious = () => setPage(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePage2()) return;
    try {
      const payload = { ...formData, sleep_hours: parseFloat(formData.sleep_hours) };
      await signup(payload);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-health-secondary">
            Create an account
          </CardTitle>
          <CardDescription>Enter your information to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={page === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit}>
            {page === 1 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('full_name')}
                    className={errors.full_name ? "border-red-500" : ""}
                    maxLength={100}
                    autoComplete="name"
                  />
                  {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    className={errors.email ? "border-red-500" : ""}
                    maxLength={254}
                    autoComplete="email"
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                    className={errors.password ? "border-red-500" : ""}
                    maxLength={128}
                    autoComplete="new-password"
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  {!errors.password && formData.password && (
                    <p className="text-xs text-gray-500">
                      Password must contain: 8+ characters, uppercase, lowercase, number, and special character
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      onBlur={() => handleBlur('dob')}
                      className={errors.dob ? "border-red-500" : ""}
                      max={new Date().toISOString().split('T')[0]}
                      autoComplete="bday"
                    />
                    {errors.dob && <p className="text-sm text-red-500">{errors.dob}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(v) => handleSelectChange("gender", v)}
                    >
                      <SelectTrigger id="gender" className={errors.gender ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-health-primary hover:bg-health-secondary">
                  Next
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Input
                      id="nationality"
                      name="nationality"
                      placeholder="Enter your nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      className={errors.nationality ? "border-red-500" : ""}
                      maxLength={50}
                      autoComplete="country-name"
                    />
                    {errors.nationality && <p className="text-sm text-red-500">{errors.nationality}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur('phone')}
                      className={errors.phone ? "border-red-500" : ""}
                      autoComplete="tel"
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? "border-red-500" : ""}
                      maxLength={50}
                      autoComplete="address-level2"
                    />
                    {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      placeholder="Enter your country"
                      value={formData.country}
                      onChange={handleChange}
                      className={errors.country ? "border-red-500" : ""}
                      maxLength={50}
                      autoComplete="country"
                    />
                    {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    placeholder="Enter your occupation (optional)"
                    value={formData.occupation}
                    onChange={handleChange}
                    className={errors.occupation ? "border-red-500" : ""}
                    maxLength={100}
                    autoComplete="organization-title"
                  />
                  {errors.occupation && <p className="text-sm text-red-500">{errors.occupation}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marital_status">Marital Status</Label>
                  <Select
                    value={formData.marital_status}
                    onValueChange={(v) => handleSelectChange("marital_status", v)}
                  >
                    <SelectTrigger id="marital_status">
                      <SelectValue placeholder="Select your marital status (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                      <SelectItem value="Separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Lifestyle Information <span className="text-gray-500 font-normal">(Optional)</span></h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sleep_hours">Sleep Hours (daily)</Label>
                      <Input
                        id="sleep_hours"
                        name="sleep_hours"
                        type="number"
                        placeholder="8.0"
                        value={formData.sleep_hours}
                        onChange={handleChange}
                        className={errors.sleep_hours ? "border-red-500" : ""}
                        min="0"
                        max="24"
                        step="0.5"
                      />
                      {errors.sleep_hours && <p className="text-sm text-red-500">{errors.sleep_hours}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exercise_frequency">Exercise Frequency</Label>
                      <Select
                        value={formData.exercise_frequency}
                        onValueChange={(v) => handleSelectChange("exercise_frequency", v)}
                      >
                        <SelectTrigger id="exercise_frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Never">Never</SelectItem>
                          <SelectItem value="Rarely">Rarely (1-2 times/month)</SelectItem>
                          <SelectItem value="Sometimes">Sometimes (1-2 times/week)</SelectItem>
                          <SelectItem value="Regularly">Regularly (3-4 times/week)</SelectItem>
                          <SelectItem value="Daily">Daily (5+ times/week)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smoking_status">Smoking Status</Label>
                    <Select
                      value={formData.smoking_status}
                      onValueChange={(v) => handleSelectChange("smoking_status", v)}
                    >
                      <SelectTrigger id="smoking_status">
                        <SelectValue placeholder="Select your smoking status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Non-smoker">Non-smoker</SelectItem>
                        <SelectItem value="Former smoker">Former smoker</SelectItem>
                        <SelectItem value="Occasional smoker">Occasional smoker</SelectItem>
                        <SelectItem value="Regular smoker">Regular smoker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alcohol_consumption">Alcohol Consumption</Label>
                    <Select
                      value={formData.alcohol_consumption}
                      onValueChange={(v) => handleSelectChange("alcohol_consumption", v)}
                    >
                      <SelectTrigger id="alcohol_consumption">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Never">Never</SelectItem>
                        <SelectItem value="Rarely">Rarely (special occasions)</SelectItem>
                        <SelectItem value="Sometimes">Sometimes (1-2 times/week)</SelectItem>
                        <SelectItem value="Regularly">Regularly (3-4 times/week)</SelectItem>
                        <SelectItem value="Frequently">Frequently (daily/almost daily)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={handlePrevious}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-health-primary hover:bg-health-secondary" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                        Creating account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-health-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;