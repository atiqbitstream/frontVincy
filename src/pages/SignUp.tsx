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

  const validatePage1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.full_name) newErrors.full_name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePage2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nationality) newErrors.nationality = "Nationality is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.country) newErrors.country = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={errors.full_name ? "border-red-500" : ""}
                  />
                  {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      className={errors.dob ? "border-red-500" : ""}
                    />
                    {errors.dob && <p className="text-sm text-red-500">{errors.dob}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(v) => handleSelectChange("gender", v)}
                    >
                      <SelectTrigger id="gender" className={errors.gender ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select gender" />
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
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      name="nationality"
                      placeholder="American"
                      value={formData.nationality}
                      onChange={handleChange}
                      className={errors.nationality ? "border-red-500" : ""}
                    />
                    {errors.nationality && <p className="text-sm text-red-500">{errors.nationality}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="123456789"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      placeholder="USA"
                      value={formData.country}
                      onChange={handleChange}
                      className={errors.country ? "border-red-500" : ""}
                    />
                    {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    placeholder="Doctor"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marital_status">Marital Status</Label>
                  <Select
                    value={formData.marital_status}
                    onValueChange={(v) => handleSelectChange("marital_status", v)}
                  >
                    <SelectTrigger id="marital_status">
                      <SelectValue placeholder="Select status" />
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
                  <h3 className="text-sm font-medium">Lifestyle Information</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sleep_hours">Sleep Hours (daily)</Label>
                      <Input
                        id="sleep_hours"
                        name="sleep_hours"
                        type="number"
                        placeholder="8"
                        value={formData.sleep_hours}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exercise_frequency">Exercise (times/week)</Label>
                      <Select
                        value={formData.exercise_frequency}
                        onValueChange={(v) => handleSelectChange("exercise_frequency", v)}
                      >
                        <SelectTrigger id="exercise_frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Never">Never</SelectItem>
                          <SelectItem value="Rarely">Rarely</SelectItem>
                          <SelectItem value="Sometimes">Sometimes</SelectItem>
                          <SelectItem value="Regularly">Regularly</SelectItem>
                          <SelectItem value="Daily">Daily</SelectItem>
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
                        <SelectValue placeholder="Select status" />
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
                        <SelectItem value="Rarely">Rarely</SelectItem>
                        <SelectItem value="Sometimes">Sometimes</SelectItem>
                        <SelectItem value="Regularly">Regularly</SelectItem>
                        <SelectItem value="Frequently">Frequently</SelectItem>
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
                      "Sign Up"
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