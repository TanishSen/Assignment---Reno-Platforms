"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Upload, 
  Image as ImageIcon, 
  Check,
  ArrowLeft,
  Save,
  Loader2,
  Users
} from "lucide-react";

const schoolSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  contact: z
    .string()
    .min(7, "Contact must be at least 7 digits")
    .max(15, "Contact too long")
    .regex(/^\d+$/, "Contact must contain only digits"),
  email_id: z.string().email("Invalid email"),
  students: z
    .string()
    .min(1, "Number of students is required")
    .regex(/^\d+$/, "Must be a valid number")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "Must be greater than 0"),
});

type SchoolFormValues = z.infer<typeof schoolSchema>;

export default function AddSchoolPage() {
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submissionState, setSubmissionState] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SchoolFormValues) => {
    setSubmissionState(true);
    
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('state', data.state);
      formData.append('contact', data.contact);
      formData.append('email_id', data.email_id);
      formData.append('students', data.students.toString());
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await fetch('http://localhost:3001/api/schools', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save school');
      }

      const result = await response.json();
      
      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "School has been added successfully.",
      });
      
      // Reset form after successful submission
      reset();
      setPreview(null);
      setSelectedFile(null);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to save school. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmissionState(false);
    }
  };

  const handleGoBack = () => {
    window.location.href = '/';
  };

  const handleReset = () => {
    reset();
    setPreview(null);
    setSelectedFile(null);
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="mb-4 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New School</h1>
            <p className="text-lg text-gray-600">Register your educational institution</p>
          </div>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center text-green-700">
                <Check className="h-6 w-6 mr-2" />
                <span className="font-medium">School added successfully!</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Card className="max-w-2xl mx-auto shadow-lg border-blue-100">
          <CardHeader className="bg-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold">School Information</CardTitle>
            <CardDescription className="text-blue-100">
              Please fill in all the required details about your school
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* School Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  School Name *
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    {...register("name")}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter school name"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="address"
                    {...register("address")}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter complete address"
                    rows={3}
                  />
                </div>
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              {/* City and State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City *
                  </Label>
                  <Input
                    id="city"
                    {...register("city")}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                    State *
                  </Label>
                  <Input
                    id="state"
                    {...register("state")}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter state"
                  />
                  {errors.state && (
                    <p className="text-sm text-red-600">{errors.state.message}</p>
                  )}
                </div>
              </div>

              {/* Contact and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-sm font-medium text-gray-700">
                    Contact Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="contact"
                      {...register("contact")}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter contact number"
                    />
                  </div>
                  {errors.contact && (
                    <p className="text-sm text-red-600">{errors.contact.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email_id" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email_id"
                      type="email"
                      {...register("email_id")}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email_id && (
                    <p className="text-sm text-red-600">{errors.email_id.message}</p>
                  )}
                </div>
              </div>

              {/* Number of Students */}
              <div className="space-y-2">
                <Label htmlFor="students" className="text-sm font-medium text-gray-700">
                  Number of Students *
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="students"
                    type="number"
                    min="1"
                    {...register("students")}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter number of students"
                  />
                </div>
                {errors.students && (
                  <p className="text-sm text-red-600">{errors.students.message}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                  School Image
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  
                  {preview ? (
                    <div className="space-y-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="mx-auto h-40 w-auto rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('image')?.click()}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('image')?.click()}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                        <p className="mt-2 text-sm text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || submissionState}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting || submissionState ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save School
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}